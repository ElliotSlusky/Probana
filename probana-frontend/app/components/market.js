import Link from "next/link";
import { useState, useEffect } from "react"
import { IoMdClose } from "react-icons/io";

export default function Market({ market, odds }) {

    const id = market.marketId
    const question = market.question

    return (
        <div className="bg-[#2C3F50] rounded-md p-[20px] hover:bg-[#425465] h-[200px]">
            {/* top */}
            <div className="flex flex-col justify-between gap-[4px] grow h-full">
                <div className="flex flex-row justify-between gap-[10px]">
                    <h3>
                        {question}
                    </h3>
                    <h5>
                        {odds * 100}%
                    </h5>
                </div>
                <div className="flex flex-row justify-between gap-[10px]">
                    <Link
                        className="bg-[#2C4B51] py-[8px] px-[8px] rounded-sm hover:bg-[#27ae60] text-[#27ae60] hover:text-white grow"
                        href={'/market/' + id}
                    >
                        Yes
                    </Link>
                    <Link
                        className="bg-[#414052] py-[8px] px-[8px] rounded-sm text-[#e64800] hover:bg-[#e64800] hover:text-white grow"
                        href={`/market/` + id}
                    >
                        No
                    </Link>
                </div>
            </div>
            {/* bottom */}
            <div>

            </div>
        </div >
    )
}