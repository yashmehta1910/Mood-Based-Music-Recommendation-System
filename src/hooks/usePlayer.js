import { useState } from "react";

/**
 * Custom React Hook managing the global media playback state engine.
 * Decouples tracks, playback status, and triggers to provide unified
 * control across distinct UI layout components.
 */
export function usePlayer() {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);

  /**
   * Toggles the playback status of a target media track object.
   * Handles track transitions cleanly by evaluating streaming identifiers.
   * 
   * @param {Object} track - The track instance context containing metadata and URLs.
   */
  function play(track) {
    // If selecting the currently active track, perform a simple play/pause toggle
    if (current?.url === track.url) {
      setPlaying((p) => !p);
    } else {
      // Initialize configuration parameters for a brand new track context selection
      setCurrent(track);
      setPlaying(true);
    }
  }

  /**
   * Resets the active streaming player context and stops layout visualizers.
   */
  function stop() {
    setPlaying(false);
    setCurrent(null);
  }

  return { current, playing, play, stop };
}