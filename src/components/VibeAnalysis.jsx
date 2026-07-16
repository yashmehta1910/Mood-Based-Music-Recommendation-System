import { useEffect, useState } from "react";

/**
 * VibeAnalysis Component:
 * UI module rendering semantic metrics returned by the AI pipeline. 
 * Implements transitions using React state hooks to coordinate bar layout transitions 
 * and maps thematic styling profiles.
 */
export default function VibeAnalysis({ analysis, theme }) {
  const [animated, setAnimated] = useState(false);

  // Hook triggered on analysis change updates to orchestrate bar expansion behaviors
  useEffect(() => {
    if (analysis) { 
      setAnimated(false); 
      // Delay execution block slightly to ensure DOM insertion handles animation curves correctly
      setTimeout(() => setAnimated(true), 100); 
    }
  }, [analysis]);

  if (!analysis) return null;

  const { r, g, b } = theme || { r: 201, g: 168, b: 76 };

  return (
    <div style={{
      marginBottom: 32, padding: 24, borderRadius: 16,
      border: `1px solid rgba(${r},${g},${b},0.2)`,
      background: `linear-gradient(135deg, rgba(${r},${g},${b},0.05), var(--surface))`,
      animation: "fadeUp 0.4s ease",
    }}>
      {/* Upper Analysis Info Row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: "var(--text)", marginBottom: 6, textTransform: "capitalize" }}>
            {analysis.mood}
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, maxWidth: 340 }}>{analysis.summary}</p>
        </div>
        
        {/* Extracted NLP Keyword Badges */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 180 }}>
          {(analysis.tags || []).map((tag) => (
            <span 
              key={tag} 
              style={{
                fontSize: 10, padding: "4px 10px", borderRadius: 999,
                border: `1px solid rgba(${r},${g},${b},0.3)`,
                color: `rgb(${r},${g},${b})`,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Numerical Sentiment Measurement Bars */}
      {[{ label: "Energy", value: analysis.energy }, { label: "Mood", value: analysis.valence }].map((bar) => (
        <div key={bar.label} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span>{bar.label}</span><span>{bar.value}%</span>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: "var(--border)" }}>
            <div 
              style={{
                height: 3, 
                borderRadius: 2,
                background: `rgb(${r},${g},${b})`,
                // Transitions triggered smoothly using cubic-bezier layout calculations
                width: animated ? `${bar.value}%` : "0%",
                transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
              }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}