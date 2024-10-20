"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import OrderbookUI from '../components/orderbookUI';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function MarketPage({ params }) {
    const [price, setPrice] = useState(0.5); // Example initial price
    const [side, setSide] = useState('Buy');
    const [type, setType] = useState('Yes');
    const router = useRouter()
    const { prompt } = router.query

    console.log(prompt, "hi")

    // Function to convert odds to cent format and adjust for "No" type
    const convertOddsToCents = (odds) => {
        const adjustedOdds = type === 'Yes' ? odds : 1000 - odds;
        return (adjustedOdds / 10).toFixed(1) + '¢';
    };

    // Mock data for the price chart with dark mode-friendly colors
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Price',
                data: [0.3, 0.5, 0.4, 0.6, 0.5, price],
                borderColor: '#4FD1C5', // Tailwind's teal-400
                backgroundColor: 'rgba(79, 209, 197, 0.2)', // Semi-transparent teal
                tension: 0.1
            }
        ]
    };

    // Chart options with dark mode considerations
    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'currentColor', // Adapts to text color
                }
            },
            title: {
                display: false,
                text: 'Price Chart',
                color: 'currentColor',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white', // Set tick mark color to white
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            },
            y: {
                ticks: {
                    color: 'white', // Set tick mark color to white
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        color: 'currentColor'
    };

    // Mock data for the order book
    const orderBookData = {
        bids: [
            { odds: 400, shares: 3351.3, total: '$7,783.63' },


        ],
        asks: [
            { odds: 500, shares: 3351.3, total: '$7,783.63' },

        ]
    };

    // Adjust order book data based on type only
    const adjustedBids = type === 'Yes' ? orderBookData.bids : orderBookData.asks;
    const adjustedAsks = type === 'Yes' ? orderBookData.asks : orderBookData.bids;

    return (
        <div className="flex flex-col min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6">{params.market}</h1>

            <div className="flex flex-row space-x-8">
                <div className="w-3/4">
                    <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">Current Odds</h2>
                        <p className="text-2xl">{(price * 100).toFixed(2)}%</p>
                    </div>

                    <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">Price Chart</h2>
                        <div className="h-64">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        <OrderbookUI
                            bids={adjustedBids.map(bid => ({
                                ...bid,
                                price: convertOddsToCents(bid.odds)
                            }))}
                            asks={adjustedAsks.map(ask => ({
                                ...ask,
                                price: convertOddsToCents(ask.odds)
                            }))}
                            tradeType={`${side} ${type}`}
                        />
                    </div>
                </div>

                <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6 rounded">
                    <h2 className="text-xl font-semibold mb-4">Place Limit Order</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="side" className="block mb-1">Side</label>
                            <select
                                id="side"
                                value={side}
                                onChange={(e) => setSide(e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option>Buy</option>
                                <option>Sell</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="type" className="block mb-1">Type</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block mb-1">Amount</label>
                            <input type="number" id="amount" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="price" className="block mb-1">Price</label>
                            <input type="number" id="price" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 dark:bg-blue-700 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-600">
                            Place Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
