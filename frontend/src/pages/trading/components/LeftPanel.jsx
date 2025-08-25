import React, { useState, useEffect } from "react";
import axiosMongo from "../../../utils/axiosMongo"; // axios instance for Mongo
import axiosSQL from "../../../utils/axiosSQL";     // axios instance for MySQL
import SearchPanel from "./SearchPanel";

const LeftPanel = ({ selected, setSelected }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [knownStocks, setKnownStocks] = useState([]);
  const [esgOnly, setEsgOnly] = useState(false);
  const [smartFilters, setSmartFilters] = useState([
    "Beginner Friendly",
    "High Dividend",
    "Growth Stocks",
    "Beaten Down"
  ]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // --- Fetch known stocks from MySQL ---
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axiosSQL.get("/stocks");
        setKnownStocks(res.data);
      } catch (err) {
        console.error("SQL Stocks fetch error:", err);
      }
    };
    fetchStocks();
  }, []);

  // --- Fetch user watchlist from Mongo ---
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axiosMongo.get("/watchlist/USER_ID_HERE"); // replace dynamically
        setWatchlist(res.data.map(w => w.symbol));
      } catch (err) {
        console.error("Mongo Watchlist fetch error:", err);
      }
    };
    fetchWatchlist();
  }, []);

  // --- Fetch price alerts from Mongo ---
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axiosMongo.get("/alerts/USER_ID_HERE"); // replace dynamically
        setPriceAlerts(res.data);
      } catch (err) {
        console.error("Mongo Price Alerts fetch error:", err);
      }
    };
    fetchAlerts();
  }, []);

  // --- Fetch AI recommendations from Mongo ---
  useEffect(() => {
    const fetchAIRecs = async () => {
      try {
        const res = await axiosMongo.get("/recommendations/USER_ID_HERE"); // replace dynamically
        setAiRecommendations(res.data);
      } catch (err) {
        console.error("Mongo AI Recommendations fetch error:", err);
      }
    };
    fetchAIRecs();
  }, []);

  const toggleWatch = (symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <div className="space-y-6 bg-white p-4 rounded-2xl shadow">
      {/* Search + Browse Panel */}
      <SearchPanel
        esgOnly={esgOnly}
        setEsgOnly={setEsgOnly}
        universe={knownStocks}
        selected={selected}
        setSelected={setSelected}
        watchlist={watchlist}
        toggleWatch={toggleWatch}
        knownStocks={knownStocks}
      />

      {/* Smart Filters */}
      <div>
        <div className="text-sm font-semibold mb-2">Smart Filters</div>
        <div className="flex flex-wrap gap-2">
          {smartFilters.map(f => (
            <button
              key={f}
              className="px-3 py-1 border rounded-full hover:bg-gray-100"
            >{f}</button>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="text-sm font-semibold mb-2">AI Recommendations</div>
        <ul className="space-y-1">
          {aiRecommendations.map((r, i) => (
            <li key={i} className="px-2 py-1 border rounded hover:bg-gray-50 cursor-pointer">
              {r.stock} - {r.reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Alerts */}
      <div>
        <div className="text-sm font-semibold mb-2">Price Alerts</div>
        <ul className="space-y-1">
          {priceAlerts.map((a, i) => (
            <li key={i} className="px-2 py-1 border rounded hover:bg-gray-50">
              {a.stock}: {a.targetPrice} ₹
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftPanel;
