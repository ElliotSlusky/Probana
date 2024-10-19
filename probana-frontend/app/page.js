"use client"
import {
  DynamicContextProvider,
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import {
  createConfig,
  WagmiProvider,
  useAccount,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { polygon } from 'viem/chains';
import Navbar from './components/navbar';
import MarketGrid from './components/marketGrid';
import marketDetails from './marketDetails';

const config = createConfig({
  chains: [polygon],
  multiInjectedProviderDiscovery: false,
  transports: {
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();




export default function App() {
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
            <Navbar/>
            <MarketGrid marketDetails={marketDetails}/>
            <AccountInfo />
            <MarketGrid />
            {/* <AccountInfo /> */}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

function AccountInfo() {
  const { address, isConnected, chain } = useAccount();

  return (
    <div>
      <p>
        Polygon connected: {isConnected ? 'true' : 'false'}
      </p>
      <p>Polygon address: {address}</p>
      <p>Polygon network: {chain?.id}</p>
    </div>
  );
}
