import React, { useMemo, useState } from "react";

const CATEGORIES = [
  { key: "popular", label: "Popular Stocks", filter: (s) => ["INFY", "TCS", "RELIANCE", "HDFCBANK"].includes(s.symbol) },
  { key: "beginner", label: "Beginner Friendly", filter: (s) => ["INFY", "HDFCBANK", "ITC"].includes(s.symbol) },
  { key: "esg", label: "ESG Stocks", filter: (s) => s.esg },
];

const SearchPanel = ({ esgOnly, setEsgOnly, universe, selected, setSelected, watchlist, toggleWatch, knownStocks }) => {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("popular");

  const suggestions = useMemo(() => {
    if (!q) return [];
    const qq = q.toLowerCase();
    return knownStocks
      .filter(s => s.symbol.toLowerCase().includes(qq) || s.name.toLowerCase().includes(qq))
      .slice(0, 6);
  }, [q, knownStocks]);

  const tabbed = useMemo(() => {
    const cat = CATEGORIES.find(c => c.key === tab);
    const base = cat ? knownStocks.filter(cat.filter) : knownStocks;
    return base.filter(s => (esgOnly ? s.esg : true));
  }, [tab, esgOnly, knownStocks]);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-semibold mb-1">Search</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by symbol or name"
          className="w-full border rounded-lg px-3 py-2"
        />
        {q && suggestions.length > 0 && (
          <div className="mt-2 border rounded-lg divide-y">
            {suggestions.map(s => (
              <button
                key={s.symbol}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                onClick={() => { setSelected(s); setQ(""); }}
              >
                {s.name} <span className="text-gray-500">({s.symbol})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Filters</div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={esgOnly} onChange={(e) => setEsgOnly(e.target.checked)} />
          ESG only
        </label>
      </div>

      <div className="flex gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setTab(c.key)}
            className={`px-3 py-1 rounded-full border ${tab === c.key ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Browse</div>
        <div className="flex flex-wrap gap-2">
          {tabbed.map(s => (
            <button
              key={s.symbol}
              onClick={() => setSelected(s)}
              className={`px-3 py-1 rounded-full border ${selected.symbol === s.symbol ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
            >
              {s.symbol}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Watchlist</div>
        <div className="flex flex-wrap gap-2">
          {watchlist.map(sym => (
            <div key={sym} className="flex items-center gap-2 border rounded-full px-3 py-1">
              <button onClick={() => setSelected(knownStocks.find(s => s.symbol === sym))} className="font-medium">{sym}</button>
              <button onClick={() => toggleWatch(sym)} className="text-red-500 font-bold">×</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => toggleWatch(selected.symbol)}
          className="mt-3 w-full border rounded-lg py-2 hover:bg-gray-50"
        >
          {watchlist.includes(selected.symbol) ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default SearchPanel;
