// trading/components/CandlestickChart.jsx
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart({ data }) {
    const chartContainerRef = useRef();

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: { background: { color: "#fff" }, textColor: "#333" },
            grid: {
                vertLines: { color: "#eee" },
                horzLines: { color: "#eee" },
            },
            crosshair: {
                mode: 1,
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            }
        });

        const candleSeries = chart.addCandlestickSeries({
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
        });

        candleSeries.setData(data);

        // Map your OHLC data
        // if (data && data.length > 0) {
        //     candleSeries.setData(
        //         data.map((d) => ({
        //             time: d.time, // should be "YYYY-MM-DD" or timestamp
        //             open: d.open,
        //             high: d.high,
        //             low: d.low,
        //             close: d.close,
        //         }))
        //     );
        // }

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [data]);

    return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
