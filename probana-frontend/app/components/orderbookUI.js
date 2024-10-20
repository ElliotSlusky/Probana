"use client"
import React, { useEffect, useRef } from 'react';

export default function OrderBook({ asks, bids, type, side }) {

    console.log("trafjsjfhsa", type, side)




    // Ref for scrolling bids
    const bidsRef = useRef(null);
    // format of asks and bids is {price, shares}

    // Scrolls to the bottom of the bids list
    useEffect(() => {
        if (bidsRef.current) {
            bidsRef.current.scrollTop = bidsRef.current.scrollHeight;
        }
    }, [bids]);

    // Calculate the spread
    const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => parseFloat(bid.price))) : null;
    const lowestAsk = asks.length > 0 ? Math.min(...asks.map(ask => parseFloat(ask.price))) : null;
    const spread = highestBid !== null && lowestAsk !== null ? ((lowestAsk - highestBid) / 100).toFixed(1) + '¢' : 'N/A';

    // Helper function to safely convert price
    const formatPrice = (price) => {
        const parsedPrice = parseFloat(price);
        return isNaN(parsedPrice) ? 'N/A' : (parsedPrice / 100).toFixed(1) + '¢';
    };

    // Calculate total
    const calculateTotal = (price, shares) => {
        const parsedPrice = parseFloat(price);
        return isNaN(parsedPrice) ? 'N/A' : `$${(parsedPrice * shares / 10000).toFixed(2)}`;
    };
    if (type === "Yes") {
        return (
            <div className="bg-gray-800 p-1 rounded-lg text-white">
                <div className="flex justify-between border-b border-gray-600 pb-1">
                    <h2 className="text-lg font-bold">Order Book</h2>
                    <div className="text-sm">Spread: {spread}</div>
                </div>
                <div className="my-1">
                    <div className="text-sm text-gray-400">{type}</div>
                    <div className="grid grid-cols-3 text-right text-red-500 mt-1">
                        <div>Price</div>
                        <div>Shares</div>
                        <div>Total</div>
                    </div>
                    <div
                        ref={bidsRef}
                        className="max-h-20 overflow-y-auto scrollbar-visible"
                    >
                        {asks.map((ask, index) => (
                            <div key={index} className="grid grid-cols-3 text-right text-red-500 ">
                                <div>{formatPrice(parseInt(ask.price) / 100)}</div>
                                <div>{(parseInt(ask.shares) / 10 ** 6).toLocaleString()}</div>
                                <div>{calculateTotal(formatPrice(parseInt(ask.price)), parseInt(ask.shares) / 10 ** 6)}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-gray-400 my-1">Spread: {spread}</div>
                    <div className="grid grid-cols-3 text-right text-green-500 mt-1">
                        <div>Price</div>
                        <div>Shares</div>
                        <div>Total</div>
                    </div>
                    <div
                        className="max-h-20 overflow-y-auto scrollbar-visible"
                    >
                        {bids.map((bid, index) => (
                            <div key={index} className="grid grid-cols-3 text-right text-green-500">
                                <div>{formatPrice(parseInt(bid.price) / 100)}</div>
                                <div>{(parseInt(bid.shares) / 10 ** 6).toLocaleString()}</div>
                                <div>{calculateTotal(formatPrice(parseInt(bid.price)), parseInt(bid.shares) / 10 ** 6)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (type === "No") {
        console.log("sigmgemgjajga", parseInt(asks[0]))

        return (
            <div className="bg-gray-800 p-1 rounded-lg text-white">
                <div className="flex justify-between border-b border-gray-600 pb-1">
                    <h2 className="text-lg font-bold">Order Book</h2>
                    <div className="text-sm">Spread: {spread}</div>
                </div>
                <div className="my-1">
                    <div className="text-sm text-gray-400">{type}</div>
                    <div className="grid grid-cols-3 text-right text-red-500 mt-1">
                        <div>Price</div>
                        <div>Shares</div>
                        <div>Total</div>
                    </div>
                    <div
                        ref={bidsRef}
                        className="max-h-20 overflow-y-auto scrollbar-visible"
                    >
                        {bids.map((ask, index) => (
                            <div key={index} className="grid grid-cols-3 text-right text-red-500 ">
                                <div>{formatPrice(10000 - (parseInt(ask.price) / 100))}</div>
                                <div>{(parseInt(ask.shares) / 10 ** 6).toLocaleString()}</div>
                                <div>{calculateTotal(formatPrice(100000 - (parseInt(ask.price) / 10)), parseInt(ask.shares) / 10 ** 5)}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-gray-400 my-1">Spread: {spread}</div>
                    <div className="grid grid-cols-3 text-right text-green-500 mt-1">
                        <div>Price</div>
                        <div>Shares</div>
                        <div>Total</div>
                    </div>
                    <div
                        className="max-h-20 overflow-y-auto scrollbar-visible"
                    >
                        {asks.map((bid, index) => (
                            <div key={index} className="grid grid-cols-3 text-right text-green-500">
                                <div>{formatPrice(parseInt(bid.price) / 100)}</div>
                                <div>{(parseInt(bid.shares) / 10 ** 6).toLocaleString()}</div>
                                <div>{calculateTotal(formatPrice(parseInt(bid.price)), parseInt(bid.shares) / 10 ** 6)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

    }
}