import Market from "./market";

export default function MarketGrid({marketDetails}) {

    console.log(marketDetails, "hi")
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] px-[100px] pt-[50px]">
            {marketDetails?.map(marketDetail => (
                    <Market key={marketDetail.key} marketDetail={marketDetail}/>
                )
            )}
        </div>
    )
}