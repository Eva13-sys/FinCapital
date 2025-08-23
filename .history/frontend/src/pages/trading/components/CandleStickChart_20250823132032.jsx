// trading/components/CandlestickChart.jsx
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
    });

    const candleSeries = chart.addCandlestickSeries();

    // Sample data (later replace with API)
    candleSeries.setData([
      { time: "2024-12-01", open: 2500, high: 2550, low: 2480, close: 2520 },
      { time: "2024-12-02", open: 2520, high: 2600, low: 2500, close: 2580 },
      { time: "2024-12-03", open: 2580, high: 2620, low: 2550, close: 2600 },
      { time: "2024-12-04", open: 2600, high: 2630, low: 2580, close: 2590 },
    ]);

    const resizeHandler = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
