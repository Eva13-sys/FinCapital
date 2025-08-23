import Reach, { useState } from 'react';

const TradePanel = ({ currentPrice, balance, onBuy, onSell })=> {
    const [qty, setQty] = useState(1);
    const total = +( qty * currentPrice || 0).toFixed(2);

    ret
}