// trading/components/CandlestickChart.jsx
// import React, { useEffect, useRef } from "react";
// import { createChart } from "lightweight-charts";

// export default function CandlestickChart({ data }) {
//     const chartContainerRef = useRef();

//     // useEffect(() => {
//     //     const chart = createChart(chartContainerRef.current, {
//     //         width: chartContainerRef.current.clientWidth,
//     //         height: 400,
//     //         layout: { background: { color: "#fff" }, textColor: "#333" },
//     //         grid: {
//     //             vertLines: { color: "#eee" },
//     //             horzLines: { color: "#eee" },
//     //         },
//     //         crosshair: { mode: 1 },
//     //         timeScale: { timeVisible: true, secondsVisible: false },
//     //     });
//     //     console.log("Chart instance:", chart);

//     //     const candleSeries = chart.addCandlestickSeries({
//     //         upColor: "#26a69a",
//     //         downColor: "#ef5350",
//     //         borderVisible: false,
//     //         wickUpColor: "#26a69a",
//     //         wickDownColor: "#ef5350",
//     //     });

//     //     if (data && data.length > 0) {
//     //         candleSeries.setData(
//     //             data.map((d) => {
//     //                 let timestamp;

//     //                 // ✅ If MySQL timestamp (e.g. "2025-08-25 14:30:00")
//     //                 if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(d.time)) {
//     //                     timestamp = new Date(d.time.replace(" ", "T") + "Z").getTime();
//     //                 }
//     //                 // ✅ If Mongo ISO timestamp (e.g. "2025-08-25T14:30:00Z")
//     //                 else {
//     //                     timestamp = new Date(d.time).getTime();
//     //                 }

//     //                 return {
//     //                     time: Math.floor(timestamp / 1000), // lightweight-charts needs seconds
//     //                     open: Number(d.open),
//     //                     high: Number(d.high),
//     //                     low: Number(d.low),
//     //                     close: Number(d.close),
//     //                 };
//     //             })
//     //         );
//     //     }

//     //     const handleResize = () => {
//     //         chart.applyOptions({ width: chartContainerRef.current.clientWidth });
//     //     };

//     //     window.addEventListener("resize", handleResize);

//     //     return () => {
//     //         window.removeEventListener("resize", handleResize);
//     //         chart.remove();
//     //     };
//     // }, [data]);
//     useEffect(() => {
//         const chart = createChart(chartContainerRef.current, {
//             width: 600,
//             height: 400,
//         });

//         const candleSeries = chart.addCandlestickSeries();
//         candleSeries.setData([
//             { time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 },
//             { time: "2024-01-02", open: 105, high: 115, low: 95, close: 100 },
//         ]);

//         return () => chart.remove();
//     }, []);


//     return (
//         <div
//             ref={chartContainerRef}
//             className="w-full h-[400px] rounded-lg shadow-lg border"
//         />
//     );
// }
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CandlestickChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border">
        Loading chart data...
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map((item, index) => {
    const open = Number(item.open) || Number(item.price) || 100;
    const close = Number(item.close) || Number(item.price) || 105;
    const high = Number(item.high) || Math.max(open, close) + 5;
    const low = Number(item.low) || Math.min(open, close) - 5;
    
    return {
      name: typeof item.time === "string" 
        ? new Date(item.time).toLocaleDateString() 
        : `Point ${index + 1}`,
      open,
      close,
      high,
      low,
      range: high - low,
      body: Math.abs(close - open),
      isUp: close >= open,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-semibold">{data.name}</p>
          <p>Open: ₹{data.open.toFixed(2)}</p>
          <p>Close: ₹{data.close.toFixed(2)}</p>
          <p>High: ₹{data.high.toFixed(2)}</p>
          <p>Low: ₹{data.low.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="range" 
            fill="#8884d8" 
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              const midX = x + width / 2;
              const isUp = payload.isUp;
              const bodyTop = isUp ? y + (height - payload.body) : y;
              const bodyBottom = isUp ? y + height : y + payload.body;
              
              return (
                <g>
                  {/* Wick line */}
                  <line
                    x1={midX}
                    y1={y}
                    x2={midX}
                    y2={y + height}
                    stroke={isUp ? "#26a69a" : "#ef5350"}
                    strokeWidth={1}
                  />
                  {/* Candlestick body */}
                  <rect
                    x={x}
                    y={bodyTop}
                    width={width}
                    height={payload.body}
                    fill={isUp ? "#26a69a" : "#ef5350"}
                  />
                </g>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;