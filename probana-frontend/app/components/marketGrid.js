import Market from "./market";
import { useState } from "react";

export default function MarketGrid({marketDetails}) {
    const [selectedMarket, setSelectedMarket] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] px-[100px] pt-[50px]">
            {marketDetails?.map(marketDetail => (
                    <Market 
                        key={marketDetail.key} 
                        marketDetail={marketDetail} 
                        selectedOption={selectedOption}
                        selectedMarket={selectedMarket}
                        setSelectedMarket={setSelectedMarket} 
                        setSelectedOption={setSelectedOption}
                    />
                )
            )}
        </div>
    )
}