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
      const url = `${ALPHA_BASE} ? function= TIME_SERIES_DAILY_ADJUSTED& symbol = ${symbol} & outputsize=compact & apikey=${AV_KEY}`;
      const r = await fetch(url);
      const j = await r.json();
      const series = j["Time Series (Daily)"];
      if(!series) throw new Error("No daily data");
      let points = Object.entries(series)
      .map(([t,obj]) => ({ time: t, price: +obj["4. close"]}))
      .sort((a,b) => new Date(a.time) - new Date(b.time));
      if( timeframe === '1W') points = points.slice(-7);
      else if (timeframe === '1M') points = points.slice(-30);
      else if (timeframe === '1Y') points = points.slice(-365);
      return points;
    }
  }
  catch{
    //fallback
    if(timeframe === '1D') return dummySeries(24,100).map((d,i) => ({ time: i, price: d.price}));
    if (timeframe === '1W') return dummySeries(7,100);
    if (timeframe === '1M') return dummySeries(30,100);
    return dummySeries(365,100);
  }
}

const TradingPage = () => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[1]); //1week
  const [selected, setSelected] = useState("tp: selected", KNOWN_STOCKS[0]);
  const [series, setSeries] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [balance, setBalance] = useState(getLS("tp:balance", 10000)); //Rs.10000 default
  const [holdings, setHoldings] = useState(getLS("tp:holdings", []));
  const [watchlist, setWatchlist] = useState(getLS("tp:watchlist", ["INFY", "TCS", "RELIANCE"]));
  const [esgOnly, setEsgOnly] = useState(getLS("tp:esgOnly", false));

  useEffect(() => setLS("tp:selected", selected), [selected]);
  useEffect(() => setLS("tp:balance", balance), [balance]);
  useEffect(() => setLS("tp:holdings", holdings), [holdings]);
  useEffect(() => setLS("tp:watchlist", watchlist), [watchlist]);
  useEffect(() => setLS("tp:esgOnly", esgOnly), [esgOnly]);


  // Fetch series
  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await fetchSeries(selected.symbol, timeframe);
      if (!alive) return;
      setSeries(s);
      if (s.length) setCurrentPrice(+s[s.length - 1].price);
    })();
    return () => { alive = false; };
  }, [selected.symbol, timeframe]);


  const filteredUniverse = useMemo(
    () => KNOWN_STOCKS.filter(s => (esgOnly ? s.esg : true)),
    [esgOnly]
  );

  const onBuy = (qty) => {
    const cost = qty * currentPrice;
    if (qty <= 0 || cost > balance) return false;
    setBalance((b) => +(b - cost).toFixed(2));

    setHoldings((prev) => {
      const idx = prev.findIndex((h) => h.symbol === selected.symbol);
      if (idx === -1) {
        return [...prev, { symbol: selected.symbol, name: selected.name, qty, avgCost: currentPrice }];
      }
      const h = prev[idx];
      const newQty = h.qty + qty;
      const newAvg = (h.avgCost * h.qty + currentPrice * qty) / newQty;
      const copy = [...prev];
      copy[idx] = { ...h, qty: newQty, avgCost: +newAvg.toFixed(2) };
      return copy;
    });
    return true;
  };


  const onSell = (qty) => {
    if (qty <= 0) return false;
    let ok = false;
    setHoldings((prev) => {
      const idx = prev.findIndex((h) => h.symbol === selected.symbol);
      if (idx === -1) return prev;
      const h = prev[idx];
      if (qty > h.qty) return prev;
      ok = true;
      const newQty = h.qty - qty;
      const proceeds = qty * currentPrice;
      setBalance((b) => +(b + proceeds).toFixed(2));
      if (newQty === 0) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      const copy = [...prev];
      copy[idx] = { ...h, qty: newQty };
      return copy;
    });
    return ok;
  };

  const toggleWatch = (symbol) => {
    setWatchlist((w) =>
      w.includes(symbol) ? w.filter((s) => s !== symbol) : [...w, symbol]
    );
  };

  // Portfolio totals
  const totals = useMemo(() => {
    const rows = holdings.map((h) => {
      const value = +(h.qty * currentPrice).toFixed(2);
      const cost = +(h.qty * h.avgCost).toFixed(2);
      const pnl = +(value - cost).toFixed(2);
      const pnlPct = cost ? +((pnl / cost) * 100).toFixed(2) : 0;
      return { ...h, currentPrice, value, pnl, pnlPct };
    });
    const totalValue = rows.reduce((a, r) => a + r.value, 0);
    const totalCost = rows.reduce((a, r) => a + r.avgCost * r.qty, 0);
    const totalPnl = +(totalValue - totalCost).toFixed(2);
    return { rows, totalValue: +totalValue.toFixed(2), totalPnl, totalCost: +totalCost.toFixed(2) };
  }, [holdings, currentPrice]);

  return (
    <div className=''>
      <div className='grid'>
        <div className='bg-white'>
          <div className='texts-sm'>Balance</div>
          <div className='text-2xl'>Rs{balance.toLocaleString()}</div>
        </div>
        <div className='bg-white'>
          <div className='text-sm'>Portfolio Value</div>
          <div className='text-2xl'>Rs{totals.totalValue.toLocaleString()}</div>
        </div>
        <div className={`bg-white rounded-2xl shadow p-4`}>
          <div className=""
        </div>
      </div>

    </div>
  )
}

export default TradingPage