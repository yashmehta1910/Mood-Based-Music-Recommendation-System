import { useState } from "react";
import { analyzeMood } from "../api/grok";
import { getTracksByTag } from "../api/lastfm";
import { extractColor } from "../utils/colorExtract";

/**
 * Local Storage Utility: Synchronously reads historical context caches 
 * from the browser client session to preserve user activity.
 * 
 * @returns {Array} List of historical playlist entry objects.
 */
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem("mood-history") || "[]");
  } catch {
    return []; // Resilient fallback for parsing issues or sandboxed contexts
  }
}

/**
 * Local Storage Utility: Commits new records to history while capping the
 * maximum cached footprint to optimize browser storage overhead.
 * 
 * @param {Object} entry - Generated metadata snapshot object to preserve.
 */
function saveHistory(entry) {
  const prev = loadHistory();
  // Enforce a strict max queue depth boundary of 20 elements
  const updated = [entry, ...prev].slice(0, 20);
  localStorage.setItem("mood-history", JSON.stringify(updated));
}

/**
 * Custom React Hook orchestrating the complete full-stack JavaScript integration pipeline.
 * Aggregates text metrics, AI prompt completion engines, third-party media endpoints,
 * canvas image data analysis, dynamic DOM theme generation, and persistence states.
 */
export function usePlaylist() {
  const [status, setStatus] = useState("idle"); // UI Pipeline Stages: idle | loading | done | error
  const [analysis, setAnalysis] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState({ r: 201, g: 168, b: 76 });
  const [history, setHistory] = useState(loadHistory);

  /**
   * Coordinates the asynchronous pipeline to convert natural text inputs
   * into a fully stylized UI theme and verified music playlist.
   * 
   * @param {string} text - The input sentiment description string.
   */
  async function generate(text) {
    if (!text.trim()) return;

    // Reset processing boundary pipelines to avoid cross-contamination of view hooks
    setStatus("loading");
    setAnalysis(null);
    setTracks([]);
    setError(null);

    try {
      // Phase 1: Call Grok AI REST endpoints to resolve natural language text to structured tags
      const moodData = await analyzeMood(text);
      setAnalysis(moodData);

      // Phase 2: Pipe the resulting structured mood indices to the Last.fm music catalog API
      const songList = await getTracksByTag(moodData.tags[0]);
      setTracks(songList);

      // Phase 3: Extract dominant color metrics asynchronously from available artwork strings
      const firstImage = songList.find((t) => t.image)?.image;
      const color = await extractColor(firstImage);
      setTheme(color);

      // Phase 4: Dynamic UI branding update via programmatic CSS Custom Variable injection
      document.documentElement.style.setProperty("--theme-r", color.r);
      document.documentElement.style.setProperty("--theme-g", color.g);
      document.documentElement.style.setProperty("--theme-b", color.b);
      document.documentElement.style.setProperty("--accent", `rgb(${color.r},${color.g},${color.b})`);

      // Phase 5: Build compilation transaction entry and serialize data to persistent cache storage
      const entry = {
        id: Date.now(),
        text,
        mood: moodData.mood,
        summary: moodData.summary,
        tracks: songList,
        color,
        createdAt: new Date().toISOString(),
      };
      saveHistory(entry);
      setHistory(loadHistory());
      
      setStatus("done");
    } catch (e) {
      console.error("Pipeline Exception Catch Block:", e);
      setError("Something went wrong. Check your API keys in .env");
      setStatus("error");
    }
  }

  /**
   * Re-hydrates global frontend layout nodes instantly using a historically cached snapshot.
   * Eliminates unnecessary API token burn and network overhead.
   * 
   * @param {Object} entry - The historical database configuration object.
   */
  function loadFromHistory(entry) {
    setAnalysis({
      mood: entry.mood,
      summary: entry.summary,
      energy: 70,
      valence: 70,
      tags: [],
    });
    setTracks(entry.tracks);
    setTheme(entry.color);
    
    document.documentElement.style.setProperty(
      "--accent", 
      `rgb(${entry.color.r},${entry.color.g},${entry.color.b})`
    );
    setStatus("done");
  }

  return { status, analysis, tracks, error, theme, history, generate, loadFromHistory };
}