"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Snapshot {
  epoch: number;
  train_loss: number;
  test_loss: number;
  b2: number;
  W1: number[];
  W2: number[];
}

export default function TrainingWidget() {
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch("/training_log.json")
      .then(r => r.json())
      .then(d => { setHistory(d.history); setIdx(d.history.length - 1); });
  }, []);

  if (!history.length) return <div style={{ fontSize: "13px", color: "var(--muted)", padding: "2rem 0" }}>Loading training data…</div>;

  const snap = history[idx];
  const lossData = history.map(s => ({ epoch: s.epoch, train: s.train_loss, test: s.test_loss }));
  const b2Data = history.map(s => ({ epoch: s.epoch, b2: s.b2 }));

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>
          <span>Epoch 1</span>
          <span style={{ fontFamily: "var(--font-geist-mono)", color: "var(--accent)" }}>Epoch {snap.epoch}</span>
          <span>Epoch {history[history.length - 1].epoch}</span>
        </div>
        <input type="range" min={0} max={history.length - 1} step={1} value={idx}
          onChange={e => setIdx(+e.target.value)} style={{ width: "100%" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "Train loss", val: snap.train_loss.toFixed(4) },
          { label: "Test loss", val: snap.test_loss.toFixed(4) },
          { label: "b2", val: snap.b2.toFixed(4) },
          { label: "b2 target", val: "0.0100" },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: "#F5F5F3", borderRadius: "6px", padding: "8px 10px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: "13px", color: "var(--ink)" }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Loss over training</div>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={lossData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "var(--muted)" }} tickCount={6} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} />
            <Tooltip contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }} />
            <Line type="monotone" dataKey="train" stroke="#534AB7" strokeWidth={1.5} dot={false} name="train loss" />
            <Line type="monotone" dataKey="test" stroke="#D85A30" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="test loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ fontSize: "11px", color: "var(--muted)", margin: "16px 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>b2 drift — should converge to 0.01</div>
      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer>
          <LineChart data={b2Data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "var(--muted)" }} tickCount={6} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} />
            <Tooltip contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }} />
            <Line type="monotone" dataKey="b2" stroke="#1D9E75" strokeWidth={1.5} dot={false} name="b2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
        <span><span style={{ display: "inline-block", width: 12, height: 2, background: "#534AB7", verticalAlign: "middle", marginRight: 4 }} />train loss</span>
        <span><span style={{ display: "inline-block", width: 12, height: 2, background: "#D85A30", verticalAlign: "middle", marginRight: 4 }} />test loss</span>
        <span><span style={{ display: "inline-block", width: 12, height: 2, background: "#1D9E75", verticalAlign: "middle", marginRight: 4 }} />b2 value</span>
      </div>
    </div>
  );
}
