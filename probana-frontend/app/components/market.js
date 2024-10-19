export default function Market({marketDetail}) {

    const prompt = marketDetail.prompt
    const options = marketDetail.options
    const votes = marketDetail.votes

    return (
        
        <div className="bg-[#2C3F50] rounded-md">
            {/* top */}
            <div className="flex flex-col justify-between">
                <h3>
                    {prompt}
                </h3>
                {
                    options?.map((option, i) => {
                        console.log(i)
                        return (
                            <div key={option} className="flex flex-col justify-between">
                                {option}
                                {votes[i]}
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