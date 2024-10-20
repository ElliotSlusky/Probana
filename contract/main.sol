// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);
    function transfer(address recipient, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint);
}

contract Probana {
    IERC20 public usdc;
    enum Outcome {
        Yes,
        No
    }

    struct Market {
        uint id;
        string name;
        string rules;
        address creator;
        bool isActive;
        Outcome winningOutcome;
        string yesLabel; // Add this line for custom Yes label
        string noLabel;  // Add this line for custom No label
    }

    struct Order {
        uint id;
        uint marketId;
        address trader;
        Outcome outcome;
        uint amount;
        uint price; // Represented as 1-999 (0.001 cents to 99.9 cents)
    }

    uint public nextMarketId;
    uint public nextOrderId;
    address public resolverAdmin;

    mapping(uint => Market) public markets;
    mapping(uint => Order) public orders;
    mapping(uint => uint[]) public marketYesOrders; // Maps market ID to Yes orders
    mapping(uint => uint[]) public marketNoOrders; // Maps market ID to No orders

    mapping(address => uint) public balances; // USDC balance within the contract for each user

    event MarketCreated(
        uint marketId,
        string name,
        string rules,
        address creator,
        string yesLabel,
        string noLabel
    );
    event MarketClosed(uint marketId, Outcome winningOutcome); // Modify event to include winning outcome
    event OrderPlaced(
        uint orderId,
        uint marketId,
        address trader,
        Outcome outcome,
        uint amount,
        uint price
    );

    event OrderCancelled(uint orderId);
    event OrderMatched(
        uint marketId,
        uint orderId,
        uint matchedAmount,
        uint price
    );
    event Deposit(address indexed user, uint amount);
    event Withdraw(address indexed user, uint amount);
    event OrderBookUpdated(
        uint marketId,
        uint[] yesOrders,
        uint[] noOrders
    );

    constructor(address usdcAddress) {
        usdc = IERC20(usdcAddress);
        resolverAdmin = msg.sender;
    }

    function createMarket(
        string memory name,
        string memory rules,
        string memory yesLabel,
        string memory noLabel
    ) external {
        uint marketId = nextMarketId++;
        markets[marketId] = Market(
            marketId, 
            name, 
            rules, 
            msg.sender, 
            true, 
            Outcome.Yes, // Default value, can be set to any as it won't be used until market is closed
            yesLabel,    // Set custom Yes label
            noLabel      // Set custom No label
        );
        emit MarketCreated(marketId, name, rules, msg.sender, yesLabel, noLabel);
    }

    function closeMarket(uint marketId, Outcome winningOutcome) external {
        Market storage market = markets[marketId];
        require(
            resolverAdmin == msg.sender,
            "Only the market creator can close the market"
        );
        require(market.isActive, "Market is already closed");

        market.isActive = false;
        market.winningOutcome = winningOutcome; // Set the winning outcome

        // Distribute funds to the winning side
        _distributeFunds(marketId, winningOutcome);

        emit MarketClosed(marketId, winningOutcome);
    }

    function _distributeFunds(uint marketId, Outcome winningOutcome) internal {
        uint[] storage winningOrders = winningOutcome == Outcome.Yes
            ? marketYesOrders[marketId]
            : marketNoOrders[marketId];

        for (uint i = 0; i < winningOrders.length; i++) {
            Order storage order = orders[winningOrders[i]];
            uint payout = (order.amount * order.price) / 1000;
            balances[order.trader] += payout;
        }
    }

    function deposit(uint amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        require(usdc.transfer(msg.sender, amount), "Transfer failed");

        emit Withdraw(msg.sender, amount);
    }

    function placeOrder(
        uint marketId,
        Outcome outcome,
        uint amount,
        uint price
    ) external {
        Market storage market = markets[marketId];
        require(market.isActive, "Market is not active");
        require(amount > 0, "Amount must be greater than 0");
        require(price >= 1 && price <= 999, "Price must be between 1 and 999");

        uint orderCost = (amount * price) / 1000;
        require(
            balances[msg.sender] >= orderCost,
            "Insufficient balance to place order"
        );

        balances[msg.sender] -= orderCost;

        uint orderId = nextOrderId++;
        orders[orderId] = Order(
            orderId,
            marketId,
            msg.sender,
            outcome,
            amount,
            price
        );

        if (outcome == Outcome.Yes) {
            marketYesOrders[marketId].push(orderId);
        } else {
            marketNoOrders[marketId].push(orderId);
        }

        emit OrderPlaced(orderId, marketId, msg.sender, outcome, amount, price);
        emit OrderBookUpdated(marketId, marketYesOrders[marketId], marketNoOrders[marketId]); // Emit order book update
        matchOrders(marketId);
    }

    function cancelOrder(uint orderId) external {
        Order memory order = orders[orderId];
        require(
            order.trader == msg.sender,
            "Only the order creator can cancel"
        );

        uint refundAmount = (order.amount * order.price) / 1000;
        balances[msg.sender] += refundAmount;

        delete orders[orderId];
        _removeOrderFromArray(orderId, order.marketId, order.outcome);

        emit OrderCancelled(orderId);
        emit OrderBookUpdated(order.marketId, marketYesOrders[order.marketId], marketNoOrders[order.marketId]); // Emit order book update
    }

    function matchOrders(uint marketId) internal {
        while (
            marketYesOrders[marketId].length > 0 &&
            marketNoOrders[marketId].length > 0
        ) {
            uint yesOrderId = marketYesOrders[marketId][0];
            uint noOrderId = marketNoOrders[marketId][0];

            Order storage yesOrder = orders[yesOrderId];
            Order storage noOrder = orders[noOrderId];

            if (yesOrder.price >= noOrder.price) {
                uint matchedAmount = _min(yesOrder.amount, noOrder.amount);
                uint matchedPrice = (yesOrder.price + noOrder.price) / 2;

                yesOrder.amount -= matchedAmount;
                noOrder.amount -= matchedAmount;

                uint matchedCost = (matchedAmount * matchedPrice) / 1000;
                balances[yesOrder.trader] += matchedCost;
                balances[noOrder.trader] += matchedCost;

                emit OrderMatched(
                    marketId,
                    yesOrderId,
                    matchedAmount,
                    matchedPrice
                );
                emit OrderMatched(
                    marketId,
                    noOrderId,
                    matchedAmount,
                    matchedPrice
                );

                if (yesOrder.amount == 0) {
                    _removeOrderFromArray(yesOrderId, marketId, Outcome.Yes);
                }
                if (noOrder.amount == 0) {
                    _removeOrderFromArray(noOrderId, marketId, Outcome.No);
                }

                emit OrderBookUpdated(marketId, marketYesOrders[marketId], marketNoOrders[marketId]); // Emit order book update
            } else {
                break;
            }
        }
    }

    function _removeOrderFromArray(
        uint orderId,
        uint marketId,
        Outcome outcome
    ) internal {
        uint[] storage orderArray = outcome == Outcome.Yes
            ? marketYesOrders[marketId]
            : marketNoOrders[marketId];
        for (uint i = 0; i < orderArray.length; i++) {
            if (orderArray[i] == orderId) {
                orderArray[i] = orderArray[orderArray.length - 1];
                orderArray.pop();
                break;
            }
        }
    } 

    function _min(uint a, uint b) internal pure returns (uint) {
        return a < b ? a : b;
    }

    function getMarket(uint marketId) external view returns (Market memory) {
        return markets[marketId];
    }

    function getOrder(uint orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    function getYesOrders(uint marketId) external view returns (uint[] memory) {
        return marketYesOrders[marketId];
    }

    function getNoOrders(uint marketId) external view returns (uint[] memory) {
        return marketNoOrders[marketId];
    }

    function getUserOrdersForMarket(address user, uint marketId) external view returns (Order[] memory) {
        uint count = 0;
        for (uint i = 0; i < nextOrderId; i++) {
            if (orders[i].trader == user && orders[i].marketId == marketId) {
                count++;
            }
        }

        Order[] memory userOrders = new Order[](count);
        uint index = 0;
        for (uint i = 0; i < nextOrderId; i++) {
            if (orders[i].trader == user && orders[i].marketId == marketId) {
                userOrders[index] = orders[i];
                index++;
            }
        }

        return userOrders;
    }
}
