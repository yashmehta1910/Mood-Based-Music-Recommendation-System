import { useState } from "react";
import MoodMeter from "./MoodMeter";

const QUICK_MOODS = ["happy", "sad", "energetic", "calm", "romantic", "focused", "angry", "nostalgic"];

/**
 * MoodInput Component:
 * Core user input interface layer. Manages real-time string captures, 
 * macro sentiment selectors, and handles cross-browser compatibility layers 
 * for the native asynchronous Web Speech API.
 */
export default function MoodInput({ onGenerate, loading }) {
  const [text, setText] = useState("");
  const [active, setActive] = useState(null);
  const [listening, setListening] = useState(false);

  /**
   * Dispatches validation checks on current text state and bubbles parameters up.
   */
  function handleSubmit() { 
    if (text.trim()) onGenerate(text); 
  }

  /**
   * Macro Handler: Triggers immediate pipeline resolution for a quick mood tag.
   */
  function handleQuick(mood) {
    setText(mood); 
    setActive(mood); 
    onGenerate(mood);
  }

  /**
   * Keyboard Proxy Interceptor: Triggers submissions via single Enter keystrokes,
   * bypassing inputs when multiline line-breaks are specified via Shift modifiers.
   */
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      handleSubmit(); 
    }
  }

  /**
   * Local Pipeline: Direct interface targeting standard browser SpeechRecognition engines
   * to capture real-time audio transcript profiles asynchronously.
   */
  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported in this browser");

    const rec = new SR();
    rec.lang = "en-US";
    setListening(true);

    rec.onresult = (e) => { 
      setText(e.results[0][0].transcript); 
      setListening(false); 
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    
    rec.start();
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        border: "1px solid var(--border)",
        borderRadius: 16,
        background: "var(--surface)",
        padding: "4px 4px 4px 20px",
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
      }}>
        <textarea
          rows={2}
          value={text}
          onChange={(e) => { setText(e.target.value); setActive(null); }}
          onKeyDown={handleKey}
          placeholder="I just finished exams and want to celebrate..."
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "var(--text)", fontFamily: "'DM Sans', sans-serif",
            fontSize: 15, fontWeight: 300, resize: "none",
            padding: "14px 0", lineHeight: 1.6,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 4 }}>
          {/* Audio Capturing Node Control Toggle */}
          <button 
            onClick={startVoice} 
            disabled={listening} 
            title="Voice input" 
            style={{
              background: listening ? "rgba(var(--theme-r),var(--theme-g),var(--theme-b),0.15)" : "transparent",
              border: "1px solid var(--border)", borderRadius: 10,
              width: 36, height: 36, cursor: "pointer", color: listening ? "var(--accent)" : "var(--muted)",
              fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {listening ? <Waveform /> : "🎙"}
          </button>
          
          {/* Submit Action Proxy Hook */}
          <button 
            onClick={handleSubmit} 
            disabled={loading || !text.trim()} 
            style={{
              background: loading || !text.trim() ? "var(--border)" : "var(--accent)",
              color: loading || !text.trim() ? "var(--muted)" : "#080810",
              border: "none", borderRadius: 10,
              padding: "8px 16px", fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 500, cursor: loading || !text.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}
          >
            {loading ? "..." : "→"}
          </button>
        </div>
      </div>

      {/* Synchronous Local Analysis Feedback Matrix */}
      <MoodMeter text={text} />

      {/* Listening Waveform Indicator Viewport */}
      {listening && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <AnimatedWaveform />
          <span style={{ fontSize: 13, color: "var(--accent)" }}>Listening...</span>
        </div>
      )}

      {/* Quick Access Token Container Layout */}
      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {QUICK_MOODS.map((mood) => (
          <button 
            key={mood} 
            onClick={() => handleQuick(mood)} 
            disabled={loading} 
            style={{
              padding: "7px 18px", borderRadius: 999, fontSize: 12,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              cursor: loading ? "not-allowed" : "pointer",
              border: active === mood ? "1px solid var(--accent)" : "1px solid var(--border)",
              background: active === mood ? "rgba(var(--theme-r),var(--theme-g),var(--theme-b),0.1)" : "transparent",
              color: active === mood ? "var(--accent)" : "var(--muted)",
              transition: "all 0.2s",
            }}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Micro-waveform component indicating local listener status. */
function Waveform() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          width: 2, height: 10, borderRadius: 1,
          background: "var(--accent)",
          animation: `pulse 0.6s ease ${i * 0.1}s infinite`,
        }} />
      ))}
    </div>
  );
}

/** Audio-reactive visual feedback simulator driven by randomized keyframe configurations. */
function AnimatedWaveform() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: "var(--accent)",
          height: `${Math.random() * 20 + 8}px`,
          animation: `pulse ${0.4 + Math.random() * 0.4}s ease ${i * 0.05}s infinite`,
        }} />
      ))}
    </div>
  );
}