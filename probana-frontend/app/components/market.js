import { useState, useEffect } from "react"
import { IoMdClose } from "react-icons/io";

function NotSelectedMarket({marketDetail, setSelectedMarket, setSelectedOption}) {
    const key = marketDetail.key
    const prompt = marketDetail.prompt
    const options = marketDetail.options
    const votes = marketDetail.votes
    const sumVotes = marketDetail.sumVotes
    const binary = marketDetail.binary

    return (
        <div className="bg-[#2C3F50] rounded-md p-[20px] hover:bg-[#425465]">
            {/* top */}
            <div className="flex flex-col justify-between gap-[4px] grow h-full">
                <h3>
                    {prompt}
                </h3>
                {!binary && options?.map((option, i) => {
                    return (
                        <div key={option} className="flex flex-row justify-between w-full text-[14px] items-center">
                            <h5 className="">
                                {option}
                            </h5>
                            <div className="flex flex-row justify-between gap-[4px] items-center">
                                <h5>
                                    {Math.round(100 * votes[i] / sumVotes)}%
                                </h5>
                                <button 
                                    className="bg-[#2C4B51] py-[4px] px-[8px] rounded-sm hover:bg-[#27ae60] text-[#27ae60] hover:text-white"
                                    onClick={() => {
                                        setSelectedOption(i)
                                        setSelectedMarket(key)
                                    }}
                                >
                                    Yes
                                </button>
                                <button 
                                    className="bg-[#414052] py-[2px] px-[8px] rounded-sm text-[#e64800] hover:bg-[#e64800] hover:text-white"
                                    onClick={() => {
                                        setSelectedOption(i)
                                        setSelectedMarket(key)
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    )
                })}
                {binary && 
                    <div className="flex flex-row justify-between gap-[10px]">
                        <button 
                            className="bg-[#2C4B51] py-[8px] px-[8px] rounded-sm hover:bg-[#27ae60] text-[#27ae60] hover:text-white grow"
                            onClick={() => {
                                setSelectedOption(0)
                                setSelectedMarket(key)
                            }}
                        >
                            {options[0]}
                        </button>
                        <button 
                            className="bg-[#414052] py-[8px] px-[8px] rounded-sm text-[#e64800] hover:bg-[#e64800] hover:text-white grow"
                            onClick={() => {
                                setSelectedOption(1)
                                setSelectedMarket(key)
                            }}
                        >
                            {options[1]}
                        </button>
                    </div>
                }

            </div>
            {/* bottom */}
            <div>

            </div>
        </div>

    )

}

function SelectedMarket({marketDetail, setSelectedMarket, setSelectedOption}) {
    const key = marketDetail.key
    const prompt = marketDetail.prompt
    const options = marketDetail.options
    const votes = marketDetail.votes
    const sumVotes = marketDetail.sumVotes
    const binary = marketDetail.binary

    return (
        <div className="bg-[#2C3F50] rounded-md p-[20px] hover:bg-[#425465] flex flex-col">
            <div className="flex flex-row justify-between">
                <h3>
                    {prompt}
                </h3>
                <button 
                    className="bg-[#2c3e4f] rounded-md p-[10px] h-min w-min"
                    onClick={() => {
                        setSelectedMarket(null)
                        setSelectedOption(null)
                    }}
                >
                    <IoMdClose />
                </button>
            </div>
            <div className="bg-[#1d2b39] rounded-md p-[10px]">
                $
                <input type="number" placeholder="0.00" className="bg-transparent outline-none ml-[6px]"/>
            </div>
            <button className="bg-[#27ae60] flex justify-center items-center p-[4px] rounded-md">
                Yes
            </button>

        </div>
    )

}

export default function Market({marketDetail, selectedOption, selectedMarket, setSelectedMarket, setSelectedOption}) {

    const key = marketDetail.key

    return (
        (selectedMarket && selectedMarket === key)? 
            <SelectedMarket 
                marketDetail={marketDetail} 
                setSelectedMarket={setSelectedMarket}
                setSelectedOption={setSelectedOption}
            /> : 
            <NotSelectedMarket 
                marketDetail={marketDetail} 
                setSelectedMarket={setSelectedMarket}
                setSelectedOption={setSelectedOption}
            />
    )
}