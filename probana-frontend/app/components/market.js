export default function Market({marketDetail}) {

    const prompt = marketDetail.prompt
    const options = marketDetail.options
    const votes = marketDetail.voteAmount

    return (
        
        <div className="bg-[#2C3F50] w-[400px] h-[200px] rounded-md">
            {/* top */}
            <div className="flex flex-row justify-between">
                <h3>
                    {prompt}
                </h3>
                {
                    options.map((option, i) => {
                        return (
                            <div>

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