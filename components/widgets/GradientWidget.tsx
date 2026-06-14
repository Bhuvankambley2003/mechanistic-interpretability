"use client";
import { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

function loss(p: number) { return 0.7 * (p - 1.2) ** 2 + 0.05 * (p - 1.2) ** 4 + 0.3; }
function grad(p: number) { return 1.4 * (p - 1.2) + 0.2 * (p - 1.2) ** 3; }

const curve = Array.from({ length: 80 }, (_, i) => ({ x: +(-3 + i * 0.076).toFixed(3), loss: +loss(-3 + i * 0.076).toFixed(4) }));

export default function GradientWidget() {
  const [pos, setPos] = useState(-2.8);
  const [lr, setLr] = useState(0.1);
  const [steps, setSteps] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function step(p = pos) {
    const g = grad(p);
    const np = p - lr * g;
    setPos(np);
    setSteps(s => s + 1);
    setHistory(h => [...h, +loss(np).toFixed(5)]);
    return np;
  }

  function autoRun() {
    if (running) { clearInterval(timer.current!); setRunning(false); return; }
    setRunning(true);
    let p = pos;
    timer.current = setInterval(() => {
      const g = grad(p);
      p = p - lr * g;
      setPos(p);
      setSteps(s => s + 1);
      setHistory(h => [...h, +loss(p).toFixed(5)]);
      if (Math.abs(g) < 0.01) { clearInterval(timer.current!); setRunning(false); }
    }, 100);
  }

  function reset() {
    clearInterval(timer.current!);
    setRunning(false);
    setPos(-2.8);
    setSteps(0);
    setHistory([]);
  }

  const current = [{ x: +pos.toFixed(3), loss: +loss(pos).toFixed(4) }];

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", color: "var(--muted)", width: "110px" }}>Learning rate η</span>
        <input type="range" min={0.02} max={0.4} step={0.01} value={lr}
          onChange={e => setLr(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ fontSize: "12px", fontFamily: "var(--font-geist-mono)", width: "40px", textAlign: "right" }}>{lr.toFixed(2)}</span>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <button onClick={reset} style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "6px", border: "0.5px solid var(--rule)", background: "transparent", cursor: "pointer", color: "var(--ink)" }}>Reset</button>
        <button onClick={() => step()} style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "6px", border: "0.5px solid var(--rule)", background: "transparent", cursor: "pointer", color: "var(--ink)" }}>Step once</button>
        <button onClick={autoRun} style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "6px", border: "none", background: "var(--accent)", color: "white", cursor: "pointer" }}>
          {running ? "Stop" : "Auto run"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        {[
          ["step", steps],
          ["position", pos.toFixed(4)],
          ["gradient", grad(pos).toFixed(4)],
          ["loss", loss(pos).toFixed(4)],
        ].map(([label, val]) => (
          <div key={label} style={{ background: "#F5F5F3", borderRadius: "6px", padding: "6px 10px", fontSize: "12px" }}>
            <span style={{ color: "var(--muted)" }}>{label} </span>
            <span style={{ fontFamily: "var(--font-geist-mono)", color: "var(--ink)" }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={curve} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--muted)" }} tickCount={7} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} />
            <Tooltip contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }} />
            <Line type="monotone" dataKey="loss" stroke="#534AB7" strokeWidth={2} dot={false} name="loss" />
            <ReferenceLine x={+pos.toFixed(3)} stroke="#D85A30" strokeWidth={2} label={{ value: "●", fill: "#D85A30", fontSize: 14 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {history.length > 1 && (
        <div style={{ width: "100%", height: 120, marginTop: "8px" }}>
          <ResponsiveContainer>
            <LineChart data={history.map((l, i) => ({ step: i, loss: l }))} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
              <XAxis dataKey="step" tick={{ fontSize: 10, fill: "var(--muted)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} />
              <Line type="monotone" dataKey="loss" stroke="#1D9E75" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
