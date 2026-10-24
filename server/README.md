# Mood Playlist Server

Express + MongoDB (Mongoose) backend: signup, login (JWT) and saved playlists.

## Setup
1. `cd server && npm install`
2. Copy `.env.example` to `.env` and fill in `MONGO_URI` (MongoDB Atlas) and `JWT_SECRET`.
3. `npm run dev` (or `npm start`) -> http://localhost:5000

## API
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/signup | no | `{ name, email, password }` -> `{ token, user }` |
| POST | /api/auth/login | no | `{ email, password }` -> `{ token, user }` |
| GET | /api/auth/me | yes | current user |
| GET | /api/playlists | yes | your saved playlists |
| POST | /api/playlists | yes | `{ mood, vibeAnalysis, tracks }` |
| DELETE | /api/playlists/:id | yes | delete one |

Send the token as `Authorization: Bearer <token>`.
