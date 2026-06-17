"use client";
import { useState, useRef, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Legend, ResponsiveContainer,
} from "recharts";

function loss(p: number) { return 0.7 * (p - 1.2) ** 2 + 0.05 * (p - 1.2) ** 4 + 0.3; }
function grad(p: number) { return 1.4 * (p - 1.2) + 0.2 * (p - 1.2) ** 3; }

const curve = Array.from({ length: 80 }, (_, i) => ({
  x: +(-3 + i * 0.076).toFixed(3),
  loss: +loss(-3 + i * 0.076).toFixed(4),
}));

// Ease-out cubic: starts fast, decelerates
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function GradientWidget() {
  const [pos, setPos] = useState(-2.8);
  const [displayPos, setDisplayPos] = useState(-2.8); // smoothly animated
  const [lr, setLr] = useState(0.1);
  const [steps, setSteps] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrame = useRef<number | null>(null);
  const prevPos = useRef(-2.8);

  // Whenever pos changes, smoothly animate displayPos toward it
  useEffect(() => {
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    const from = prevPos.current;
    const to = pos;
    const duration = 450; // ms
    const start = performance.now();

    function animate(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeOut(t);
      setDisplayPos(from + (to - from) * eased);
      if (t < 1) {
        animFrame.current = requestAnimationFrame(animate);
      } else {
        prevPos.current = to;
      }
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [pos]);

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
    }, 600); // 600ms per step so the bounce is clearly visible
  }

  function reset() {
    clearInterval(timer.current!);
    setRunning(false);
    setPos(-2.8);
    prevPos.current = -2.8;
    setDisplayPos(-2.8);
    setSteps(0);
    setHistory([]);
  }

  // Merge curve data with the current position dot
  const chartData = curve.map(d => ({
    ...d,
    position: Math.abs(d.x - +displayPos.toFixed(3)) < 0.04 ? +loss(displayPos).toFixed(4) : undefined,
  }));

  return (
    <div style={{ marginTop: "1.5rem" }}>

      {/* ── Learning rate slider ── */}
      <div style={{
        background: "#F5F5F3", borderRadius: "8px",
        padding: "12px 16px", marginBottom: "16px",
      }}>
        <div style={{
          fontSize: "11px", color: "var(--muted)", textTransform: "uppercase",
          letterSpacing: "0.05em", marginBottom: "10px",
          fontFamily: "var(--font-geist-mono)",
        }}>
          Learning rate η — controls step size
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>slow (0.02)</span>
          <input
            type="range" min={0.02} max={0.4} step={0.01} value={lr}
            onChange={e => setLr(+e.target.value)} style={{ flex: 1 }}
          />
          <span style={{ fontSize: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>fast (0.40)</span>
          <span style={{
            fontSize: "14px", fontFamily: "var(--font-geist-mono)",
            color: "var(--accent)", fontWeight: 600,
            background: "var(--accent-light)", padding: "2px 10px",
            borderRadius: "6px", minWidth: "52px", textAlign: "center",
          }}>
            η = {lr.toFixed(2)}
          </span>
        </div>
        <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink)" }}>Low η:</strong> tiny steps, slow but stable.{" "}
          <strong style={{ color: "var(--ink)" }}>High η:</strong> big steps, fast but may overshoot and oscillate.
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <button onClick={reset} style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "6px", border: "0.5px solid var(--rule)", background: "transparent", cursor: "pointer", color: "var(--ink)" }}>Reset</button>
        <button onClick={() => step()} style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "6px", border: "0.5px solid var(--rule)", background: "transparent", cursor: "pointer", color: "var(--ink)" }}>Step once</button>
        <button onClick={autoRun} style={{ padding: "5px 12px", fontSize: "12px", borderRadius: "6px", border: "none", background: "var(--accent)", color: "white", cursor: "pointer" }}>
          {running ? "Stop" : "Auto run"}
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {[
          { label: "step", val: steps, hint: "updates so far" },
          { label: "position", val: pos.toFixed(4), hint: "current param value" },
          { label: "gradient", val: grad(pos).toFixed(4), hint: "slope of the hill" },
          { label: "loss", val: loss(pos).toFixed(4), hint: "current error" },
        ].map(({ label, val, hint }) => (
          <div key={label} style={{ background: "#F5F5F3", borderRadius: "6px", padding: "6px 10px", fontSize: "12px" }}>
            <div style={{ color: "var(--muted)", fontSize: "10px", marginBottom: "2px" }}>{hint}</div>
            <span style={{ color: "var(--muted)" }}>{label} </span>
            <span style={{ fontFamily: "var(--font-geist-mono)", color: "var(--ink)" }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ── Loss landscape chart ── */}
      <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px", fontFamily: "var(--font-geist-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Loss landscape — one parameter, one curve
      </div>

      {/* Live value callout above the orange chart */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: "12px",
          background: "#FEF3ED", borderRadius: "8px", padding: "8px 12px",
          borderLeft: "3px solid #D85A30", flex: 1, minWidth: "120px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
            <span style={{ color: "var(--muted)", fontSize: "11px" }}>position</span>
            <span style={{ color: "#D85A30", fontWeight: 700 }}>{displayPos.toFixed(4)}</span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>Where the ball sits on the x-axis. Starts at −2.8, converges to 1.2 (minimum).</div>
        </div>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: "12px",
          background: "#FEF3ED", borderRadius: "8px", padding: "8px 12px",
          borderLeft: "3px solid #D85A30", flex: 1, minWidth: "120px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
            <span style={{ color: "var(--muted)", fontSize: "11px" }}>loss</span>
            <span style={{ color: "#D85A30", fontWeight: 700 }}>{loss(displayPos).toFixed(4)}</span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>Height of the hill at this position. This is what gradient descent is minimising.</div>
        </div>
        <div style={{
          fontFamily: "var(--font-geist-mono)", fontSize: "12px",
          background: "#F0EEF9", borderRadius: "8px", padding: "8px 12px",
          borderLeft: "3px solid #534AB7", flex: 1, minWidth: "120px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
            <span style={{ color: "var(--muted)", fontSize: "11px" }}>gradient</span>
            <span style={{ color: "#534AB7", fontWeight: 700 }}>{grad(pos).toFixed(4)}</span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>Slope of the hill right now. Large = steep hill, big step. Near zero = flat, ball stops.</div>
        </div>
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[-3, 3]}
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              tickCount={7}
              label={{ value: "Parameter value (position)", position: "insideBottom", offset: -18, fill: "var(--muted)", fontSize: 11 }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              label={{ value: "Loss", angle: -90, position: "insideLeft", offset: -25, fill: "var(--muted)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }}
              formatter={(v: unknown) => (typeof v === "number" ? v.toFixed(4) : String(v))}
            />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "6px" }}
              formatter={(value) => value === "loss" ? "Loss curve" : "Current position"}
            />
            <Line
              type="monotone"
              dataKey="loss"
              stroke="#534AB7"
              strokeWidth={2}
              dot={false}
              name="loss"
            />
            {/* Orange dashed vertical at current position */}
            <ReferenceLine
              x={+displayPos.toFixed(3)}
              stroke="#D85A30"
              strokeWidth={2}
              strokeDasharray="4 2"
              label={{
                value: `p=${displayPos.toFixed(2)}  L=${loss(displayPos).toFixed(3)}`,
                position: "insideTopLeft",
                fill: "#D85A30",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            />
            {/* Orange dot sitting on the curve */}
            <Line
              data={[{ x: +displayPos.toFixed(3), loss: +loss(displayPos).toFixed(4) }]}
              type="monotone"
              dataKey="loss"
              stroke="#D85A30"
              strokeWidth={0}
              dot={{ r: 7, fill: "#D85A30", stroke: "white", strokeWidth: 2 }}
              activeDot={false}
              isAnimationActive={false}
              name="position"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Loss history chart ── */}
      {history.length > 1 && (
        <>
          <div style={{ fontSize: "11px", color: "var(--muted)", margin: "16px 0 4px", fontFamily: "var(--font-geist-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Loss over steps — how quickly learning slows down
          </div>

          {/* Live step readout with explanations */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
            <div style={{
              fontFamily: "var(--font-geist-mono)", fontSize: "12px",
              background: "#EAF6F1", borderRadius: "8px", padding: "8px 12px",
              borderLeft: "3px solid #1D9E75", flex: 1, minWidth: "100px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                <span style={{ color: "var(--muted)", fontSize: "11px" }}>step</span>
                <span style={{ color: "#1D9E75", fontWeight: 700 }}>{steps}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>Number of gradient updates applied so far.</div>
            </div>
            <div style={{
              fontFamily: "var(--font-geist-mono)", fontSize: "12px",
              background: "#EAF6F1", borderRadius: "8px", padding: "8px 12px",
              borderLeft: "3px solid #1D9E75", flex: 1, minWidth: "100px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                <span style={{ color: "var(--muted)", fontSize: "11px" }}>loss</span>
                <span style={{ color: "#1D9E75", fontWeight: 700 }}>{history[history.length - 1]?.toFixed(5)}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>Current error. Drops fast at first, then plateaus as the gradient shrinks.</div>
            </div>
            <div style={{
              fontFamily: "var(--font-geist-mono)", fontSize: "12px",
              background: "#EAF6F1", borderRadius: "8px", padding: "8px 12px",
              borderLeft: `3px solid ${history.length > 1 && history[history.length-1] < history[history.length-2] ? "#1D9E75" : "#D85A30"}`,
              flex: 1, minWidth: "100px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                <span style={{ color: "var(--muted)", fontSize: "11px" }}>Δloss</span>
                <span style={{ color: history.length > 1 && history[history.length-1] < history[history.length-2] ? "#1D9E75" : "#D85A30", fontWeight: 700 }}>
                  {history.length > 1 ? (history[history.length-1] - history[history.length-2]).toFixed(5) : "—"}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>Change in loss this step. Green = improving. Red = overshot (only at high η).</div>
            </div>
          </div>

          <div style={{ width: "100%", height: 170 }}>
            <ResponsiveContainer>
              <LineChart
                data={history.map((l, i) => ({ step: i + 1, loss: l }))}
                margin={{ top: 10, right: 30, bottom: 30, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
                <XAxis
                  dataKey="step"
                  tick={{ fontSize: 10, fill: "var(--muted)" }}
                  label={{ value: "Step (gradient update)", position: "insideBottom", offset: -18, fill: "var(--muted)", fontSize: 11 }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted)" }}
                  label={{ value: "Loss", angle: -90, position: "insideLeft", offset: -25, fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: "0.5px solid var(--rule)", background: "var(--paper)", borderRadius: 6 }}
                  formatter={(v: unknown) => (typeof v === "number" ? v.toFixed(5) : String(v))}
                />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ fontSize: "11px", paddingBottom: "4px" }}
                  formatter={() => "Loss per step"}
                />
                {/* Main green line with small dots at each step */}
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#1D9E75"
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: "#1D9E75", stroke: "white", strokeWidth: 1 }}
                  isAnimationActive={false}
                  name="loss"
                />
                {/* Latest step — highlighted dot with label */}
                <Line
                  data={[{ step: history.length, loss: history[history.length - 1] }]}
                  dataKey="loss"
                  stroke="#1D9E75"
                  strokeWidth={0}
                  dot={{ r: 6, fill: "#1D9E75", stroke: "white", strokeWidth: 2 }}
                  activeDot={false}
                  isAnimationActive={false}
                  name="latest"
                  label={(props: any) => {
                    const { x, y } = props;
                    return (
                      <text
                        x={x}
                        y={y}
                        dx={10}
                        dy={3}
                        fill="#1D9E75"
                        fontSize={10}
                        fontFamily="monospace"
                        textAnchor="start"
                      >
                        {`step ${history.length}: ${history[history.length-1]?.toFixed(4)}`}
                      </text>
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── Explanation ── */}
      <div style={{
        marginTop: "20px",
        padding: "14px 16px",
        background: "#F5F5F3",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: 1.75,
        color: "var(--muted)",
      }}>
        <div style={{ fontWeight: 500, color: "var(--ink)", marginBottom: "8px", fontSize: "13px" }}>
          What this simulation shows
        </div>
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: "var(--ink)" }}>The purple curve</strong> is the loss landscape — it maps every possible value of a single parameter to the resulting error. The goal is to find the <em>bottom of the valley</em> (minimum loss), which sits at position 1.2.
        </p>
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: "#D85A30" }}>The orange dot</strong> is the parameter — it starts at −2.8 (random initialisation, high loss) and rolls down the hill one step at a time. Each step applies the rule: <code style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", background: "var(--accent-light)", color: "var(--accent)", padding: "1px 5px", borderRadius: "3px" }}>position ← position − η × gradient</code>.
        </p>
        <p style={{ margin: "0 0 8px" }}>
          <strong style={{ color: "#1D9E75" }}>The green chart</strong> records the loss at each step. It drops steeply at first (steep hill = large gradient = big step) then flattens as the ball nears the bottom — the same shape your real 8,000-epoch training loss produced.
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: "var(--ink)" }}>Try this:</strong> set η to 0.4 and hit Auto run — the ball overshoots past 1.2 and bounces. Then reset, set η to 0.05, and watch it creep steadily down. That tradeoff is the entire learning rate tuning problem in real training.
        </p>
      </div>

    </div>
  );
}
