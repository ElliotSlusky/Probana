
import {
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function Modal ({modalOpen, setModalOpen}) {
  const [prompt, setPrompt] = useState(null)
  const [option1, setOption1] = useState(null)
  const [option2, setOption2] = useState(null)

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
              <input value={option1} onChange={(e) => {setOption1(e.target.value)}} type="text" placeholder="Option 1" className="bg-transparent outline-none"/>
          </div>

          <div className="bg-[#1d2b39] rounded-md px-[15px] py-[10px] w-min border-[1px] border-[rgba(255,255,255,0.5)] border-solid h-min">
              <input value={option2} onChange={(e) => {setOption2(e.target.value)}} type="text" placeholder="Option 2" className="bg-transparent outline-none"/>
          </div>
          <button className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'>
          Create Market
          </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex flex-col items-center">
      {modalOpen && <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}/>}
      <div className="text-white w-full h-[100px] flex flex-row justify-between items-center px-[100px]">
        <Link href="/">
          <h1 className="text-[20px] font-bold">
            PROBANA
          </h1>
        </Link>
        <div className='flex flex-row gap-[10px] items-center'>
          <button 
            className='bg-[#2d9cdc] text-white px-[20px] py-[10px] rounded-md'
            onClick={() => {setModalOpen(true)}}
          >
            Create Market
          </button>
          <DynamicWidget />
        </div>
      </div>
      <div className="w-[100%] h-[1px] bg-[rgba(255,255,255,0.3)] "/>

    </div>
  )
}