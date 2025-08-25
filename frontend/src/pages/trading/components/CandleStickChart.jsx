// trading/components/CandlestickChart.jsx
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart({ data }) {
    const chartContainerRef = useRef();

    // useEffect(() => {
    //     const chart = createChart(chartContainerRef.current, {
    //         width: chartContainerRef.current.clientWidth,
    //         height: 400,
    //         layout: { background: { color: "#fff" }, textColor: "#333" },
    //         grid: {
    //             vertLines: { color: "#eee" },
    //             horzLines: { color: "#eee" },
    //         },
    //         crosshair: { mode: 1 },
    //         timeScale: { timeVisible: true, secondsVisible: false },
    //     });
    //     console.log("Chart instance:", chart);

    //     const candleSeries = chart.addCandlestickSeries({
    //         upColor: "#26a69a",
    //         downColor: "#ef5350",
    //         borderVisible: false,
    //         wickUpColor: "#26a69a",
    //         wickDownColor: "#ef5350",
    //     });

    //     if (data && data.length > 0) {
    //         candleSeries.setData(
    //             data.map((d) => {
    //                 let timestamp;

    //                 // ✅ If MySQL timestamp (e.g. "2025-08-25 14:30:00")
    //                 if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(d.time)) {
    //                     timestamp = new Date(d.time.replace(" ", "T") + "Z").getTime();
    //                 }
    //                 // ✅ If Mongo ISO timestamp (e.g. "2025-08-25T14:30:00Z")
    //                 else {
    //                     timestamp = new Date(d.time).getTime();
    //                 }

    //                 return {
    //                     time: Math.floor(timestamp / 1000), // lightweight-charts needs seconds
    //                     open: Number(d.open),
    //                     high: Number(d.high),
    //                     low: Number(d.low),
    //                     close: Number(d.close),
    //                 };
    //             })
    //         );
    //     }

    //     const handleResize = () => {
    //         chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    //     };

    //     window.addEventListener("resize", handleResize);

    //     return () => {
    //         window.removeEventListener("resize", handleResize);
    //         chart.remove();
    //     };
    // }, [data]);
    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: 600,
            height: 400,
        });

        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData([
            { time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 },
            { time: "2024-01-02", open: 105, high: 115, low: 95, close: 100 },
        ]);

        return () => chart.remove();
    }, []);


    return (
        <div
            ref={chartContainerRef}
            className="w-full h-[400px] rounded-lg shadow-lg border"
        />
    );
}
