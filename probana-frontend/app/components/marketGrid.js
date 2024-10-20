import Market from "./market";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MarketGrid({marketDetails}) {

    const [marketList, setMarketList] = useState(null);

    useEffect(() => {

        async function fetchMarketData() {
            const response = await axios.post("https://subgraph.satsuma-prod.com/97d738dd3352/elliots-team--201737/Probana/version/v0.0.1-new-version/api", `{"query":"{ marketCreateds(first: 500) { name id rules yesLabel noLabel creator blockTimestamp marketId } }"}`)

            
            setMarketList(response.data.data.marketCreateds)

        }


        fetchMarketData();

    }, [marketDetails]);

    // console.log(marketList)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] px-[100px] pt-[50px]">
            {marketList?.map(market => {
                console.log(market, "hi")
                return (
                    <Market
                        odds={10} 
                        key={market.id} 
                        market={market} 
                    />
                )}
            )}
        </div>
    )
}