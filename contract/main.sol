// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Probana {
    IERC20 public usdc;

    enum Outcome { Yes, No }
    enum Side { Buy, Sell }

    struct Market {
        uint256 id;
        string question;
        string rules;
        bool isActive;
        Outcome winningOutcome;
    }

    struct Order {
        uint256 id;
        uint256 marketId;
        address trader;
        Side side;
        Outcome outcome;
        uint256 amount; // Amount in shares (6 decimals)
        uint256 price;  // Price per share in USDC (6 decimals)
        uint256 filled; // Amount of shares already filled
    }

    uint256 public nextMarketId;
    uint256 public nextOrderId;

    address public owner; // Added owner variable

    mapping(uint256 => Market) public markets;

    mapping(uint256 => mapping(Side => mapping(Outcome => Order[]))) public orderBook;

    mapping(address => uint256) public balances; // USDC balances

    mapping(uint256 => mapping(address => uint256)) public yesShares; // Market ID => Trader => Shares
    mapping(uint256 => mapping(address => uint256)) public noShares;

    event MarketCreated(uint256 marketId, string question, string rules);
    event MarketResolved(uint256 marketId, Outcome winningOutcome);
    event OrderPlaced(uint256 orderId, uint256 marketId, address trader, Side side, Outcome outcome, uint256 amount, uint256 price);
    event OrderCancelled(uint256 orderId);
    event OrderMatched(uint256 marketId, uint256 orderId1, uint256 orderId2, uint256 matchedAmount);
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event WinningsClaimed(uint256 marketId, address indexed user, uint256 amount);

    constructor(address _usdcAddress) {
        usdc = IERC20(_usdcAddress);
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Deposit USDC into the contract
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    // Withdraw USDC from the contract
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance to withdraw");
        balances[msg.sender] -= amount;
        require(usdc.transfer(msg.sender, amount), "USDC transfer failed");
        emit Withdrawal(msg.sender, amount);
    }

    // Create a new market
    function createMarket(string calldata question,string calldata rules) external {
        markets[nextMarketId] = Market({
            id: nextMarketId,
            question: question,
            isActive: true,
            winningOutcome: Outcome.Yes ,// Default value
            rules: rules
        });
        emit MarketCreated(nextMarketId, question,rules);
        nextMarketId++;
    }

    // Place an order
    function placeOrder(
        uint256 marketId,
        Side side,
        Outcome outcome,
        uint256 amount,
        uint256 price
    ) external {
        require(markets[marketId].isActive, "Market is not active");
        require(amount > 0, "Order amount must be greater than zero");
        require(price > 0 && price < 1e6, "Price must be between 0 and 1e6 (1 USDC)");

        if (side == Side.Buy) {
            // Lock up funds for buy order
            uint256 totalCost = (amount * price) / 1e6; // amount * price per share
            require(balances[msg.sender] >= totalCost, "Insufficient balance for buy order");
            balances[msg.sender] -= totalCost;
        } else {
            // Ensure the seller has enough shares
            if (outcome == Outcome.Yes) {
                require(yesShares[marketId][msg.sender] >= amount, "Not enough YES shares to sell");
                yesShares[marketId][msg.sender] -= amount;
            } else {
                require(noShares[marketId][msg.sender] >= amount, "Not enough NO shares to sell");
                noShares[marketId][msg.sender] -= amount;
            }
        }

        Order memory newOrder = Order({
            id: nextOrderId,
            marketId: marketId,
            trader: msg.sender,
            side: side,
            outcome: outcome,
            amount: amount,
            price: price,
            filled: 0
        });

        // Add the order to the order book
        orderBook[marketId][side][outcome].push(newOrder);

        emit OrderPlaced(nextOrderId, marketId, msg.sender, side, outcome, amount, price);

        // Attempt to match orders
        matchOrders(marketId, side, outcome);

        nextOrderId++;
    }

    // Match orders
    function matchOrders(uint256 marketId, Side side, Outcome outcome) internal {
        Side oppositeSide = side;
        Outcome oppositeOutcome = outcome == Outcome.Yes ? Outcome.No : Outcome.Yes;

        Order[] storage myOrders = orderBook[marketId][side][outcome];
        Order[] storage oppositeOrders = orderBook[marketId][oppositeSide][oppositeOutcome];

        if (myOrders.length == 0 || oppositeOrders.length == 0) {
            return;
        }

        Order storage myOrder = myOrders[myOrders.length - 1];

        while (myOrder.filled < myOrder.amount && oppositeOrders.length > 0) {
            Order storage oppOrder = oppositeOrders[oppositeOrders.length - 1];

            // Check if prices are complementary
            if (myOrder.price + oppOrder.price == 1e6) {
                uint256 matchedAmount = min(myOrder.amount - myOrder.filled, oppOrder.amount - oppOrder.filled);

                if (matchedAmount > 0) {
                    if (side == Side.Buy) {
                        // Both buyers receive shares
                        if (outcome == Outcome.Yes) {
                            yesShares[marketId][myOrder.trader] += matchedAmount;
                            noShares[marketId][oppOrder.trader] += matchedAmount;
                        } else {
                            noShares[marketId][myOrder.trader] += matchedAmount;
                            yesShares[marketId][oppOrder.trader] += matchedAmount;
                        }
                    } else {
                        // Both sellers receive funds
                        uint256 myProceeds = (matchedAmount * myOrder.price) / 1e6;
                        uint256 oppProceeds = (matchedAmount * oppOrder.price) / 1e6;

                        balances[myOrder.trader] += myProceeds;
                        balances[oppOrder.trader] += oppProceeds;
                    }

                    myOrder.filled += matchedAmount;
                    oppOrder.filled += matchedAmount;

                    emit OrderMatched(marketId, myOrder.id, oppOrder.id, matchedAmount);

                    // Remove fully filled orders
                    if (oppOrder.filled == oppOrder.amount) {
                        oppositeOrders.pop();
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        // Remove my order if fully filled
        if (myOrder.filled == myOrder.amount) {
            myOrders.pop();
        }
    }

    // Cancel an order
    function cancelOrder(uint256 marketId, uint256 orderId, Side side, Outcome outcome) external {
        Order[] storage orders = orderBook[marketId][side][outcome];

        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].id == orderId) {
                require(orders[i].trader == msg.sender, "Not your order");
                uint256 unfilledAmount = orders[i].amount - orders[i].filled;

                if (side == Side.Buy) {
                    uint256 refundAmount = (unfilledAmount * orders[i].price) / 1e6;
                    balances[msg.sender] += refundAmount;
                } else {
                    // Return shares to the seller
                    if (outcome == Outcome.Yes) {
                        yesShares[marketId][msg.sender] += unfilledAmount;
                    } else {
                        noShares[marketId][msg.sender] += unfilledAmount;
                    }
                }

                // Remove the order
                orders[i] = orders[orders.length - 1];
                orders.pop();

                emit OrderCancelled(orderId);
                break;
            }
        }
    }

    // Resolve a market
    function resolveMarket(uint256 marketId, Outcome winningOutcome) external {
        require(msg.sender == owner, "Only contract owner can resolve market"); // Only owner can resolve
        Market storage market = markets[marketId];
        require(market.isActive, "Market already resolved");
        market.isActive = false;
        market.winningOutcome = winningOutcome;
        emit MarketResolved(marketId, winningOutcome);
    }

    // Claim winnings
    function claimWinnings(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(!market.isActive, "Market not yet resolved");

        uint256 payout;
        if (market.winningOutcome == Outcome.Yes) {
            payout = yesShares[marketId][msg.sender];
            yesShares[marketId][msg.sender] = 0;
        } else {
            payout = noShares[marketId][msg.sender];
            noShares[marketId][msg.sender] = 0;
        }

        require(payout > 0, "No winnings to claim");

        balances[msg.sender] += payout;

        emit WinningsClaimed(marketId, msg.sender, payout);
    }

    // Utility functions
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

        // Get Order Book Category A: YES share buys and NO share sells
    function getOrderBookCata(uint256 marketId) public view returns (
        Order[] memory yesBuys,
        Order[] memory noSells
    ) {
        yesBuys = orderBook[marketId][Side.Buy][Outcome.Yes];
        noSells = orderBook[marketId][Side.Sell][Outcome.No];
    }

    // Get Order Book Category B: YES share sells and NO share buys
    function getOrderBookCatb(uint256 marketId) public view returns (
        Order[] memory yesSells,
        Order[] memory noBuys
    ) {
        yesSells = orderBook[marketId][Side.Sell][Outcome.Yes];
        noBuys = orderBook[marketId][Side.Buy][Outcome.No];
    }

    // Get all positions of a user across all markets
    function getUserPositions(address user) public view returns (
        uint256[] memory marketIds,
        uint256[] memory yesShareBalances,
        uint256[] memory noShareBalances,
        uint256 usdcBalance
    ) {
        usdcBalance = balances[user];
        uint256 marketCount = nextMarketId;
        uint256 positionCount = 0;

        // First, count how many markets the user has positions in
        for (uint256 i = 0; i < marketCount; i++) {
            if (yesShares[i][user] > 0 || noShares[i][user] > 0) {
                positionCount++;
            }
        }

        // Initialize arrays with the correct size
        marketIds = new uint256[](positionCount);
        yesShareBalances = new uint256[](positionCount);
        noShareBalances = new uint256[](positionCount);
        uint256 index = 0;

        // Populate the arrays with user's positions
        for (uint256 i = 0; i < marketCount; i++) {
            if (yesShares[i][user] > 0 || noShares[i][user] > 0) {
                marketIds[index] = i;
                yesShareBalances[index] = yesShares[i][user];
                noShareBalances[index] = noShares[i][user];
                index++;
            }
        }
    }
}