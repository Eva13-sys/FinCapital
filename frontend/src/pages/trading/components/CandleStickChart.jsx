import { createChart, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";

export default function CandlestickChart({ series }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleRef = useRef(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      height: 420,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#111827",
      },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        autoScale: true,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
    });

    candleRef.current = chartRef.current.addSeries(
      CandlestickSeries,
      {
        upColor: "#16a34a",
        downColor: "#dc2626",
        wickUpColor: "#16a34a",
        wickDownColor: "#dc2626",
        borderVisible: false,
      }
    );

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const last = lastSizeRef.current;
      if (width === last.width && height === last.height) return;

      lastSizeRef.current = { width, height };

      requestAnimationFrame(() => {
        chartRef.current.applyOptions({ width, height });
        chartRef.current.timeScale().fitContent();
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleRef.current || !series?.length) return;

    candleRef.current.setData(series);
    chartRef.current.timeScale().fitContent();
  }, [series]);

  return <div ref={containerRef} className="w-full" />;
}
