import React , { useState, useEffect, useMemo}from 'react'
import {io} from 'socket.io-client';
import SearchPanel from "./components/SearchPanel";
import Chart from './components/Chart';
import TradePanel from './components/TradePanel';
import HoldingsTable from './components/HoldingsTable';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL="https://localhost:5000";

const KNOWN_STOCKS = [
  { symbol: "TCS", name: "Tata Consultancy Services", esg: true },
  { symbol: "RELIANCE", name: "Reliance Industries", esg: false },
  { symbol: "HDFCBANK", name: "HDFC Bank", esg: true },
  { symbol: "INFY", name: "Infosys", esg: true },
  { symbol: "ITC", name: "ITC", esg: false },
  { symbol: "TATASTEEL", name: "Tata Steel", esg: true },
  { symbol: "SBIN", name: "State Bank of India", esg: false },
];

const TIMEFRAMES = ["1D", "1W", "1M", "1Y"];
const ALPHA_BASE = "https://www.alphavantage.co/query";
const AV_KEY = import.meta?.env?.VITE_ALPHA_VANTAGE_KEY || ""; 


const getLS = (k, def) =>{
  try {return JSON.parse(localStorage.getItem(k)) ?? def;} catch { return def; }
};
function dummySeries(days =30 , start = 100){
  const now= Date.now();
}
const TradingPage = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      TradingPage
    </div>
  )
}

export default TradingPage