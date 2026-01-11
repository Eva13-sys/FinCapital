export function updateCandles(prev, trade) {
  let time;

  // 🔴 LIVE (Finnhub WS)
  if (trade.t) {
    time = Math.floor(trade.t / 60000) * 60; // 1-minute candle (seconds)
  }

  // 🟢 REPLAY (CSV)
  else if (trade.Date) {
    time = Math.floor(new Date(trade.Date).getTime() / 1000);
  }

  else {
    console.warn("Invalid candle time:", trade);
    return prev;
  }

  const price = Number(trade.p ?? trade.Close ?? trade.close);
  if (!price || isNaN(price)) return prev;

  const last = prev[prev.length - 1];

  // 🟡 Update same candle
  if (last && last.time === time) {
    return [
      ...prev.slice(0, -1),
      {
        ...last,
        high: Math.max(last.high, price),
        low: Math.min(last.low, price),
        close: price,
      },
    ];
  }

  return [
    ...prev.slice(-200),
    {
      time,
      open: price,
      high: price,
      low: price,
      close: price,
    },
  ];
}
