"use client";
import { useState } from "react";

const INFO: Record<string, { title: string; body: string }> = {
  input: {
    title: "Input neuron",
    body: "Holds the raw value of x. No weight, no bias. Fans the same x identically to all 16 hidden neurons. Each hidden neuron then multiplies it by its own unique W1 weight.",
  },
  output: {
    title: "Output neuron (ŷ)",
    body: "Collects all 16 hidden outputs, each scaled by W2[i], sums them, then adds b2. No ReLU — the raw number is the final prediction. This is where b2 = 0.175 instead of 0.01 was observed.",
  },
  w1: {
    title: "W1 — 16 input→hidden weights",
    body: "Each hidden neuron has exactly one W1 weight. It controls how strongly x influences that neuron. Positive W1 = fires for large positive x. Negative W1 = fires for negative x. He-initialized at epoch 0.",
  },
  w2: {
    title: "W2 — 16 hidden→output weights",
    body: "Controls each hidden neuron's contribution to the final prediction. A neuron with W2 ≈ 0 is effectively ignored. In our experiment W2 collectively underestimated x² by ~0.165, which forced b2 to compensate.",
  },
  b2: {
    title: "b2 — output bias",
    body: "A single constant added to every prediction regardless of x. Should ideally converge to 0.01 (the true constant). Instead drifted to 0.175 — the equifinality problem. The truth was distributed across parameters.",
  },
};

for (let i = 0; i < 16; i++) {
  INFO[`h${i}`] = {
    title: `Hidden neuron h${i + 1}`,
    body: `Has two personal parameters: W1[${i}] (weight on x) and b1[${i}] (bias). Computes Z1 = x × W1[${i}] + b1[${i}], then A1 = max(0, Z1) via ReLU. If Z1 ≤ 0 for this input, outputs 0 and receives zero gradient — it does not learn from this sample.`,
  };
}

