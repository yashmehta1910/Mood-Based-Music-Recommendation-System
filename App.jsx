import { useState } from "react";
import MoodInput from "./components/MoodInput";
import VibeAnalysis from "./components/VibeAnalysis";
import Playlist from "./components/Playlist";
import PlayerBar from "./components/PlayerBar";
import ParticleBackground from "./components/ParticleBackground";
import LandingPage from "./pages/LandingPage";
import HistoryPage from "./pages/HistoryPage";
import { usePlaylist } from "./hooks/usePlaylist";
import { usePlayer } from "./hooks/usePlayer";

export default function App() {
  const [page, setPage] = useState("landing");
  const { status, analysis, tracks, error, theme, history, generate, loadFromHistory } = usePlaylist();
  const { current, playing, play, stop } = usePlayer();

  function handleLoadHistory(entry) {
    loadFromHistory(entry);
    setPage("app");
  }

  return (
    <>
      <ParticleBackground theme={theme} />

      <div style={{
        position: "relative", zIndex: 1,
        opacity: 1,
        transition: "opacity 0.3s ease",
      }}>
        {page === "landing" && (
          <LandingPage onEnter={() => setPage("app")} />
        )}

        {page === "history" && (
          <HistoryPage history={history} onLoad={handleLoadHistory} onBack={() => setPage("app")} />
        )}

        {page === "app" && (
          <div style={{ maxWidth: 620, margin: "0 auto", padding: "60px 1rem 120px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
              <button onClick={() => setPage("landing")} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>← Home</button>
              <button onClick={() => setPage("history")} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", padding: "6px 16px", borderRadius: 999 }}>
                History ({history.length})
              </button>
            </div>

            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>Mood playlist</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 400, lineHeight: 1.15, color: "var(--text)", marginBottom: 12 }}>
                What's on<br /><em>your mind?</em>
              </h1>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>Describe how you're feeling and get a playlist for your vibe.</p>
            </div>

            <MoodInput onGenerate={generate} loading={status === "loading"} />

            {status === "loading" && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)", fontSize: 13 }}>
                <div style={{ fontSize: 24, animation: "spin 1.5s linear infinite", display: "inline-block", marginBottom: 10 }}>◌</div>
                <p>reading your vibe...</p>
              </div>
            )}

            {error && (
              <p style={{ color: "#e27070", fontSize: 13, padding: "12px 16px", borderRadius: 8, background: "rgba(226,112,112,0.08)", border: "1px solid rgba(226,112,112,0.2)", marginBottom: 24 }}>
                {error}
              </p>
            )}

            <VibeAnalysis analysis={analysis} theme={theme} />
            <Playlist tracks={tracks} onPlay={play} currentTrack={current} playing={playing} />
          </div>
        )}
      </div>

      <PlayerBar track={current} playing={playing} onToggle={() => play(current)} onStop={stop} theme={theme} />
    </>
  );
}