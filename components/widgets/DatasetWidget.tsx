"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Line, LineChart, Legend,
} from "recharts";

export default function DatasetWidget() {
  const [data, setData] = useState<{ x: number; y_noisy: number; y_clean: number }[]>([]);

  useEffect(() => {
    fetch("/train_data.csv")
      .then((r) => r.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1);
        const parsed = rows.map((row) => {
          const [x, y_noisy, y_clean] = row.split(",").map(Number);
          return { x, y_noisy, y_clean };
        });
        setData(parsed.sort((a, b) => a.x - b.x));
      });
  }, []);

  const cleanLine = data.map((d) => ({ x: d.x, y: d.y_clean }));
  const noisyDots = data.map((d) => ({ x: d.x, y: d.y_noisy }));

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px", fontFamily: "var(--font-geist-mono)" }}>
        240 training points · y = x² + 0.01 + ε · ε ~ N(0, 0.05)
      </p>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis
              dataKey="x" type="number" domain={[-3.2, 3.2]}
              tick={{ fontSize: 11, fill: "var(--muted)" }} label={{ value: "x", position: "insideBottom", offset: -10, fill: "var(--muted)", fontSize: 12 }}
            />
            <YAxis
              dataKey="y" type="number"
              tick={{ fontSize: 11, fill: "var(--muted)" }} label={{ value: "y", angle: -90, position: "insideLeft", fill: "var(--muted)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }}
              formatter={(v: unknown) => (typeof v === "number" ? v.toFixed(4) : String(v))}
            />
            <Scatter name="noisy data" data={noisyDots} fill="#888" opacity={0.4} r={2} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 200, marginTop: 8 }}>
        <ResponsiveContainer>
          <LineChart data={cleanLine} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis dataKey="x" tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <Tooltip contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }} />
            <Line type="monotone" dataKey="y" stroke="#534AB7" strokeWidth={2} dot={false} name="true y = x² + 0.01" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "12px", fontSize: "12px", color: "var(--muted)" }}>
        <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#888", marginRight: 6 }} />noisy training points</span>
        <span><span style={{ display: "inline-block", width: 12, height: 2, background: "#534AB7", marginRight: 6, verticalAlign: "middle" }} />true y = x² + 0.01</span>
      </div>
    </div>
  );
}
