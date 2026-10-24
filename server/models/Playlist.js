const mongoose = require('mongoose');

// Matches the history entry your React app already builds in usePlaylist.js.
// Tracks and color are stored as-is (Mixed), so whatever fields your
// Last.fm API wrapper returns (name, artist, image, url, preview...) are kept.
const playlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, default: '' },
    mood: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    color: { type: mongoose.Schema.Types.Mixed, default: { r: 201, g: 168, b: 76 } },
    tracks: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Playlist', playlistSchema);
