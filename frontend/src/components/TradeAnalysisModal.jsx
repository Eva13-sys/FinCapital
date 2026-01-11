import React from "react";

const TradeAnalysisModal = ({ isOpen, onClose, onConfirm, stock, tradeType, quantity, currentPrice, aiPrediction }) => {
  if (!isOpen) return null;

  const rec = aiPrediction?.recommendation || "NEUTRAL";
  const details = aiPrediction?.details || [];

  const getBadge = (r) => {
    if (!r) return "bg-gray-100 text-gray-700";
    const map = {
      STRONG_BUY: "bg-green-100 text-green-700",
      BUY: "bg-green-50 text-green-600",
      STRONG_SELL: "bg-red-100 text-red-700",
      SELL: "bg-red-50 text-red-600",
      NEUTRAL: "bg-gray-100 text-gray-600",
      HOLD: "bg-gray-100 text-gray-600",
      AVOID: "bg-yellow-100 text-yellow-700",
    };
    return map[r] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-11/12 max-w-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Trade Analysis</h3>
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-100">
          <div className="font-medium">{tradeType?.toUpperCase() || ""} {quantity} × {stock}</div>
          <div className="text-sm text-blue-700">Price: Rs.{currentPrice?.toFixed(2) ?? "N/A"}</div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">AI Recommendation</div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${getBadge(rec)}`}>{rec}</div>
          </div>
          {aiPrediction?.confidence != null && <div className="text-xs text-gray-500 mt-1">{(aiPrediction.confidence*100).toFixed(0)}% confidence</div>}
        </div>

        {details && details.length > 0 && (
          <div className="mb-3">
            <div className="font-semibold mb-1">Key points</div>
            <ul className="text-sm space-y-1">
              {details.map((d, i) => <li key={i} className="text-gray-600">• {d}</li>)}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded">
            Confirm Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeAnalysisModal;