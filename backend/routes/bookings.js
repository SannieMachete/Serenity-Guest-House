const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { bookings, rooms, uuidv4 } = require('../data/store');
const { sanitizeInputs } = require('../middleware/sanitize');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Validation rules
const bookingValidation = [
  body('roomId').isString().trim().notEmpty().withMessage('Room is required.'),
  body('guestName')
    .isString().trim()
    .isLength({ min: 2, max: 80 })
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name must be 2–80 letters only.'),
  body('guestEmail')
    .isEmail().normalizeEmail()
    .withMessage('A valid email is required.'),
  body('guestPhone')
    .matches(/^[0-9+\s()-]{7,20}$/)
    .withMessage('A valid phone number is required.'),
  body('checkIn')
    .isISO8601().toDate()
    .withMessage('Valid check-in date required.'),
  body('checkOut')
    .isISO8601().toDate()
    .withMessage('Valid check-out date required.'),
  body('guests')
    .isInt({ min: 1, max: 6 })
    .withMessage('Guests must be between 1 and 6.'),
  body('specialRequests')
    .optional()
    .isString().trim()
    .isLength({ max: 500 })
    .withMessage('Special requests must not exceed 500 characters.'),
];

// Check room availability
const isRoomAvailable = (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const incoming = { start: new Date(checkIn), end: new Date(checkOut) };
  return !bookings.some(b => {
    if (b.roomId !== roomId) return false;
    if (b.status === 'cancelled') return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    const existing = { start: new Date(b.checkIn), end: new Date(b.checkOut) };
    return incoming.start < existing.end && incoming.end > existing.start;
  });
};

// POST /api/bookings - create booking
router.post('/', sanitizeInputs, bookingValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => e.msg) });
  }

  const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut, guests, specialRequests } = req.body;

  // Validate dates
  const now = new Date();
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate < now.setHours(0, 0, 0, 0)) {
    return res.status(422).json({ errors: ['Check-in date cannot be in the past.'] });
  }
  if (checkOutDate <= checkInDate) {
    return res.status(422).json({ errors: ['Check-out must be after check-in.'] });
  }
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  if (nights > 30) {
    return res.status(422).json({ errors: ['Bookings cannot exceed 30 nights.'] });
  }

  // Validate room
  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ errors: ['Room not found.'] });
  if (guests > room.capacity) {
    return res.status(422).json({ errors: [`This room fits a maximum of ${room.capacity} guests.`] });
  }

  // Check availability
  if (!isRoomAvailable(roomId, checkIn, checkOut)) {
    return res.status(409).json({ errors: ['This room is not available for the selected dates.'] });
  }

  const booking = {
    id: uuidv4(),
    roomId,
    roomName: room.name,
    guestName,
    guestEmail,
    guestPhone,
    checkIn: checkInDate.toISOString(),
    checkOut: checkOutDate.toISOString(),
    guests: parseInt(guests),
    nights,
    totalAmount: room.price * nights,
    specialRequests: specialRequests || '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    confirmationCode: `SGH-${Date.now().toString(36).toUpperCase()}`,
  };

  bookings.push(booking);

  // Return confirmation (strip sensitive internal data)
  res.status(201).json({
    message: 'Booking confirmed.',
    booking: {
      id: booking.id,
      confirmationCode: booking.confirmationCode,
      roomName: booking.roomName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      guests: booking.guests,
      totalAmount: booking.totalAmount,
      status: booking.status,
    },
  });
});

// GET /api/bookings/lookup?email=&code= - guest lookup
router.get('/lookup', (req, res) => {
  const { email, code } = req.query;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and confirmation code are required.' });
  }

  const booking = bookings.find(
    b => b.guestEmail === email.toLowerCase().trim() &&
         b.confirmationCode === code.trim().toUpperCase()
  );

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found. Please check your details.' });
  }

  res.json({
    booking: {
      id: booking.id,
      confirmationCode: booking.confirmationCode,
      roomName: booking.roomName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      guests: booking.guests,
      totalAmount: booking.totalAmount,
      status: booking.status,
      specialRequests: booking.specialRequests,
    },
  });
});

// Admin: GET /api/bookings - all bookings
router.get('/', authenticate, requireAdmin, (req, res) => {
  res.json({ bookings });
});

// Admin: PATCH /api/bookings/:id/status
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(422).json({ error: 'Invalid status.' });
  }
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  booking.status = status;
  res.json({ booking });
});

module.exports = router;
