import Market from "./market";

export default function MarketGrid({marketDetails}) {


    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-[20px]">
            {
                marketDetails.map((marketDetail, i) => {

                    return (
                        <Market key={marketDetail} marketDetail={marketDetail}/>
                    )
                }) 
            }
        </div>
    )
}