export default function ArchitectureWidget() {
  const [active, setActive] = useState<string | null>(null);
  const info = active ? INFO[active] : null;

  const N = 16;
  const hYs = Array.from({ length: N }, (_, i) => 32 + i * 27);
  const svgH = 32 + 15 * 27 + 32;
  const ix = 70, iy = svgH / 2, ox = 530, oy = svgH / 2;
  const hx = 300;

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div
        style={{
          display: "flex", gap: "6px", flexWrap: "wrap",
          marginBottom: "12px", fontSize: "12px",
        }}
      >
        {[
          { k: "input", label: "Input" },
          { k: "w1", label: "W1 weights" },
          { k: "h0", label: "Hidden neurons" },
          { k: "w2", label: "W2 weights" },
          { k: "b2", label: "b2 bias" },
          { k: "output", label: "Output" },
        ].map(({ k, label }) => (
          <button
            key={k}
            onClick={() => setActive(active === k ? null : k)}
            style={{
              padding: "4px 10px", borderRadius: "99px", fontSize: "12px",
              border: "0.5px solid",
              borderColor: active === k ? "var(--accent)" : "var(--rule)",
              background: active === k ? "var(--accent-light)" : "transparent",
              color: active === k ? "var(--accent)" : "var(--muted)",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 600 ${svgH}`}
        style={{ width: "100%", display: "block" }}
      >
        {hYs.map((y, i) => (
          <g key={`w1-${i}`}>
            <line x1={ix + 22} y1={iy} x2={hx - 14} y2={y}
              stroke="#E5E5E0" strokeWidth={0.8} />
          </g>
        ))}
        {hYs.map((y, i) => (
          <g key={`w2-${i}`}>
            <line x1={hx + 14} y1={y} x2={ox - 22} y2={oy}
              stroke="#E5E5E0" strokeWidth={0.8} />
          </g>
        ))}

        <g
          style={{ cursor: "pointer" }}
          onClick={() => setActive(active === "w1" ? null : "w1")}
        >
          <rect x={145} y={iy - 18} width={52} height={36} rx={6}
            fill={active === "w1" ? "var(--accent-light)" : "#F5F5F3"}
            stroke={active === "w1" ? "var(--accent)" : "var(--rule)"}
            strokeWidth={0.8} />
          <text x={171} y={iy - 4} textAnchor="middle"
            style={{ fontSize: 11, fill: active === "w1" ? "var(--accent)" : "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>W1</text>
          <text x={171} y={iy + 9} textAnchor="middle"
            style={{ fontSize: 10, fill: "var(--muted)" }}>16 wts</text>
        </g>

        <g
          style={{ cursor: "pointer" }}
          onClick={() => setActive(active === "w2" ? null : "w2")}
        >
          <rect x={403} y={iy - 18} width={52} height={36} rx={6}
            fill={active === "w2" ? "var(--accent-light)" : "#F5F5F3"}
            stroke={active === "w2" ? "var(--accent)" : "var(--rule)"}
            strokeWidth={0.8} />
          <text x={429} y={iy - 4} textAnchor="middle"
            style={{ fontSize: 11, fill: active === "w2" ? "var(--accent)" : "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>W2</text>
          <text x={429} y={iy + 9} textAnchor="middle"
            style={{ fontSize: 10, fill: "var(--muted)" }}>16 wts</text>
        </g>

        <g style={{ cursor: "pointer" }} onClick={() => setActive(active === "input" ? null : "input")}>
          <circle cx={ix} cy={iy} r={20}
            fill={active === "input" ? "var(--accent-light)" : "white"}
            stroke={active === "input" ? "var(--accent)" : "#534AB7"}
            strokeWidth={1.5} />
          <text x={ix} y={iy - 3} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 13, fontWeight: 500, fill: "#534AB7" }}>x</text>
          <text x={ix} y={iy + 11} textAnchor="middle"
            style={{ fontSize: 9, fill: "#534AB7" }}>input</text>
        </g>

        {hYs.map((y, i) => (
          <g
            key={`h${i}`} style={{ cursor: "pointer" }}
            onClick={() => setActive(active === `h${i}` ? null : `h${i}`)}
          >
            <circle cx={hx} cy={y} r={12}
              fill={active === `h${i}` ? "var(--accent-light)" : "white"}
              stroke={active?.startsWith("h") && active === `h${i}` ? "var(--accent)" : "#1D9E75"}
              strokeWidth={1} />
            <text x={hx} y={y} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: 9, fontWeight: 500, fill: "#1D9E75" }}>
              h{i + 1}
            </text>
          </g>
        ))}

        <g style={{ cursor: "pointer" }} onClick={() => setActive(active === "output" ? null : "output")}>
          <circle cx={ox} cy={oy} r={20}
            fill={active === "output" ? "#FAECE7" : "white"}
            stroke="#D85A30" strokeWidth={1.5} />
          <text x={ox} y={oy - 4} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 13, fontWeight: 500, fill: "#D85A30" }}>ŷ</text>
          <text x={ox} y={oy + 10} textAnchor="middle"
            style={{ fontSize: 9, fill: "#D85A30" }}>output</text>
        </g>

        <g style={{ cursor: "pointer" }} onClick={() => setActive(active === "b2" ? null : "b2")}>
          <rect x={ox - 28} y={oy + 26} width={56} height={20} rx={5}
            fill={active === "b2" ? "#FAECE7" : "#F5F5F3"}
            stroke={active === "b2" ? "#D85A30" : "var(--rule)"}
            strokeWidth={0.8} />
          <text x={ox} y={oy + 36} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 10, fill: "#D85A30", fontFamily: "var(--font-geist-mono)" }}>
            + b2
          </text>
        </g>

        <text x={300} y={svgH - 4} textAnchor="middle"
          style={{ fontSize: 10, fill: "var(--muted)" }}>
          W1(16) + b1(16) + W2(16) + b2(1) = 49 parameters
        </text>
      </svg>

      {info && (
        <div
          style={{
            marginTop: "12px", padding: "12px 16px",
            background: "var(--accent-light)",
            borderRadius: "8px", borderLeft: "3px solid var(--accent)",
            fontSize: "13px", lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "var(--accent)", display: "block", marginBottom: "4px" }}>
            {info.title}
          </strong>
          <span style={{ color: "var(--ink)" }}>{info.body}</span>
        </div>
      )}
    </div>
  );
}
