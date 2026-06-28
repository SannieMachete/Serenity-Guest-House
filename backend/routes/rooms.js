const express = require('express');
const router = express.Router();
const { rooms } = require('../data/store');

// GET /api/rooms - list all rooms
router.get('/', (req, res) => {
  const { checkIn, checkOut } = req.query;
  // In production, filter by actual availability against bookings
  res.json({ rooms });
});

// GET /api/rooms/:id - get single room
router.get('/:id', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found.' });
  res.json({ room });
});

module.exports = router;
