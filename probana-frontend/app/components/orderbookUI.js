"use client"
import React, { useEffect, useRef } from 'react';

export default function OrderBook(buyOrders, sellOrders) {

    // Ref for scrolling bids
    const bidsRef = useRef(null);

    // Scrolls to the bottom of the bids list
    useEffect(() => {
        if (bidsRef.current) {
            bidsRef.current.scrollTop = bidsRef.current.scrollHeight;
        }
    }, [bids]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
            <div className="flex justify-between border-b border-gray-600 pb-2">
                <h2 className="text-lg font-bold">Order Book</h2>
                <div className="text-sm">Spread: 0.3¢</div>
            </div>
            <div className="my-2">
                <div className="text-sm text-gray-400">TRADE YES</div>
                <div className="grid grid-cols-3 text-right text-red-500 mt-2">
                    <div>Price</div>
                    <div>Shares</div>
                    <div>Total</div>
                </div>
                <div
                    ref={bidsRef}

                    className="max-h-64 overflow-y-auto scrollbar-visible"
                >
                    {asks.map((ask, index) => (
                        <div key={index} className="grid grid-cols-3 text-right text-red-500 mt-1">
                            <div>{ask.price}</div>
                            <div>{ask.shares.toLocaleString()}</div>
                            <div>{ask.total}</div>
                        </div>
                    ))}
                </div>
                <div className="text-center text-gray-400 my-2">Last: 31.2¢</div>
                <div className="grid grid-cols-3 text-right text-green-500 mt-2">
                    <div>Price</div>
                    <div>Shares</div>
                    <div>Total</div>
                </div>
                <div
                    className="max-h-64 overflow-y-auto scrollbar-visible"
                >
                    {bids.map((bid, index) => (
                        <div key={index} className="grid grid-cols-3 text-right text-green-500 mt-1">
                            <div>{bid.price}</div>
                            <div>{bid.shares.toLocaleString()}</div>
                            <div>{bid.total}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
