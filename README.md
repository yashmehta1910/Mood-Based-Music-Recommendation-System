# Mood-Based Music Playlist Generator

A full-stack web app that turns how you feel into a playlist. Describe your mood in text (or by voice), and the app analyses it with an AI model, finds matching tracks from Last.fm, and themes the interface using colours taken from the album art. Users can sign up, log in, and keep their playlist history saved to their account.

## Features

- **Mood input** by typing or by voice (speech-to-text), with quick mood chips such as happy, sad, energetic, calm, romantic, focused, angry and nostalgic
- **AI vibe analysis**: the mood text is converted to a mood label, energy and valence scores, music tags and a one-line summary
- **Playlist generation** from Last.fm tracks matching the detected mood
- **Dynamic theming**: the accent colour and animated particle background adapt to colours extracted from the album artwork
- **Player bar** for the selected track, with a link to open it on Last.fm
- **User accounts**: sign up and log in with email and password (passwords hashed, sessions via JWT)
- **Playlist history**: saved to MongoDB for logged-in users and to the browser (`localStorage`) for guests; past playlists can be reopened with one click

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Mood analysis | Groq API (OpenAI-compatible chat completions) |
| Music data | Last.fm API |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | bcryptjs (password hashing), JSON Web Tokens |
| Voice input | Web Speech API (browser built-in) |

## Project Structure

```
mood-playlist/
├── src/                      # React frontend
│   ├── api/
│   │   ├── grok.js           # Groq mood analysis
│   │   ├── lastfm.js         # Last.fm track lookup
│   │   └── auth.js           # Calls to the Express backend
│   ├── components/           # MoodInput, MoodMeter, Playlist, PlayerBar,
│   │                         # VibeAnalysis, ParticleBackground
│   ├── hooks/
│   │   ├── usePlaylist.js    # Generation pipeline + history (DB or local)
│   │   ├── usePlayer.js      # Player state
│   │   └── useAuth.jsx       # Auth context (login, signup, logout)
│   ├── pages/                # LandingPage, HistoryPage, LoginPage
│   ├── utils/colorExtract.js # Dominant colour from album art
│   ├── App.jsx
│   └── main.jsx
├── server/                   # Express + MongoDB backend
│   ├── index.js              # Server entry, DB connection
│   ├── models/               # User.js, Playlist.js
│   ├── routes/               # auth.js, playlists.js
│   ├── middleware/auth.js    # JWT verification
│   └── .env.example
├── .env.example              # Frontend environment variables
└── package.json
```

## Prerequisites

- Node.js 18 or newer
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Groq](https://console.groq.com) API key
- A [Last.fm](https://www.last.fm/api) API key
- Google Chrome or Microsoft Edge (for voice input)

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd mood-playlist
npm install
cd server
npm install
cd ..
```

### 2. Configure the frontend

Copy `.env.example` to `.env` in the project root and fill it in:

```
VITE_GROK_KEY=your_groq_api_key_here
VITE_LASTFM_KEY=your_lastfm_api_key_here
```

### 3. Configure the backend

Copy `server/.env.example` to `server/.env` and fill it in:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/moodplaylist?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173
```

- `MONGO_URI`: in Atlas go to **Connect → Drivers** and copy the connection string. Replace `<password>` with your database user's password and add `/moodplaylist` before the `?`. Under **Network Access**, allow your IP address (or `0.0.0.0/0` for development).
- `JWT_SECRET`: generate one with
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

> Never commit `.env` files. They are listed in `.gitignore`.

### 4. Run the app

Use two terminals.

**Terminal 1: backend**

```bash
cd server
npm run dev
```

You should see `MongoDB connected` and `Server running on http://localhost:5000`.

**Terminal 2: frontend**

```bash
npm run dev
```

Open http://localhost:5173.

## API Reference

All routes are prefixed with `/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Server health check |
| POST | `/auth/signup` | No | Body `{ name, email, password }`, returns `{ token, user }` |
| POST | `/auth/login` | No | Body `{ email, password }`, returns `{ token, user }` |
| GET | `/auth/me` | Yes | Returns the logged-in user |
| GET | `/playlists` | Yes | The user's saved playlists, newest first |
| POST | `/playlists` | Yes | Save a playlist `{ text, mood, summary, color, tracks }` |
| DELETE | `/playlists/:id` | Yes | Delete one of the user's playlists |

## How It Works

1. The user describes their mood, by typing or speaking.
2. The text is sent to the Groq API, which returns a mood label, energy and valence scores, tags and a summary.
3. The first tag is used to fetch matching tracks from Last.fm.
4. A dominant colour is extracted from the album artwork and applied to the theme.
5. The result is saved to the user's history: to MongoDB if logged in, or to `localStorage` if browsing as a guest.

## Notes and Limitations

- **Voice input** uses the browser's Web Speech API. It works in Chrome and Edge, but not in Brave (no speech service) or Firefox (unsupported).
- **Last.fm does not provide audio.** Tracks link out to Last.fm rather than streaming inside the app.
- **API keys in the frontend:** the Groq and Last.fm keys are read by the browser build (`VITE_` variables), so they are visible to anyone using the app. Fine for local development and demos; for a public deployment, move those calls to the Express server.
- **Model availability:** Groq retires models over time. If mood analysis fails with a 404, check the model name in `src/api/grok.js` against Groq's current model list.

## Scripts

| Location | Command | Purpose |
|---|---|---|
| root | `npm run dev` | Start the Vite dev server |
| root | `npm run build` | Production build of the frontend |
| `server/` | `npm run dev` | Start the API with auto-restart |
| `server/` | `npm start` | Start the API |