import Reach, { useState } from 'react';

const TradePanel = ({ currentPrice, balance, onBuy, onSell }) => {
    const [qty, setQty] = useState(1);
    const total = +(qty * currentPrice || 0).toFixed(2);

    return (
        <div>
            <div className="text-lg font-semibold mb-2">Trade</div>
            <div className="space-y-3">
                <div className="text-sm text-gray-500">Current Price</div>
                <div className='text-2xl'>Rs.{(currentPrice || 0).toFixed(2)}</div>

                <div>
                    <label className='text-sm'>Quantity</label>
                    <input
                        type="number"
                        value={qty}
                        min={1}
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1")))}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div className='flex items-center justify-between'>
                    <div className='text-sm'>Total</div>
                    <div className='text-lg'>Rs.{total.toLocaleStorageString()}</div>

                </div>

                <div className='text-sm'>You have Rs{balance.toLocaleString()}</div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onBuy(qty)}
                        className="py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                        BUY
                    </button>
                    <button
                        onClick={() => onSell(qty)}
                        className="py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        SELL
                    </button>
                </div>

            </div>
        </div>
    )
}
export default TradePanel;