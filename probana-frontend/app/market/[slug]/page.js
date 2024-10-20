"use client"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { isEthereumWallet } from '@dynamic-labs/ethereum';

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
    const { connector } = useAccount(); // Ensure this is at the top level

    const [price, setPrice] = useState(0.5); // Ensure this is at the top level
    const [side, setSide] = useState('Buy');
    const [type, setType] = useState('Yes');
    const [marketData, setMarketData] = useState(null);
    const [txnHash, setTxnHash] = useState(''); // Ensure this is at the top level

    useEffect(() => {
        // if (!router.isReady) return; // Ensure router is ready before using it
        let found = null

        async function fetchMarketData() {
            const response = await axios.post("https://subgraph.satsuma-prod.com/97d738dd3352/elliots-team--201737/Probana/version/v0.0.1-new-version/api", `{"query":"{ marketCreateds(first: 500) { question id rules blockTimestamp marketId }}"}`)
            // find the market created with the id that matches params.slug
            for (let i = 0; i < response.data.data.marketCreateds.length; i++) {
                console.log(response.data.data.marketCreateds[i].marketId, params.slug)
                if (response.data.data.marketCreateds[i].marketId == params.slug) {

                    found = response.data.data.marketCreateds[i]

                    break;
                }
            }

            if (found == null) {
                // redirect to /
                window.location.href = '/';
                return
            }

            setMarketData(found);
        }


        fetchMarketData();




        // Function to call a read function from the contract
        async function callReadFunction() {
            try {
                // Use the connected wallet's provider
                const provider = connector?.getProvider();

                if (!provider) {
                    console.error('No provider found');
                    return;
                }

                // Define the contract ABI and address
                const contractABI = [{
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getOrderBookCata",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "marketId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "trader",
                                    "type": "address"
                                },
                                {
                                    "internalType": "enum Probana.Side",
                                    "name": "side",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "enum Probana.Outcome",
                                    "name": "outcome",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "price",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "filled",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Probana.Order[]",
                            "name": "yesBuys",
                            "type": "tuple[]"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "marketId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "trader",
                                    "type": "address"
                                },
                                {
                                    "internalType": "enum Probana.Side",
                                    "name": "side",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "enum Probana.Outcome",
                                    "name": "outcome",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "price",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "filled",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Probana.Order[]",
                            "name": "noSells",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getOrderBookCatb",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "marketId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "trader",
                                    "type": "address"
                                },
                                {
                                    "internalType": "enum Probana.Side",
                                    "name": "side",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "enum Probana.Outcome",
                                    "name": "outcome",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "price",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "filled",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Probana.Order[]",
                            "name": "yesSells",
                            "type": "tuple[]"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "marketId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "trader",
                                    "type": "address"
                                },
                                {
                                    "internalType": "enum Probana.Side",
                                    "name": "side",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "enum Probana.Outcome",
                                    "name": "outcome",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "price",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "filled",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Probana.Order[]",
                            "name": "noBuys",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },]
                const contractAddress = '0xD236817d53C20412E245699f2ae332eFDDf22D98';

                // Create a contract instance
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                // Replace 'readFunctionName' with the actual function name you want to call
                const result = await contract.getOrderBookCata(found.marketId);
                console.log('Result:', result);
            } catch (error) {
                console.error('Error calling read function:', error);
            }
        }

        callReadFunction()





    }, [connector]); // Ensure dependencies are correct
    const { primaryWallet } = useDynamicContext();

    // Function to convert odds to cent format and adjust for "No" type
    const convertOddsToCents = (odds) => {
        const adjustedOdds = type === 'Yes' ? odds : 1000 - odds;
        return (adjustedOdds / 10).toFixed(1) + '¢';
    };

    // // Mock data for the price chart with dark mode-friendly colors
    // const chartData = {
    //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    //     datasets: [
    //         {
    //             label: 'Price',
    //             data: [0.3, 0.5, 0.4, 0.6, 0.5, price],
    //             borderColor: '#4FD1C5', // Tailwind's teal-400
    //             backgroundColor: 'rgba(79, 209, 197, 0.2)', // Semi-transparent teal
    //             tension: 0.1
    //         }
    //     ]
    // };

    // Chart options with dark mode considerations
    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'currentColor', // Adapts to text color
                }
            },
            title: {
                display: false,
                text: 'Price Chart',
                color: 'currentColor',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white', // Set tick mark color to white
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            },
            y: {
                ticks: {
                    color: 'white', // Set tick mark color to white
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        color: 'currentColor'
    };

    // Mock data for the order book
    const orderBookData = {
        bids: [
            { odds: 400, shares: 3351.3, total: '$7,783.63' },


        ],
        asks: [
            { odds: 500, shares: 3351.3, total: '$7,783.63' },

        ]
    };

    // Adjust order book data based on type only
    const adjustedBids = type === 'Yes' ? orderBookData.bids : orderBookData.asks;
    const adjustedAsks = type === 'Yes' ? orderBookData.asks : orderBookData.bids;

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(event);

        const contractAddress = "0x7A0aE150F6E03f6B038B673c7B32341496F65f41";

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
            console.log([params.slug, side === "Buy" ? 0 : 1, type === "Yes" ? 0 : 1, parseFloat(amount) * 10 ** 6, parseFloat(price) * 10 ** 4])
            // Encode the function call
            const data = iface.encodeFunctionData("placeOrder", [params.slug, side === "Buy" ? 0 : 1, type === "Yes" ? 0 : 1, parseFloat(amount) * 10 ** 6, parseFloat(price) * 10 ** 4]);

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

    return (
        <div className="flex flex-col min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-[100px]">
            <h1 className="text-3xl font-bold mb-6">{marketData?.name}</h1>

            {/* New section to display the rules */}
            <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">Market Rules</h2>
                <p>{marketData?.rules}</p>
            </div>

            <div className="flex flex-row space-x-8">
                <div className="w-3/4">
                    <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">Current Odds</h2>
                        <p className="text-2xl">{(price * 100).toFixed(2)}%</p>
                    </div>

                    {/* <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">Price Chart</h2>
                        <div className="h-64">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div> */}

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <OrderbookUI
                            bids={adjustedBids.map(bid => ({
                                ...bid,
                                price: convertOddsToCents(bid.odds)
                            }))}
                            asks={adjustedAsks.map(ask => ({
                                ...ask,
                                price: convertOddsToCents(ask.odds)
                            }))}
                            tradeType={`${side} ${type}`}
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
                            <input type="number" id="amount" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="price" className="block mb-1">Price</label>
                            <input value={price} onChange={(e) => { setPrice(e.target.value) }} type="number" id="price" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
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
