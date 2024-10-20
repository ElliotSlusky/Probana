import Market from "./market";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MarketGrid({marketDetails}) {

    const [marketList, setMarketList] = useState(null);

    useEffect(() => {

        async function fetchMarketData() {
            const response = await axios.post("https://subgraph.satsuma-prod.com/97d738dd3352/elliots-team--201737/Probana/version/v0.0.1-new-version/api", `{"query":"{ marketCreateds(first: 500) { name id rules yesLabel noLabel creator blockTimestamp marketId } marketCloseds(first: 500) { id blockTimestamp marketId } }"}`)

            console.log(response.data)
            // setMarketList(found)

        }


        fetchMarketData();

    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] px-[100px] pt-[50px]">
            {marketDetails?.map(marketDetail => (
                    <Market 
                        key={marketDetail.key} 
                        marketDetail={marketDetail} 
                    />
                )
            )}
        </div>
    )
}