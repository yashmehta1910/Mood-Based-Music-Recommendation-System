/**
 * Playlist Component:
 * Maps and renders lists of matched tracks. Incorporates structural 
 * hover adjustments, custom active-state highlighting, item stagger delays,
 * and handles click event scoping cleanly.
 */
export default function Playlist({ tracks, onPlay, currentTrack, playing }) {
  if (!tracks.length) return null;

  return (
    <div style={{ animation: "fadeUp 0.5s ease 0.1s both", paddingBottom: 100 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
        Your playlist — {tracks.length} tracks
      </p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tracks.map((track, i) => {
          const isActive = currentTrack?.url === track.url;
          
          return (
            <div
              key={i}
              onClick={() => onPlay(track)}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "12px 16px", borderRadius: 10,
                background: isActive ? "var(--surface2)" : "var(--surface)",
                border: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                cursor: "pointer", transition: "all 0.2s",
                animation: `slideIn 0.4s ease ${i * 0.06}s both`, // Staggered inline entry transition animations
              }}
              onMouseEnter={e => { 
                if (!isActive) { 
                  e.currentTarget.style.border = "1px solid var(--border)"; 
                  e.currentTarget.style.background = "var(--surface2)"; 
                } 
              }}
              onMouseLeave={e => { 
                if (!isActive) { 
                  e.currentTarget.style.border = "1px solid transparent"; 
                  e.currentTarget.style.background = "var(--surface)"; 
                } 
              }}
            >
              {/* Dynamic status track identifier row */}
              <span style={{ fontSize: 11, color: "var(--muted)", width: 20, textAlign: "center" }}>
                {isActive && playing ? <PlayingBars /> : i + 1}
              </span>

              {/* Album Art Render Node */}
              {track.image
                ? <img src={track.image} width={42} height={42} style={{ borderRadius: 8, objectFit: "cover" }} alt="" />
                : <div style={{ width: 42, height: 42, borderRadius: 8, background: "var(--border)", flexShrink: 0 }} />
              }

              {/* Structural text lines mapping descriptions */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: isActive ? 500 : 400, color: isActive ? "var(--accent)" : "var(--text)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.title}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0" }}>{track.artist}</p>
              </div>

              {/* Anchor Node: stopPropagation blocks card clicks from firing playback toggles */}
              <a 
                href={track.url} 
                target="_blank" 
                rel="noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                style={{ fontSize: 11, color: "var(--muted)", textDecoration: "none" }}
              >
                ↗
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Micro playback status waveform injected into rows containing active tracks. */
function PlayingBars() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          width: 3, borderRadius: 1, background: "var(--accent)",
          animation: `pulse 0.6s ease ${i * 0.15}s infinite`,
          height: "100%",
        }} />
      ))}
    </div>
  );
}