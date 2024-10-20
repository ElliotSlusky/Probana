import {
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ApproveSpending from './approveSpending';
import { IoMdClose } from 'react-icons/io';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { ethers } from 'ethers';
import axios from 'axios';
import UnlimitOverlay from '../../app/components/unlimitOverlay';
import abiContract from './abi.json';

const SUBGRAPH_ENDPOINT = 'https://subgraph.satsuma-prod.com/97d738dd3352/elliots-team--201737/Probana/version/v0.0.1-new-version/api'; // Replace with your subgraph endpoint

function MarketModal({ marketOpen, setMarketOpen }) {
  const [prompt, setPrompt] = useState(null)
  const [rules, setRules] = useState(null)

  const contractAddress = "0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e";
  // const spenderAddress = "0x7A0aE150F6E03f6B038B673c7B32341496F65f41";
  const amount = ethers.utils.parseUnits("1.0", 18); // Convert 1.0 ETH to wei
  const { primaryWallet } = useDynamicContext();
  const [txnHash, setTxnHash] = useState('');

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

  async function createMarket() {


    const publicClient = await primaryWallet.getPublicClient();
    const walletClient = await primaryWallet.getWalletClient();

    // Define the ABI of the contract function you want to call
    const abi = [
      "function createMarket(string question, string rules) public"
    ];
    const iface = new ethers.utils.Interface(abi);

    // Encode the function call
    const data = iface.encodeFunctionData("createMarket", [prompt, rules]);

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

  return (
    <div className="absolute w-full h-full bg-[rgba(0,0,0,0.5)] items-center justify-center flex" onClick={() => { setMarketOpen(false) }}>
      <div className="flex-col flex gap-[10px] items-center bg-[#1d2b39] w-min p-[50px] rounded-lg" onClick={(e) => { e.stopPropagation() }}>
        {/* <Navbar/> */}
        <h3 className='text-[24px] font-bold'>
          Create Market
        </h3>
        <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
          <input value={prompt} onChange={(e) => { setPrompt(e.target.value) }} type="text" placeholder="Prompt" className="bg-transparent outline-none" />
        </div>

        <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
          <input value={rules} onChange={(e) => { setRules(e.target.value) }} type="text" placeholder="Rules" className="bg-transparent outline-none" />
        </div>

        <button
          className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
          onClick={() => {
            createMarket()
            setMarketOpen(false)
          }}
        >
          Create Market
        </button>
      </div>
    </div>
  )
}

function DepositModal({ depositOpen, setDepositOpen }) {
  const [depositAmt, setDepositAmt] = useState()


  const contractAddress = "0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e";
  const { primaryWallet } = useDynamicContext();
  const [txnHash, setTxnHash] = useState('');

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;


  async function deposit() {


    const publicClient = await primaryWallet.getPublicClient();
    const walletClient = await primaryWallet.getWalletClient();

    // Define the ABI of the contract function you want to call
    const abi = [
      "function deposit(uint256 amount) public"
    ];
    const iface = new ethers.utils.Interface(abi);

    // Encode the function call
    const data = iface.encodeFunctionData("deposit", [depositAmt * 10 ** 6]);

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


  return (
    <div className="absolute w-full h-full bg-[rgba(0,0,0,0.5)] items-center justify-center flex" onClick={() => { setDepositOpen(false) }}>
      <div className="flex-col flex gap-[10px] items-center bg-[#1d2b39] w-min p-[50px] rounded-lg" onClick={(e) => { e.stopPropagation() }}>
        <div className='flex flex-row justify-between w-full'>
          <h3 className='text-[24px] font-bold'>
            Deposit Money
          </h3>
          <button onClick={() => setDepositOpen(false)}>
            <IoMdClose size={25} className='p-[4px] rounded-sm bg-[rgba(255,255,255,0.3)] w-min h-min' />
          </button>
        </div>
        <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
          <input value={depositAmt} onChange={(e) => { setDepositAmt(e.target.value) }} type="number" placeholder="0.00" className="bg-transparent outline-none" />
        </div>

        <button
          className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
          onClick={() => {
            setDepositOpen(false)
            deposit()
          }}
        >
          Deposit
        </button>
      </div>
    </div>
  )
}

function OrdersModal({ ordersOpen, setOrdersOpen }) {
  const { primaryWallet, } = useDynamicContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (primaryWallet && isEthereumWallet(primaryWallet)) {
      fetchOrders();
    }
  }, [primaryWallet]);

  async function fetchOrders() {
    setLoading(true);
    setError(null);

    try {
      const userwalletaddress = await primaryWallet.address;
      if (!userwalletaddress) {
        throw new Error("Failed to get wallet address");
      }

      const contractAddress = "0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e";
      const abi = [
        "function getOrders(address user) view returns (Order[])"
      ];

      const provider = new ethers.providers.JsonRpcProvider("https://flow-mainnet.g.alchemy.com/v2/9IIgNnkZJvJlBGS8PVJH_4h_6AhE9HiU");

      const contract = new ethers.Contract(contractAddress, abi, provider);

      // Call the read function
      const orders = await contract.getUserActiveOrders(userwalletaddress);

      console.log(orders);
      setOrders(orders); // Assuming the function returns an array of orders
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder(marketId, orderId, side, outcome) {
    console.log(marketId, orderId, side, outcome);
    const contractAddress = "0x83FdcE89CA94d141fd1a6dCc62a91f93E2c0C51e";
    const abi = [
      "function cancelOrder(uint256 marketId, uint256 orderId, uint8 side, uint8 outcome)"
    ];


    const publicClient = await primaryWallet.getPublicClient();
    const walletClient = await primaryWallet.getWalletClient();


    const iface = new ethers.utils.Interface(abi);

    // Encode the function call
    const data = iface.encodeFunctionData("cancelOrder", [marketId, orderId, side, outcome]);

    const transaction = {
      to: contractAddress,
      data: data,
    };

    const hash = await walletClient.sendTransaction(transaction);
    setTxnHash(hash);

    const receipt = await publicClient.getTransactionReceipt({
      hash,
    });

    fetchOrders(); // Optionally refetch orders after cancellation
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="absolute w-full h-full bg-[rgba(0,0,0,0.5)] items-center justify-center flex" onClick={() => { setOrdersOpen(false) }}>
      <div className="flex-col flex gap-[10px] items-center bg-[#1d2b39] w-min p-[50px] rounded-lg" onClick={(e) => { e.stopPropagation() }}>
        <div className='flex flex-row justify-between w-full'>
          <h3 className='text-[24px] font-bold'>
            Your Orders
          </h3>
          <button onClick={() => setOrdersOpen(false)}>
            <IoMdClose size={25} className='p-[4px] rounded-sm bg-[rgba(255,255,255,0.3)] w-min h-min' />
          </button>
        </div>
        <div className="text-white">
          {orders?.map((order, index) => (
            <div key={index} className="border-b border-gray-600 py-2">
              <p>Market ID: {order.marketId}</p>
              <p>Order ID: {order.id}</p>
              <p>Side: {order.side === 0 ? 'Buy' : 'Sell'}</p>
              <p>Outcome: {order.outcome === 0 ? 'Yes' : 'No'}</p>
              <button
                className='bg-red-500 text-white px-[10px] py-[5px] rounded-md mt-2'
                onClick={() => cancelOrder(order.marketId, order.orderId, order.side, order.outcome)}
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [marketOpen, setMarketOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState({
    contractAddress: "0x0000000000000000000000000000000000000000",
    spenderAddress: "0x0000000000000000000000000000000000000000",
    amount: 1,
  });

  return (
    <div className="flex flex-col items-center">
      {marketOpen && <MarketModal marketOpen={marketOpen} setMarketOpen={setMarketOpen} />}
      {depositOpen && <DepositModal depositOpen={depositOpen} setDepositOpen={setDepositOpen} />}
      {ordersOpen && <OrdersModal ordersOpen={ordersOpen} setOrdersOpen={setOrdersOpen} />}

      <div className="text-white w-full h-[100px] flex flex-row justify-between items-center px-[100px]">
        <Link href="/">
          <h1 className="text-[20px] font-bold">
            PROBANA
          </h1>
        </Link>
        <div className='flex flex-row gap-[10px] items-center'>
          <UnlimitOverlay />
          <button
            className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
            onClick={() => { setDepositOpen(true) }}
          >
            Deposit Money
          </button>
          <ApproveSpending
            contractAddress={transactionDetails.contractAddress}
            spenderAddress={transactionDetails.spenderAddress}
            amount={transactionDetails.amount}
          />
          <button
            className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
            onClick={() => { setMarketOpen(true) }}
          >
            Create Market
          </button>
          <button
            className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
            onClick={() => { setOrdersOpen(true) }}
          >
            View Orders
          </button>
          <DynamicWidget />
        </div>
      </div>
      <div className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.3)] " />
    </div>
  )
}
