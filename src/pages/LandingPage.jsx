import { useEffect, useState } from "react";

const WORDS = ["mood.", "vibe.", "feeling.", "moment.", "energy."];

/**
 * LandingPage Component:
 * The entry point for user interaction. Implements a React effect cycle 
 * to drive cyclical text animations and provides navigation anchors 
 * for the application core.
 */
export default function LandingPage({ onEnter }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // 1. Text Cycle Logic: Effect hook managing the animated word rotation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false); // Trigger exit animation
      setTimeout(() => { 
        setWordIndex(i => (i + 1) % WORDS.length); 
        setVisible(true); // Trigger entry animation
      }, 300);
    }, 2000);
    
    // Memory Management: Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center", position: "relative", zIndex: 1,
    }}>
      <p style={{
        fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
        color: "var(--accent)", marginBottom: 32,
        animation: "fadeIn 1s ease 0.2s both",
      }}>
        AI-powered music curation
      </p>

      {/* Hero Headline with Animated Cycler */}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(48px, 8vw, 80px)",
        fontWeight: 400, lineHeight: 1.1,
        color: "var(--text)", marginBottom: 16,
        animation: "fadeUp 0.8s ease 0.4s both",
      }}>
        Music for your<br />
        <span style={{
          color: "var(--accent)",
          fontStyle: "italic",
          display: "inline-block",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.3s ease",
          minWidth: 200,
        }}>
          {WORDS[wordIndex]}
        </span>
      </h1>

      <p style={{
        fontSize: 16, color: "var(--muted)", lineHeight: 1.8,
        maxWidth: 440, marginBottom: 48,
        animation: "fadeUp 0.8s ease 0.6s both",
      }}>
        Tell us how you feel in your own words. Our AI reads your mood and crafts the perfect playlist — instantly.
      </p>

      {/* Interaction Call-to-Actions */}
      <div style={{ display: "flex", gap: 16, animation: "fadeUp 0.8s ease 0.8s both" }}>
        <button onClick={onEnter} style={{
          padding: "14px 36px", borderRadius: 999,
          background: "var(--accent)", border: "none",
          color: "#080810", fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 500, cursor: "pointer",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => e.target.style.opacity = "0.85"}
          onMouseLeave={e => e.target.style.opacity = "1"}
        >
          Start listening
        </button>
        <button onClick={onEnter} style={{
          padding: "14px 36px", borderRadius: 999,
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--muted)", fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, cursor: "pointer", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; }}
          onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--muted)"; }}
        >
          View history
        </button>
      </div>

      {/* UX Hint: Floating scroll indicator with performance-efficient animation */}
      <div style={{
        position: "absolute", bottom: 40,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "float 3s ease infinite",
      }}>
        <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em" }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(var(--accent), transparent)" }} />
      </div>
    </div>
  );
}