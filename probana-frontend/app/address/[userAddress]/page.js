"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';
import {
    DynamicContextProvider,
    DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import {
    createConfig,
    WagmiProvider,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { polygon } from 'viem/chains';

const queryClient = new QueryClient();

const config = createConfig({
    chains: [polygon],
    multiInjectedProviderDiscovery: false,
    transports: {
        [polygon.id]: http(),
    },
});

export default function UserHoldingsPage(
    { params }
) {
    // const router = useRouter();
    const { userAddress } = params;

    const [userHoldings, setUserHoldings] = useState({ marketIds: [], yesShareBalances: [], noShareBalances: [], usdcBalance: 0 });

    useEffect(() => {
        if (!userAddress) return;

        async function fetchUserHoldings() {
            try {
                const provider = new ethers.providers.JsonRpcProvider("https://flow-mainnet.g.alchemy.com/v2/OkUye1LIb9ghN5Cxw1cEHi0G5wwWPW88");
                const contractABI = [
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
                    }
                ];
                const contractAddress = '0x7A0aE150F6E03f6B038B673c7B32341496F65f41';
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                const userPositions = await contract.getUserPositions(userAddress);

                setUserHoldings({
                    marketIds: userPositions[0],
                    yesShareBalances: userPositions[1],
                    noShareBalances: userPositions[2],
                    usdcBalance: userPositions[3]
                });

            } catch (error) {
                console.error('Error fetching user holdings:', error);
            }
        }

        fetchUserHoldings();

    }, [userAddress]);

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
                        <div className="flex flex-col min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-[100px]">
                            <h1 className="text-3xl font-bold mb-6">User Holdings for {userAddress}</h1>

                            <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                                <h2 className="text-xl font-semibold mb-2">USDC Balance</h2>
                                <p>{userHoldings.usdcBalance / 1e6} USDC</p>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                                <h2 className="text-xl font-semibold mb-2">Market Holdings</h2>
                                {userHoldings.marketIds.length > 0 ? (
                                    userHoldings.marketIds.map((marketId, index) => (
                                        <div key={marketId} className="mb-4">
                                            <h3 className="text-lg font-semibold">Market ID: {marketId}</h3>
                                            <p>YES Shares: {userHoldings.yesShareBalances[index] / 1e6}</p>
                                            <p>NO Shares: {userHoldings.noShareBalances[index] / 1e6}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No holdings found for this user.</p>
                                )}
                            </div>
                        </div>
                    </DynamicWagmiConnector>
                </QueryClientProvider>
            </WagmiProvider>
        </DynamicContextProvider>
    );
}
