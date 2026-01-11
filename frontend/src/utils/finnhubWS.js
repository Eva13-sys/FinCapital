let ws = null;
let isOpen = false;
let pendingSubs = new Set();

export function connectFinnhubWS(apiKey, onTrades) {
  if (ws) return ws;

  ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

  ws.onopen = () => {
    console.log("Finnhub WS connected");
    isOpen = true;

    pendingSubs.forEach(symbol => {
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    });
    pendingSubs.clear();
  };

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === "trade") {
      onTrades(msg.data);
    }
  };

  ws.onerror = (e) => {
    console.error("Finnhub WS error", e);
  };

  ws.onclose = () => {
    console.log("Finnhub WS closed");
    ws = null;
    isOpen = false;
    pendingSubs.clear();
  };

  return ws;
}

export function subscribeSymbol(symbol) {
  if (!ws) return;

  if (isOpen) {
    ws.send(JSON.stringify({ type: "subscribe", symbol }));
  } else {
    pendingSubs.add(symbol);
  }
}

export function unsubscribeSymbol(symbol) {
  if (!ws || !isOpen) return;

  ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
}

export function closeFinnhubWS() {
  if (ws) {
    ws.close();
    ws = null;
    isOpen = false;
    pendingSubs.clear();
  }
}
