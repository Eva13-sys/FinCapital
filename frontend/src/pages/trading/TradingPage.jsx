import React, { useEffect, useMemo, useState } from "react";
import CandlestickChart from "./components/CandleStickChart";
import TradePanel from "./components/TradePanel";
import HoldingsTable from "./components/HoldingsTable";
import LeftPanel from "./components/LeftPanel";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseIdToken } from "../../utils/authToken";
import { useToast } from "../../components/toast/ToastContext";

const TradingPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [mongoUser, setMongoUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [series, setSeries] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [replayDate, setReplayDate] = useState(null);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [mode, setMode] = useState("LIVE");
  const [bankBalance, setBankBalance] = useState(0);
  const [showAllocate, setShowAllocate] = useState(false);
  const [allocateAmount, setAllocateAmount] = useState(0);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const token = await getFirebaseIdToken();
      const res = await fetch("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error("Failed to load user");
        return;
      }

      const data = await res.json();
      setMongoUser(data);
    })();
  }, [user]);

  const refreshAccount = async () => {
    if (!mongoUser) {
      return (
        <div className="p-6 text-gray-500">Loading trading account...</div>
      );
    }

    const token = await getFirebaseIdToken();

    const wallet = await fetch("http://localhost:5000/api/wallet", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    setBankBalance(wallet.bankBalance || 0);
    setBalance(wallet.tradingBalance || 0);

    const pf = await fetch("http://localhost:5000/api/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    setHoldings(pf.rows || []);
  };

  useEffect(() => {
    refreshAccount();
  }, [mongoUser]);

  const addDemoMoney = async () => {
    const token = await getFirebaseIdToken();
    await fetch("http://localhost:5000/api/wallet/add-bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: 10000 }),
    });
    toast.success("Demo money added to bank account");
    refreshAccount();
  };

  const allocateToTrading = async () => {
    const amount = Number(allocateAmount);
    if (!amount || amount <= 0 || amount > bankBalance) {
      toast.error("Invalid amount");
      return;
    }
    try {
      const token = await getFirebaseIdToken();
      const res = await fetch("http://localhost:5000/api/wallet/allocate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: "trading",
          amount,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Funds allocated to trading account");
      setShowAllocate(false);
      setAllocateAmount(0);
      refreshAccount();
    } catch {
      toast.error("Allocation failed");
    }
  };

  useEffect(() => {
    if (!selected) return;

    const loadCandles = async () => {
      const res = await fetch(
        `http://localhost:5000/api/yahoo/candles?symbol=${selected.symbol}`
      );
      const candles = await res.json();

      if (!Array.isArray(candles) || candles.length === 0) {
        setAllSeries([]);
        setSeries([]);
        setCurrentPrice(0);
        return;
      }

      setAllSeries(candles);
      setReplayDate(candles[candles.length - 1].time);

      if (mode === "LIVE") {
        setSeries(candles);
        setCurrentPrice(candles[candles.length - 1].close);
      }
    };

    loadCandles();
  }, [selected]);

  useEffect(() => {
    if (mode !== "REPLAY" || !replayDate || allSeries.length === 0) return;

    const sliced = allSeries.filter((c) => c.time <= replayDate);
    setSeries(sliced);

    if (sliced.length) {
      setCurrentPrice(sliced[sliced.length - 1].close);
    }
  }, [mode, replayDate, allSeries]);

  useEffect(() => {
    if (mode === "LIVE" && allSeries.length) {
      setSeries(allSeries);
      setCurrentPrice(allSeries[allSeries.length - 1].close);
    }
  }, [mode]);

  const getOwnedQuantity = (symbol) => {
    const holding = holdings.find((h) => h.ticker === symbol);
    return holding ? Number(holding.quantity) : 0;
  };

  const executeTrade = async (type, qty) => {
    if (mode === "REPLAY") {
      toast.error("Trading is disabled in Replay mode");
      return;
    }

    if (!mongoUser || !selected || qty <= 0 || currentPrice <= 0) {
      toast.error("Invalid trade");
      return;
    }

    if (type === "Sell") {
      const ownedQty = getOwnedQuantity(selected.symbol);
      if (ownedQty === 0) {
        toast.error("You do not own this stock");
        return;
      }
      if (qty > ownedQty) {
        toast.error(`You only own ${ownedQty} shares`);
        return;
      }
    }

    try {
      const token = await getFirebaseIdToken();

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticker: selected.symbol,
          name: selected.name,
          transactionType: type.toUpperCase(),
          quantity: qty,
          price: currentPrice,
        }),
      });

      if (!res.ok) throw new Error();

      await refreshAccount();
      toast.success(`${type} executed at ₹${currentPrice.toFixed(2)}`);
    } catch (err) {
      console.error(err);
      toast.error("Trade failed");
      await refreshAccount();
    }
  };

  const totals = useMemo(
    () => ({
      totalValue: holdings.reduce((a, h) => a + (h.value || 0), 0),
      totalPnl: holdings.reduce((a, h) => a + (h.pnl || 0), 0),
    }),
    [holdings]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("LIVE")}
          className={`px-3 py-1 rounded ${
            mode === "LIVE" ? "bg-black text-white" : "border"
          }`}
        >
          Live (Daily · US)
        </button>

        <button
          onClick={() => setMode("REPLAY")}
          className={`px-3 py-1 rounded ${
            mode === "REPLAY" ? "bg-black text-white" : "border"
          }`}
        >
          Replay (Backtest)
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card">Bank Balance ${bankBalance.toLocaleString()}</div>
        <div className="card">Balance ${balance.toLocaleString()}</div>
        <div className="card">Value ${totals.totalValue.toLocaleString()}</div>
        <div className="card">P/L ${totals.totalPnl.toLocaleString()}</div>
      </div>
      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded" onClick={addDemoMoney}>
          Add Demo Money
        </button>
        <button
          className="border px-4 py-2 rounded w-fit"
          onClick={() => setShowAllocate(true)}
        >
          Allocate Funds
        </button>
      </div>

      <div className="grid grid-cols-[280px_1fr_320px] gap-6">
        <LeftPanel selected={selected} setSelected={setSelected} mode={mode} />

        <div className="bg-white rounded-xl p-4">
          {/* {selected && (
            <div className="flex justify-between mb-2">
              <h2>{selected.name}</h2>
              <span>
                {currentPrice > 0 ? `₹${currentPrice.toFixed(2)}` : "--"}
              </span>
            </div>
          )} */}
          <CandlestickChart series={series} />
        </div>
        
        <TradePanel
          balance={balance}
          currentPrice={currentPrice}
          onTrade={executeTrade}
          disabled={mode === "REPLAY" || balance <= 0}
          canSell={getOwnedQuantity(selected?.symbol) > 0}
        />
      </div>

      <HoldingsTable rows={holdings} />
    </div>
  );
};

export default TradingPage;
