"use client";

import { useEffect, useRef, useState } from "react";

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export default function Section({ number, title, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
        marginBottom: "5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--muted)", minWidth: "20px" }}>
          {number}
        </span>
        <h2 style={{ fontSize: "20px", fontWeight: 500, color: "var(--ink)", margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "1.5rem" }}>
        {children}
      </div>
    </section>
  );
}
