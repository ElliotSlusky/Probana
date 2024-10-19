import { useState, useEffect } from "react"

export default function Market({marketDetail}) {

    const prompt = marketDetail.prompt
    const options = marketDetail.options
    const votes = marketDetail.votes
    const sumVotes = marketDetail.sumVotes

    return (
        
        <div className="bg-[#2C3F50] rounded-md p-[20px]">
            {/* top */}
            <div className="flex flex-col justify-between gap-[4px]">
                <h3>
                    {prompt}
                </h3>
                {
                    options?.map((option, i) => {
                        console.log(i)
                        return (
                            <div key={option} className="flex flex-row justify-between w-full text-[14px] items-center">
                                <h5 className="">
                                    {option}
                                </h5>
                                <div className="flex flex-row justify-between gap-[4px] items-center">
                                    <h5>
                                        {Math.round(100 * votes[i] / sumVotes)}%
                                    </h5>
                                    <button className="bg-[#2C4B51] py-[4px] px-[8px] rounded-sm hover:bg-[#27ae60] text-[#27ae60] hover:text-white">
                                        Yes
                                    </button>
                                    <button className="bg-[#414052] py-[2px] px-[8px] rounded-sm text-[#e64800] hover:bg-[#e64800] hover:text-white">
                                        No
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
            {/* bottom */}
            <div>

            </div>
        </div>
    )
}