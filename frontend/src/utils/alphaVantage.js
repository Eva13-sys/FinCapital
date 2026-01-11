// const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
// const BASE = "https://www.alphavantage.co/query";

// export async function fetchIntraday(symbol) {
//   const url = `${BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
//   const res = await fetch(url);
//   const data = await res.json();

//   const series = data["Time Series (5min)"];
//   if (!series) return [];

//   return Object.entries(series)
//     .map(([time, v]) => ({
//       time,
//       open: +v["1. open"],
//       high: +v["2. high"],
//       low: +v["3. low"],
//       close: +v["4. close"],
//     }))
//     .reverse();
// }
