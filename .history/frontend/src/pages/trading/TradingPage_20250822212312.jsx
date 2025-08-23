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
  let v= start;
  const out =[];
  for( let i= days-1; i>=0; i--){
    v+= (Math.random() - 0.5) * (start*0.02);
    out.push({ time: Date(now-i*24*3600*1000).toISOString(), price: Math.max(1, +v.toFixed(2))});
  }
  return out;
}

async function fetchSeries(symbol, timeframe){
  if(!AV_KEY){
    if (timeframe === '1D') return dummySeries(24,100).map((d,i)=> ({ time: i, price : d.price}));
    if (timeframe === '1W') return dummySeries(7,100);
    if (timeframe === '1M') return dummySeries(30,100);
    return dummySeries(365,100);
  }

  try{
    if( timeframe === '1D'){
      const url = `${ALPHA_BASE} ? function = TIME_SERIES_INTRADAY & symbol = ${symbol} & interval =5min&outputsize=compact&apikey=${AV_KEY}`;
      const r = await fetch(url);
      const j = await r.json();
      const series = j["Time Series (5min)"];
      if(!series) throw new Wrror("No intraday data");
      const points = Object.entries(series)
      .map(([t,obj]) => ({ time: t, price: +obj["4. close"]}))
      .sort((a,b) => new Date(a.time) - new Date(b.time));
      return points;
    }
    else{
      //daily adjusted
      const url = `${ALPHA_BASE} ? function= TIME_SERIES_DAILY_ADJUSTED`
    }
  }
}
const TradingPage = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      TradingPage
    </div>
  )
}

export default TradingPage