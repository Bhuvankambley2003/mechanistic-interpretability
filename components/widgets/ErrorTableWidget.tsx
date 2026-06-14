"use client";

const rows = [
  { x: -3, trueY: 9.010, raw: 8.486, b2: 0.175, output: 8.662, error: -0.348 },
  { x: -2, trueY: 4.010, raw: 3.898, b2: 0.175, output: 4.073, error: 0.063 },
  { x: -1, trueY: 1.010, raw: 0.834, b2: 0.175, output: 1.010, error: -0.0004 },
  { x:  0, trueY: 0.010, raw: 0.000, b2: 0.175, output: 0.175, error: 0.165 },
  { x:  1, trueY: 1.010, raw: 0.931, b2: 0.175, output: 1.106, error: 0.096 },
  { x:  2, trueY: 4.010, raw: 3.902, b2: 0.175, output: 4.078, error: 0.068 },
  { x:  3, trueY: 9.010, raw: 8.454, b2: 0.175, output: 8.629, error: -0.381 },
];

function errorColor(e: number) {
  const abs = Math.abs(e);
  if (abs > 0.3) return "#FCEBEB";
  if (abs > 0.05) return "#FAEEDA";
  return "#EAF3DE";
}
function errorText(e: number) {
  const abs = Math.abs(e);
  if (abs > 0.3) return "#A32D2D";
  if (abs > 0.05) return "#854F0B";
  return "#3B6D11";
}

export default function ErrorTableWidget() {
  return (
    <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "var(--font-geist-mono)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--rule)" }}>
            {["x", "true y", "A1·W2", "b2", "output", "error"].map(h => (
              <th key={h} style={{ padding: "8px 10px", textAlign: "right", color: "var(--muted)", fontWeight: 400, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.x} style={{ borderBottom: "0.5px solid var(--rule)" }}>
              <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--ink)" }}>{r.x}</td>
              <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--ink)" }}>{r.trueY.toFixed(3)}</td>
              <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--muted)" }}>{r.raw.toFixed(3)}</td>
              <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--muted)" }}>{r.b2.toFixed(3)}</td>
              <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--ink)" }}>{r.output.toFixed(3)}</td>
              <td style={{ padding: "10px 10px", textAlign: "right" }}>
                <span style={{
                  background: errorColor(r.error),
                  color: errorText(r.error),
                  padding: "2px 8px", borderRadius: "4px", fontSize: "12px",
                }}>
                  {r.error > 0 ? "+" : ""}{r.error.toFixed(4)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--muted)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#FCEBEB", borderRadius: "2px", marginRight: 4, verticalAlign: "middle" }} />large error (&gt;0.3)</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#FAEEDA", borderRadius: "2px", marginRight: 4, verticalAlign: "middle" }} />moderate error</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#EAF3DE", borderRadius: "2px", marginRight: 4, verticalAlign: "middle" }} />small error</span>
      </div>
    </div>
  );
}
