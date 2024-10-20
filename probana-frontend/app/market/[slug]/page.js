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
    }, [params.slug]); // Ensure dependencies are correct

    async function fetchUserHoldings() {
        try {
            const provider = new ethers.providers.JsonRpcProvider("https://flow-mainnet.g.alchemy.com/v2/9IIgNnkZJvJlBGS8PVJH_4h_6AhE9HiU");
            const contractABI = [
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "orderId",
                            "type": "uint256"
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
                        }
                    ],
                    "name": "cancelOrder",
                    "outputs": [],
                    "stateMutability": "nonpayable",
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
                    "name": "claimWinnings",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "question",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "rules",
                            "type": "string"
                        }
                    ],
                    "name": "createMarket",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "deposit",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_usdcAddress",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "Deposit",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "question",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "rules",
                            "type": "string"
                        }
                    ],
                    "name": "MarketCreated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum Probana.Outcome",
                            "name": "winningOutcome",
                            "type": "uint8"
                        }
                    ],
                    "name": "MarketResolved",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "orderId",
                            "type": "uint256"
                        }
                    ],
                    "name": "OrderCancelled",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "orderId1",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "orderId2",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "matchedAmount",
                            "type": "uint256"
                        }
                    ],
                    "name": "OrderMatched",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "orderId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "trader",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum Probana.Side",
                            "name": "side",
                            "type": "uint8"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum Probana.Outcome",
                            "name": "outcome",
                            "type": "uint8"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "name": "OrderPlaced",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
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
                        }
                    ],
                    "name": "placeOrder",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum Probana.Outcome",
                            "name": "winningOutcome",
                            "type": "uint8"
                        }
                    ],
                    "name": "resolveMarket",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "marketId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "WinningsClaimed",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "Withdrawal",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "balances",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
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
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        }
                    ],
                    "name": "getUserActiveOrders",
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
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        }
                    ],
                    "name": "getUserPositions",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "marketIds",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "yesShareBalances",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "noShareBalances",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "uint256",
                            "name": "usdcBalance",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "markets",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "question",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "rules",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "isActive",
                            "type": "bool"
                        },
                        {
                            "internalType": "enum Probana.Outcome",
                            "name": "winningOutcome",
                            "type": "uint8"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "nextMarketId",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "nextOrderId",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "noShares",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum Probana.Side",
                            "name": "",
                            "type": "uint8"
                        },
                        {
                            "internalType": "enum Probana.Outcome",
                            "name": "",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "orderBook",
                    "outputs": [
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
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "usdc",
                    "outputs": [
                        {
                            "internalType": "contract IERC20",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "yesShares",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ];
            const contractAddress = '0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e';
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            const { primaryWallet, } = useDynamicContext();
            const userwalletaddress = await primaryWallet.address;
            const marketId = parseInt(params.slug);

            const yesShareBalance = await contract.yesShares(marketId, userwalletaddress);
            const noShareBalance = await contract.noShares(marketId, userwalletaddress);


            console.log(yesShareBalance, noShareBalance)
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

    const { primaryWallet } = useDynamicContext();

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

                    {/* New section to display user holdings for the specific market */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Your Holdings for Market ID: {marketId}</h2>
                        <p>YES Shares: {specificMarketHoldings.yesShares}</p>
                        <p>NO Shares: {specificMarketHoldings.noShares}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}





