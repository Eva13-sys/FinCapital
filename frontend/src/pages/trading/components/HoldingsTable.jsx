import React from "react";

const HoldingsTable = ({ rows }) => {
  return (
    <div>
      <div className="text-lg font-semibold mb-3">Current Holdings</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Avg Cost</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Value</th>
              <th className="py-2 pr-4">P/L</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-gray-500">No holdings yet.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.symbol} className="border-b last:border-b-0">
                  <td className="py-2 pr-4 font-medium">{r.name} ({r.symbol})</td>
                  <td className="py-2 pr-4">{r.qty}</td>
                  <td className="py-2 pr-4">Rs{r.avgCost.toFixed(2)}</td>
                  <td className="py-2 pr-4">Rs{r.currentPrice.toFixed(2)}</td>
                  <td className="py-2 pr-4">Rs{r.value.toLocaleString()}</td>
                  <td className={`py-2 pr-4 ${r.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{r.pnl.toLocaleString()} ({r.pnlPct}%)
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
