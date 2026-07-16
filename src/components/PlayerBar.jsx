/**
 * PlayerBar Component:
 * Global sticky media control interface. Features blur effects via backdrop-filters, 
 * audio-reactive visual simulations, dynamic track navigation routing, and updates 
 * colors based on active custom styling structures.
 */
export default function PlayerBar({ track, playing, onToggle, onStop, theme }) {
  // Gracefully terminate render if zero tracks are selected inside state hooks
  if (!track) return null;
  
  const { r, g, b } = theme || { r: 201, g: 168, b: 76 };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: `rgba(8,8,16,0.92)`,
      borderTop: `1px solid rgba(${r},${g},${b},0.2)`,
      backdropFilter: "blur(20px)",
      padding: "12px 24px",
      display: "flex", alignItems: "center", gap: 16,
      animation: "fadeUp 0.3s ease",
    }}>
      {/* Cover Artwork Image Element */}
      {track.image
        ? <img src={track.image} width={40} height={40} style={{ borderRadius: 8 }} alt="" />
        : <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--border)", flexShrink: 0 }} />
      }

      {/* Track Meta Details Viewport */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.title}</p>
        <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0" }}>{track.artist}</p>
      </div>

      {/* Action and Visual Interactive Blocks */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Dynamic Waveform Simulation Layer triggered via current media playback states */}
        {playing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 18 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                style={{
                  width: 3, borderRadius: 1, background: `rgb(${r},${g},${b})`,
                  animation: `pulse ${0.4 + i * 0.1}s ease ${i * 0.08}s infinite`,
                  height: "100%",
                }} 
              />
            ))}
          </div>
        )}

        {/* Playback Control Actions */}
        <button 
          onClick={onToggle} 
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `rgb(${r},${g},${b})`,
            border: "none", cursor: "pointer", color: "#080810",
            fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 500,
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button 
          onClick={onStop} 
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "transparent", border: "1px solid var(--border)",
            cursor: "pointer", color: "var(--muted)", fontSize: 12,
          }}
        >
          ✕
        </button>

        {/* Dynamic External Deep-Link Routing Element */}
        <a 
          href={track.url} 
          target="_blank" 
          rel="noreferrer" 
          style={{
            fontSize: 12, color: `rgb(${r},${g},${b})`,
            textDecoration: "none", padding: "6px 14px",
            border: `1px solid rgba(${r},${g},${b},0.3)`,
            borderRadius: 999,
          }}
        >
          Open in Last.fm ↗
        </a>
      </div>
    </div>
  );
}