import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const CATEGORIES = [
  { key: "popular", label: "Popular Stocks", filter: (s) => ["INFY", "TCS", "RELIANCE", "HDFCBANK"].includes(s.symbol) },
  { key: "beginner", label: "Beginner Friendly", filter: (s) => ["INFY", "HDFCBANK", "ITC"].includes(s.symbol) },
  { key: "esg", label: "ESG Stocks", filter: (s) => s.esg },
];

const SearchPanel = ({ userId, selected, setSelected }) => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [esgOnly, setEsgOnly] = useState(false);
  const [tab, setTab] = useState("popular");
  const [q, setQ] = useState("");

  // Fetch all stocks from MySQL
  useEffect(() => {
    axios.get("http://localhost:5000/api/sql/stocks")
      .then(res => setStocks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch watchlist from Mongo
  useEffect(() => {
    axios.get(`http://localhost:5000/api/mongo/watchlist/${userId}`)
      .then(res => setWatchlist(res.data.map(w => w.symbol)))
      .catch(err => console.error(err));
  }, [userId]);

  // Filtered stocks for tab
  const tabbed = useMemo(() => {
    const cat = CATEGORIES.find(c => c.key === tab);
    const base = cat ? stocks.filter(cat.filter) : stocks;
    return base.filter(s => (esgOnly ? s.esg : true));
  }, [tab, esgOnly, stocks]);

  // Search suggestions
  const suggestions = useMemo(() => {
    if (!q) return [];
    const qq = q.toLowerCase();
    return stocks.filter(s => s.symbol.toLowerCase().includes(qq) || s.name.toLowerCase().includes(qq)).slice(0,6);
  }, [q, stocks]);

  const toggleWatch = async (symbol) => {
    try {
      if (watchlist.includes(symbol)) {
        await axios.post("http://localhost:5000/api/mongo/watchlist", { userId, symbol, remove: true });
        setWatchlist(watchlist.filter(s => s !== symbol));
      } else {
        await axios.post("http://localhost:5000/api/mongo/watchlist", { userId, symbol });
        setWatchlist([...watchlist, symbol]);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="w-full border rounded px-3 py-2" />
        {q && suggestions.length > 0 && (
          <div className="mt-2 border rounded-lg divide-y">
            {suggestions.map(s => (
              <button key={s.symbol} onClick={() => { setSelected(s); setQ(""); }} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                {s.name} <span className="text-gray-500">({s.symbol})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ESG filter */}
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={esgOnly} onChange={e => setEsgOnly(e.target.checked)} />
        ESG only
      </label>

      {/* Category Tabs */}
      <div className="flex gap-2">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setTab(c.key)} className={`px-3 py-1 rounded-full border ${tab===c.key?'bg-black text-white':'hover:bg-gray-100'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Browse Stocks */}
      <div className="flex flex-wrap gap-2">
        {tabbed.map(s => (
          <button key={s.symbol} onClick={() => setSelected(s)} className={`px-3 py-1 rounded-full border ${selected.symbol===s.symbol?'bg-blue-600 text-white':'hover:bg-gray-100'}`}>
            {s.symbol}
          </button>
        ))}
      </div>

      {/* Watchlist */}
      <div>
        {watchlist.map(sym => (
          <div key={sym} className="flex items-center gap-2 border rounded-full px-3 py-1">
            <button onClick={() => setSelected(stocks.find(s=>s.symbol===sym))}>{sym}</button>
            <button onClick={() => toggleWatch(sym)} className="text-red-500 font-bold">×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPanel;

