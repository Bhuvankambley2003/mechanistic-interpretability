"use client";
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function relu(z: number) { return Math.max(0, z); }

export default function ReluWidget() {
  const [w1a, setW1a] = useState(1.5);
  const [b1a, setB1a] = useState(-1.5);
  const [w1b, setW1b] = useState(-1.5);
  const [b1b, setB1b] = useState(-1.5);

  const xs = useMemo(() => Array.from({ length: 100 }, (_, i) => -3 + i * 0.061), []);

  const data = useMemo(() => xs.map(x => ({
    x: +x.toFixed(2),
    "n1": +relu(x * w1a + b1a).toFixed(4),
    "n2": +relu(x * w1b + b1b).toFixed(4),
    "sum": +(relu(x * w1a + b1a) + relu(x * w1b + b1b)).toFixed(4),
    "true": +(x * x).toFixed(4),
  })), [xs, w1a, b1a, w1b, b1b]);

  const sl = (label: string, val: number, set: (v: number) => void, min: number, max: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <span style={{ fontSize: "12px", color: "var(--muted)", width: "90px", fontFamily: "var(--font-geist-mono)" }}>{label}</span>
      <input type="range" min={min} max={max} step={0.05} value={val}
        onChange={e => set(+e.target.value)} style={{ flex: 1 }} />
      <span style={{ fontSize: "12px", fontFamily: "var(--font-geist-mono)", width: "40px", textAlign: "right", color: "var(--ink)" }}>
        {val.toFixed(2)}
      </span>
    </div>
  );

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div style={{ background: "#F5F5F3", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Neuron 1</div>
          {sl("W1 · slope", w1a, setW1a, -3, 3)}
          {sl("b1 · bend", b1a, setB1a, -3, 3)}
        </div>
        <div style={{ background: "#F5F5F3", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Neuron 2</div>
          {sl("W1 · slope", w1b, setW1b, -3, 3)}
          {sl("b1 · bend", b1b, setB1b, -3, 3)}
        </div>
      </div>

      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--muted)" }} tickCount={7} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} domain={[-0.5, 10]} />
            <Tooltip contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }} />
            <Line type="monotone" dataKey="true" stroke="#534AB7" strokeWidth={2} dot={false} name="true x²" />
            <Line type="monotone" dataKey="sum" stroke="#D85A30" strokeWidth={2} dot={false} strokeDasharray="5 3" name="n1 + n2" />
            <Line type="monotone" dataKey="n1" stroke="#1D9E75" strokeWidth={1} dot={false} strokeDasharray="2 2" name="neuron 1" />
            <Line type="monotone" dataKey="n2" stroke="#BA7517" strokeWidth={1} dot={false} strokeDasharray="2 2" name="neuron 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--muted)", marginTop: "8px", flexWrap: "wrap" }}>
        <span><span style={{ display: "inline-block", width: 12, height: 2, background: "#534AB7", verticalAlign: "middle", marginRight: 4 }} />true x²</span>
        <span><span style={{ display: "inline-block", width: 12, height: 2, background: "#D85A30", verticalAlign: "middle", marginRight: 4, borderTop: "2px dashed #D85A30" }} />sum of neurons</span>
        <span><span style={{ display: "inline-block", width: 12, height: 2, background: "#1D9E75", verticalAlign: "middle", marginRight: 4 }} />individual neurons</span>
      </div>
    </div>
  );
}
