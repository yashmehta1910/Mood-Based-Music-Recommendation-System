const MOOD_WORDS = {
  happy: ["happy", "joy", "great", "amazing", "excited", "celebrate", "good", "wonderful"],
  sad: ["sad", "down", "cry", "alone", "miss", "heartbreak", "depressed", "lonely"],
  energetic: ["pump", "hype", "run", "gym", "workout", "energy", "fire", "beast", "motivated"],
  calm: ["calm", "chill", "relax", "peace", "quiet", "breathe", "slow", "rest", "zen"],
  romantic: ["love", "crush", "heart", "date", "romantic", "miss", "together", "forever"],
  focused: ["focus", "study", "work", "deadline", "concentrate", "code", "think", "deep"],
  angry: ["angry", "mad", "rage", "hate", "frustrat", "annoyed", "furious", "done"],
  nostalgic: ["nostalgic", "remember", "memory", "throwback", "childhood", "old", "used to"],
};

const MOOD_COLOR = {
  happy: "#e8c97a", sad: "#7ab3e8", energetic: "#e87a7a",
  calm: "#7ae8c9", romantic: "#e87ab3", focused: "#7a9ee8",
  angry: "#e8947a", nostalgic: "#b3a87a",
};

/**
 * MoodMeter Component:
 * Real-time client-side keyword analysis engine. Inspects current raw string metrics 
 * synchronously against vocabulary maps to render visual tags instantly 
 * before calling external asynchronous LLM backend wrappers.
 */
export default function MoodMeter({ text }) {
  const low = text.toLowerCase();
  const scores = {};
  let total = 0;

  // Evaluate vocabulary mapping matrices to formulate sentiment matches
  Object.entries(MOOD_WORDS).forEach(([mood, words]) => {
    const score = words.filter((w) => low.includes(w)).length;
    scores[mood] = score;
    total += score;
  });

  // Dynamic ranking filter: Sort active metadata keys based on highest frequency match
  const detected = total > 0
    ? Object.entries(scores).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0)
    : [];

  // Short-circuit render loop if search metrics are empty
  if (!text.trim() || detected.length === 0) return null;

  return (
    <div style={{
      marginTop: 10,
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid var(--border)",
      background: "var(--surface)",
      animation: "fadeIn 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    }}>
      <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>DETECTED</span>
      {detected.map(([mood]) => (
        <span 
          key={mood} 
          style={{
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 999,
            background: `${MOOD_COLOR[mood]}18`, // Hex modification for customized opacity handling
            color: MOOD_COLOR[mood],
            border: `1px solid ${MOOD_COLOR[mood]}40`,
            textTransform: "capitalize",
            animation: "fadeIn 0.3s ease",
          }}
        >
          {mood}
        </span>
      ))}
    </div>
  );
}