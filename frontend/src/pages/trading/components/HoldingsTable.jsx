import React from "react";

const fmt = (v) => (typeof v === "number" ? v.toFixed(2) : "--");

const HoldingsTable = ({ rows, realizedPnl=0 }) => {
  const [showRealized, setShowRealized] = React.useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Current Holdings</h2>
        <button
          onClick={() => setShowRealized(!showRealized) }
          className="text-sm px-3 py-1 rounded-full border hover:bg-gray-100 transition">
            {showRealized ? "Show Unrealized P/L" : "Show Realized P/L"}
        </button>
      </div>
      {!showRealized ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-gray-600 text-left">
                <th className="py-2 px-3">Stock</th>
                <th className="py-2 px-3 text-center">Qty</th>
                <th className="py-2 px-3 text-center">Avg Cost</th>
                <th className="py-2 px-3 text-center">Price</th>
                <th className="py-2 px-3 text-center">Value</th>
                <th className="py-2 px-3 text-right">P/L</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 px-3 font-medium text-gray-900">
                      {row.name} ({row.ticker})
                    </td>
                    <td className="py-2 px-3 text-center">{row.quantity}</td>
                    <td className="py-2 px-3 text-center">₹{fmt(row.avgPrice)}</td>
                    <td className="py-2 px-3 text-center">₹{fmt(row.currentPrice)}</td>
                    <td className="py-2 px-3 text-center">₹{fmt(row.value)}</td>
                    <td
                      className={`py-2 px-3 text-right font-medium ${
                        row.pnl >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{fmt(row.pnl)}{" "}
                      <span className="text-xs text-gray-500">
                        ({row.pnlPct > 0 ? "+" : ""}
                        {fmt(row.pnlPct)}%)
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No holdings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Realized P/L View
        <div className="flex flex-col items-center justify-center py-10 text-gray-700">
          <p className="text-sm">Total Realized Profit / Loss</p>
          <p
            className={`text-3xl font-semibold mt-2 ${
              realizedPnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{realizedPnl.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            (Profit/Loss from all completed trades)
          </p>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;
