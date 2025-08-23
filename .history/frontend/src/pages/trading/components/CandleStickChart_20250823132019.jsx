import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandleStickChart({ data, width = 600, height = 300 }) {