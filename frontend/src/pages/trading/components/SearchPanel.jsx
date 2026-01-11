import React, { useEffect, useState } from "react";
import axios from "axios";

const RECENT_KEY = "trade:recent-searches";

export default function SearchPanel({ mode, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState(
    JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")
  );

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const endpoint = "http://localhost:5000/api/finnhub/search";

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`${endpoint}?q=${query}`);
        const data = res.data || [];

        if (mode === "LIVE") {
          setResults(data.filter((r) => /^[A-Z]+$/.test(r.symbol)));
        } 
        else {
          setResults(data.filter((r) => /^[A-Z]+$/.test(r.symbol)));
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query, mode]);

  const select = (stock) => {
    onSelect(stock);

    const updated = [
      stock,
      ...recent.filter((r) => r.symbol !== stock.symbol),
    ].slice(0, 5);

    setRecent(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder={`Search (${mode})`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.map((r) => (
        <div
          key={r.symbol}
          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
          onClick={() => select(r)}
        >
          <b>{r.symbol}</b> – {r.name}
        </div>
      ))}

      {!query &&
        recent.map((r) => (
          <div
            key={r.symbol}
            className="px-3 py-2 text-sm text-gray-500 cursor-pointer"
            onClick={() => onSelect(r)}
          >
            {r.symbol} – {r.name}
          </div>
        ))}
    </div>
  );
}
