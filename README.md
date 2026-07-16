# MoodSync — AI Sentiment Playlist Generator

An immersive, full-stack JavaScript single-page application that captures real-time voice and text sentiment patterns to dynamically compile context-aware music streaming playlists.

## 🛠️ Tech Stack
- **Frontend:** React.js, JavaScript (ES6+), HTML5 Canvas API
- **APIs:** Grok API (NLP Sentiment Analysis), Last.fm API (Music Metadata)
- **Voice Logic:** Web Speech API (SpeechRecognition)

## ✨ Key Features
- **Voice/Text Processing:** Real-time speech-to-text input paired with audio-reactive visual waveforms.
- **Dynamic Theme Engine:** Canvas-based utility that extracts dominant RGB metrics from album art to dynamically alter the application's global CSS parameters.
- **State Architecture:** Decoupled layout pipelines using custom lifecycle hooks (`usePlaylist`, `usePlayer`) managing reactive background particle systems.

## ⚙️ Local Setup
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and add your Grok and Last.fm API keys.
4. Run locally: `npm run dev`