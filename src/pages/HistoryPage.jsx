/**
 * HistoryPage Component:
 * Renders the persistent user activity log. Features conditional rendering 
 * to handle empty states and utilizes dynamic style injection based on 
 * historical theme data (RGB profiles) for a cohesive UI experience.
 */
export default function HistoryPage({ history, onLoad, onBack }) {
  // 1. Conditional UI Branching: Handle the "Zero-State" where no history exists
  if (history.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1, position: "relative" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--text)", marginBottom: 12 }}>No history yet</p>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Generate your first playlist to see it here.</p>
        <button onClick={onBack} style={{ padding: "10px 28px", borderRadius: 999, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Go back</button>
      </div>
    );
  }

  // 2. Active List View: Map cached history objects to interactive cards
  return (
    <div style={{ minHeight: "100vh", padding: "80px 1rem", maxWidth: 620, margin: "0 auto", position: "relative", zIndex: 1 }}>
      <button onClick={onBack} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, marginBottom: 32, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>Playlist history</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, color: "var(--text)", marginBottom: 40 }}>Your past vibes</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((entry, i) => {
          // Destructure theme weights for dynamic background generation
          const { r, g, b } = entry.color || { r: 201, g: 168, b: 76 };
          
          return (
            <div 
              key={entry.id} 
              onClick={() => onLoad(entry)} 
              style={{
                padding: "20px 24px", 
                borderRadius: 16,
                // Apply dynamic theme gradients per entry
                border: `1px solid rgba(${r},${g},${b},0.2)`,
                background: `linear-gradient(135deg, rgba(${r},${g},${b},0.05), var(--surface))`,
                cursor: "pointer", 
                transition: "all 0.2s",
                animation: `slideIn 0.4s ease ${i * 0.07}s both`, // Sequential stagger animation
              }}
              onMouseEnter={e => e.currentTarget.style.border = `1px solid rgba(${r},${g},${b},0.5)`}
              onMouseLeave={e => e.currentTarget.style.border = `1px solid rgba(${r},${g},${b},0.2)`}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--text)", textTransform: "capitalize" }}>{entry.mood}</p>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, lineHeight: 1.6 }}>"{entry.text}"</p>
              
              {/* Asset Preview Row */}
              <div style={{ display: "flex", gap: 6 }}>
                {entry.tracks.slice(0, 4).map((t, j) => (
                  t.image ? <img key={j} src={t.image} width={32} height={32} style={{ borderRadius: 4 }} alt="" /> : null
                ))}
                <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center", marginLeft: 4 }}>{entry.tracks.length} tracks</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}