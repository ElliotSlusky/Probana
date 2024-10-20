import {
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ApproveSpending from './approveSpending';

import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { ethers } from 'ethers';




function Modal({ modalOpen, setModalOpen }) {
  const [prompt, setPrompt] = useState(null)
<<<<<<< HEAD
  const [option1, setOption1] = useState(null)
  const [option2, setOption2] = useState(null)
  const contractAddress = "0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52";
  const spenderAddress = "0x7A0aE150F6E03f6B038B673c7B32341496F65f41";
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
    const data = iface.encodeFunctionData("approve", []);

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
    <div className="absolute w-full h-full bg-[rgba(0,0,0,0.5)] items-center justify-center flex" onClick={() => { setModalOpen(false) }}>
      <div className="flex-col flex gap-[10px] items-center bg-[#1d2b39] w-min p-[50px] rounded-lg" onClick={(e) => { e.stopPropagation() }}>
        {/* <Navbar/> */}
        <h3 className='text-[24px] font-bold'>
=======
  const [rules, setRules] = useState(null)

  return (
    <div className="absolute w-full h-full bg-[rgba(0,0,0,0.5)] items-center justify-center flex" onClick={() => {setModalOpen(false)}}>
      <div className="flex-col flex gap-[10px] items-center bg-[#1d2b39] w-min p-[50px] rounded-lg" onClick={(e) => {e.stopPropagation()}}>
          {/* <Navbar/> */}
          <h3 className='text-[24px] font-bold'>
              Create Market
          </h3>
          <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
              <input value={prompt} onChange={(e) => {setPrompt(e.target.value)}} type="text" placeholder="Prompt" className="bg-transparent outline-none"/>
          </div>

          <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
              <input value={rules} onChange={(e) => {setRules(e.target.value)}} type="text" placeholder="Rules" className="bg-transparent outline-none"/>
          </div>
          <button className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'>
>>>>>>> 8d5732214c3f75689f790fc62304bd436eaf4d4d
          Create Market
        </h3>
        <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
          <input value={prompt} onChange={(e) => { setPrompt(e.target.value) }} type="text" placeholder="Prompt" className="bg-transparent outline-none" />
        </div>

        <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
          <input value={option1} onChange={(e) => { setOption1(e.target.value) }} type="text" placeholder="Option 1" className="bg-transparent outline-none" />
        </div>

        <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
          <input value={option2} onChange={(e) => { setOption2(e.target.value) }} type="text" placeholder="Option 2" className="bg-transparent outline-none" />
        </div>
        <button className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md' onClick={createMarket}>
          Create Market
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
<<<<<<< HEAD
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    contractAddress: "0x0000000000000000000000000000000000000000",
    spenderAddress: "0x0000000000000000000000000000000000000000",
    amount: 1,
  });

  return (
    <div className="flex flex-col items-center">
      {modalOpen && <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} />}
      <div className="text-white w-full h-[100px] flex flex-row justify-between items-center px-[100px]">
=======
  const [modalOpen, setModalOpen] = useState(false)
  const [deposit, setDeposit] = useState(null)

  return (
    <div className="flex flex-col items-center">
      {modalOpen && <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}/>}
      <div className="text-white w-full h-[100px] flex flex-row justify-between items-center px-[100px] gap-[20px]">
>>>>>>> 8d5732214c3f75689f790fc62304bd436eaf4d4d
        <Link href="/">
          <h1 className="text-[20px] font-bold">
            PROBANA
          </h1>
        </Link>
<<<<<<< HEAD
        <div className='flex flex-row gap-[10px] items-center'>
          <ApproveSpending
            contractAddress={transactionDetails.contractAddress}
            spenderAddress={transactionDetails.spenderAddress}
            amount={transactionDetails.amount}
          />
          <button
=======
        <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min flex flex-row grow">
          $ <input value={deposit} onChange={(e) => {setDeposit(e.target.value)}} type="number" placeholder="0.00" className="bg-transparent outline-none w-full"/>
        </div>
        <button 
            className={`text-white px-[20px] py-[10px] rounded-md`}
            style={deposit?{backgroundColor: "#2d9cdc"}:{borderWidth: "1px", borderColor: "rgba(255,255,255,0.5)", borderStyle: "solid", cursor: "unset", pointerEvents: "none" }}
            // onClick={() => {setModalOpen(true)}}
          >
            Deposit
        </button>
          <Link
            className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
            href="/orders"
          >
            View Orders
          </Link>
          <button 
>>>>>>> 8d5732214c3f75689f790fc62304bd436eaf4d4d
            className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
            onClick={() => { setModalOpen(true) }}
          >
            Create Market
          </button>
          <DynamicWidget />
        {/* <div className='flex flex-row gap-[10px] items-center'>
        </div> */}
      </div>
      <div className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.3)] " />

    </div>
  )
}
