const express = require('express');
const Playlist = require('../models/Playlist');
const auth = require('../middleware/auth');

const router = express.Router();

// All playlist routes require login
router.use(auth);

// GET /api/playlists  -> the logged-in user's history, newest first
router.get('/', async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ playlists });
  } catch (err) {
    next(err);
  }
});

// POST /api/playlists  -> save a generated playlist
router.post('/', async (req, res, next) => {
  try {
    const { text, mood, summary, color, tracks } = req.body;

    if (!mood || !Array.isArray(tracks)) {
      return res.status(400).json({ message: 'mood and tracks are required' });
    }

    const playlist = await Playlist.create({
      user: req.userId,
      text,
      mood,
      summary,
      color,
      tracks,
    });

    res.status(201).json({ playlist });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/playlists/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Playlist.deleteOne({ _id: req.params.id, user: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
