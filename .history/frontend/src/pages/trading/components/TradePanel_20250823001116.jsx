import Reach, { useState } from 'react';

const TradePanel = ({ currentPrice, balance, onBuy, onSell })=> {
    const [qty, setQty] = useState(1);
    const total = +( qty * currentPrice || 0).toFixed(2);

    return (
        <div>
            <div className="text-lg font-semibold mb-2">Trade</div>
            <div className="space-y-3">
                <div className="text-sm text">Current Price</div>
            </div>
        </div>
    )
}