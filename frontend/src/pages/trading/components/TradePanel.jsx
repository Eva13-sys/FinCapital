import React, { useState } from "react";

const TradePanel = ({
  currentPrice,
  balance,
  onTrade,
  disabled,
  canSell,
}) => {
  const [qty, setQty] = useState(1);
  const total = currentPrice ? qty * currentPrice : 0;

  const safeBalance = Number(balance);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Trade</h2>
        <p className="text-sm text-gray-500">
          Quickly buy or sell the selected stock.
        </p>
      </div>
      <div>
        <div className="text-sm text-gray-500">Current Price</div>
        <div className="text-2xl font-medium text-gray-900">
          ₹{(currentPrice || 0).toFixed(2)}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">Quantity</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) =>
            setQty(Math.max(1, parseInt(e.target.value || "1")))
          }
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between text-sm">
        <span>Total</span>
        <span className="text-lg font-medium">
          ₹{total.toLocaleString()}
        </span>
      </div>

      <div className="text-sm text-gray-600">
        Available Balance:{" "}
        <span className="font-medium text-gray-900">
          ₹{safeBalance.toLocaleString()}
        </span>
      </div>

      {/* Trade Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {/* BUY */}
        <button
          disabled={disabled}
          onClick={() => onTrade("Buy", qty)}
          className={`py-2 rounded-lg font-medium transition-all
            ${
              disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
            }`}
        >
          BUY
        </button>
        <button
          disabled={disabled || !canSell}
          onClick={() => onTrade("Sell", qty)}
          className={`py-2 rounded-lg font-medium transition-all
            ${
              disabled || !canSell
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
            }`}
        >
          SELL
        </button>
      </div>

      {!canSell && !disabled && (
        <div className="text-xs text-gray-400 text-center">
          You do not own this stock yet
        </div>
      )}

      <div className="border-t mt-4 pt-2 text-xs text-gray-400 text-center md:hidden">
        Manage your trades smartly with AI insights.
      </div>
    </div>
  );
};

export default TradePanel;
