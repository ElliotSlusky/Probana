"use client"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import contractABI from './abi.json';
import OrderbookUI from '../../components/orderbookUI';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';

import Navbar from '../../components/navbar';
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );
import {
    DynamicContextProvider,
    DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

import {
    createConfig,
    WagmiProvider,
    useAccount,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { polygon } from 'viem/chains';

const ethers = require('ethers');
const queryClient = new QueryClient();


const config = createConfig({
    chains: [polygon],
    multiInjectedProviderDiscovery: false,
    transports: {
        [polygon.id]: http(),
    },
});

export default function MarketPagrewe({ params, searchParams }) {

    return (
        <DynamicContextProvider
            settings={{
                environmentId: 'd001273d-4120-4857-ae19-2917f4b59790',
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <DynamicWagmiConnector>
                        <Navbar />
                        <MarketPage params={params} searchParams={searchParams} />
                    </DynamicWagmiConnector>
                </QueryClientProvider>
            </WagmiProvider>
        </DynamicContextProvider>
    );
}
function MarketPage({ params, searchParams }) {
    console.log("MarketPage component mounted");

    const { connector } = useAccount(); // Ensure this is at the top level

    const [price, setPrice] = useState(50); // Ensure this is at the top level
    const [side, setSide] = useState('Buy');
    const [type, setType] = useState('Yes');
    const [marketData, setMarketData] = useState(null);
    const [txnHash, setTxnHash] = useState(''); // Ensure this is at the top level
    const [amount, setAmount] = useState(100);
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] }); // Initialize order book data
    const [userHoldings, setUserHoldings] = useState({ marketIds: [], yesShareBalances: [], noShareBalances: [], usdcBalance: 0 });
    const { primaryWallet } = useDynamicContext();

    useEffect(() => {
        console.log("useEffect triggered with params.slug:", params.slug);

        async function fetchMarketData() {
            try {
                const response = await axios.post(
                    "https://subgraph.satsuma-prod.com/97d738dd3352/elliots-team--201737/Probana/version/v0.0.1-new-version/api",
                    {
                        query: `
                            {
                                marketCreateds(first: 500) {
                                    question
                                    id
                                    rules
                                    blockTimestamp
                                    marketId
                                }
                            }
                        `
                    }
                );

                // Check if the response contains data
                if (response.data && response.data.data) {
                    const markets = response.data.data.marketCreateds;
                    const found = markets.find(market => market.marketId === params.slug);

                    if (found) {
                        setMarketData(found);
                    } else {
                        // Redirect if no market is found
                        window.location.href = '/';
                    }
                } else {
                    console.error('No data found in response:', response);
                }
            } catch (error) {
                console.error('Error fetching market data:', error);
            }
        }

        fetchMarketData();



        async function fetchCatAAndCatB() {
            try {
                const provider = new ethers.providers.JsonRpcProvider("https://flow-mainnet.g.alchemy.com/v2/9IIgNnkZJvJlBGS8PVJH_4h_6AhE9HiU");

                const contractAddress = '0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e';
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                const marketId = parseInt(params.slug);
                const cata = await contract.getOrderBookCata(marketId);

                let cataarray = [];

                if (cata.noBuys && cata.yesBuys && cata.yesBuys.length > 0 && cata.noBuys.length > 0) {
                    cataarray = [...cata.yesBuys, ...cata.noBuys];
                } else if (cata.yesBuys && cata.yesBuys.length > 0 && (!cata.noBuys || cata.noBuys.length == 0)) {
                    cataarray = cata.yesBuys;
                } else if (cata.noBuys && cata.noBuys.length > 0 && (!cata.yesBuys || cata.yesBuys.length == 0)) {
                    cataarray = cata.noBuys;
                }

                console.log("cata teststts", cataarray)

                console.log("cata", cata)
                let arraybids = []
                let arrayasks = []


                for (let i = 0; i < cataarray.length; i++) {
                    // console.log("cata[i]", parseInt(cata[i].price))
                    // convert big number to int
                    const price = ethers.BigNumber.from(cataarray[i].price).toNumber();
                    const amount = ethers.BigNumber.from(cataarray[i].amount).toNumber();
                    const filled = ethers.BigNumber.from(cataarray[i].filled).toNumber();

                    console.log("price", price);
                    console.log("amount", amount);
                    console.log("filled", filled);
                    if (cataarray[i].side == 0) {
                        arraybids.push({
                            price: parseInt(cataarray[i].price),
                            shares: parseInt(cataarray[i].amount) - parseInt(cataarray[i].filled)
                        })
                    }
                    else {
                        arraybids.push({
                            price: parseInt(cataarray[i].price),
                            shares: parseInt(cataarray[i].amount) - parseInt(cataarray[i].filled)
                        })
                    }
                }

                const catb = await contract.getOrderBookCatb(marketId);

                let catbarray = [];

                if (catb.noBuys && catb.yesBuys && catb.yesBuys.length > 0 && catb.noBuys.length > 0) {
                    catbarray = [...catb.yesBuys, ...catb.noBuys];
                } else if (catb.yesBuys && catb.yesBuys.length > 0 && (!catb.noBuys || catb.noBuys.length == 0)) {
                    catbarray = catb.yesBuys;
                } else if (catb.noBuys && catb.noBuys.length > 0 && (!catb.yesBuys || catb.yesBuys.length == 0)) {
                    catbarray = catb.noBuys;
                }

                console.log("cata teststts", catbarray)

                console.log("cata", catb)


                for (let i = 0; i < catbarray.length; i++) {
                    // console.log("cata[i]", parseInt(cata[i].price))
                    // convert big number to int
                    const price = ethers.BigNumber.from(catbarray[i].price).toNumber();
                    const amount = ethers.BigNumber.from(catbarray[i].amount).toNumber();
                    const filled = ethers.BigNumber.from(catbarray[i].filled).toNumber();

                    console.log("price", price);
                    console.log("amount", amount);
                    console.log("filled", filled);
                    if (catbarray[i].side == 0) {
                        arrayasks.push({
                            price: parseInt(catbarray[i].price),
                            shares: parseInt(catbarray[i].amount) - parseInt(catbarray[i].filled)
                        })
                    }
                    else {
                        arrayasks.push({
                            price: parseInt(catbarray[i].price),
                            shares: parseInt(catbarray[i].amount) - parseInt(catbarray[i].filled)
                        })
                    }
                }

                // also do for catB

                setOrderBook({ bids: arraybids, asks: arrayasks })

                console.log("arraybids", arraybids)
                console.log("arrayasks", arrayasks)

            } catch (error) {
                console.error('Error fetching catA and catB:', error);
            }
        }

        fetchCatAAndCatB();

    }, [params.slug]); // Ensure dependencies are correct

    useEffect(() => {
        if (primaryWallet) {

            async function fetchUserHoldings() {
                try {

                    console.log("fetching user holdings")
                    const provider = new ethers.providers.JsonRpcProvider("https://flow-mainnet.g.alchemy.com/v2/9IIgNnkZJvJlBGS8PVJH_4h_6AhE9HiU");

                    const contractAddress = '0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e';
                    const contract = new ethers.Contract(contractAddress, contractABI, provider);

                    // const { primaryWallet, } = useDynamicContext();
                    const userwalletaddress = await primaryWallet.address;
                    console.log("userwalletaddress", userwalletaddress)
                    const marketId = parseInt(params.slug);

                    const yesShareBalance = await contract.yesShares(marketId, userwalletaddress);
                    const noShareBalance = await contract.noShares(marketId, userwalletaddress);


                    console.log("rwekjjrwqrwq", yesShareBalance, noShareBalance)
                    setUserHoldings({
                        marketIds: [marketId],
                        yesShareBalances: [yesShareBalance],
                        noShareBalances: [noShareBalance],
                        usdcBalance: userHoldings.usdcBalance // Assuming you have a way to get the USDC balance
                    });

                } catch (error) {
                    console.error('Error fetching user holdings:', error);
                }
            }

            fetchUserHoldings();
        }
        else {
            console.log("no primary wallet")
        }
    }, [primaryWallet]);




    // Destructure orderBook for easier access
    const { bids, asks } = orderBook;

    // Get the specific market ID from the URL params
    const marketId = parseInt(params.slug);

    // Filter holdings for the specific market
    const marketIndex = userHoldings.marketIds.indexOf(marketId);
    const specificMarketHoldings = marketIndex !== -1 ? {
        yesShares: userHoldings.yesShareBalances[marketIndex] / 1e6,
        noShares: userHoldings.noShareBalances[marketIndex] / 1e6
    } : { yesShares: 0, noShares: 0 };


    // Function to convert odds to cent format
    const convertOddsToCents = (odds) => {
        return (odds / 10).toFixed(1) + '¢';
    };

    // Adjust order book data based on type only
    const adjustedBids = type === 'Yes' ? orderBook.bids : orderBook.asks;
    const adjustedAsks = type === 'Yes' ? orderBook.asks : orderBook.bids;

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(event);

        const contractAddress = "0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e";

        if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

        async function placeOrder() {
            const publicClient = await primaryWallet.getPublicClient();
            const walletClient = await primaryWallet.getWalletClient();

            // Define the ABI of the contract function you want to call
            const abi = [
                "function placeOrder(uint256 marketId, uint8 side, uint8 outcome, uint256 amount, uint256 price) public"
            ];
            const iface = new ethers.utils.Interface(abi);

            console.log(amount)
            // console.log([params.slug, side === "Buy" ? 0 : 1, type === "Yes" ? 0 : 1, parseFloat(amount) * 10 ** 6, parseFloat(price) * 10 ** 4])

            console.log("hi sisters", [parseInt(params.slug), side === "Buy" ? 0 : 1, type === "Yes" ? 0 : 1, parseFloat(amount) * 10 ** 6, parseFloat(price) * 10 ** 4])
            // Encode the function call
            const data = iface.encodeFunctionData("placeOrder", [parseInt(params.slug), side === "Buy" ? 0 : 1, type === "Yes" ? 0 : 1, parseFloat(amount) * 10 ** 6, parseFloat(price) * 10 ** 4]);

            const transaction = {
                to: contractAddress,
                data: data,
            };

            const hash = await walletClient.sendTransaction(transaction);
            setTxnHash(hash);

            const receipt = await publicClient.getTransactionReceipt({
                hash,
            });

            console.log(receipt);
        };

        placeOrder(); // Call the function to place the order
    }

    // Calculate the buy-ask spread
    const bestBid = orderBook.bids.length > 0 ? orderBook.bids[0].price : 0;
    const bestAsk = orderBook.asks.length > 0 ? orderBook.asks[0].price : 0;
    const spread = bestAsk - bestBid;

    return (
        <div className="flex flex-col min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-[100px]">
            <h1 className="text-3xl font-bold mb-6">{marketData?.question}</h1>

            <div className="flex flex-row space-x-8 mb-6">
                {/* Market Rules Section */}
                <div className="w-2/3 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Market Rules</h2>
                    <p>{marketData?.rules}</p>
                </div>

                {/* Your Holdings Section */}
                <div className="w-1/3 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-center">Your Holdings for This Market</h2>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-medium">YES Shares</p>
                            <p className="text-2xl font-bold text-green-500">{specificMarketHoldings.yesShares}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-medium">NO Shares</p>
                            <p className="text-2xl font-bold text-red-500">{specificMarketHoldings.noShares}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row space-x-8">
                <div className="w-3/4">
                    <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">Current Odds</h2>
                        <p className="text-2xl">{spread > 0 ? `${spread.toFixed(2) / 10 ** 4}¢` : 'No Spread Available'}</p>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <OrderbookUI
                            bids={orderBook.bids}
                            asks={orderBook.asks}
                            side={side}
                            type={type}
                        />
                    </div>
                </div>

                <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6 rounded">
                    <h2 className="text-xl font-semibold mb-4">Place Limit Order</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="side" className="block mb-1">Side</label>
                            <select
                                id="side"
                                value={side}
                                onChange={(e) => setSide(e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option>Buy</option>
                                <option>Sell</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="type" className="block mb-1">Type</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block mb-1">Amount</label>
                            <input value={amount} onChange={(e) => { setAmount(e.target.value) }} type="number" id="amount" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="price" className="block mb-1">Price (¢)</label>
                            <input
                                value={price}
                                onChange={(e) => { setPrice(e.target.value) }}
                                type="number"
                                id="price"
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                step="0.1"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 dark:bg-blue-700 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-600">
                            Place Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}










