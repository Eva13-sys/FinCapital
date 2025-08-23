import Reach, { useState } from 'react';

const TradePanel = ({ currentPrice, balance, onBuy, onSell })=> {
    const [qty, setQty] = useState(1);
    const total = +( qty * currentPrice || 0).toFixed(2);

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
                    <div className='text-lg'></div>
                </div>
        
            </div>
        </div>
    )
}