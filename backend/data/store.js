const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ─── Rooms ─────────────────────────────────────────────────────────────────
const rooms = [
  {
    id: 'room-1',
    name: 'The Garden Suite',
    type: 'suite',
    description: 'A serene retreat overlooking the private garden. King-sized bed, rainfall shower, and a private patio where morning coffee becomes a ceremony.',
    price: 1850,
    capacity: 2,
    size: 42,
    amenities: ['King bed', 'Private patio', 'Rainfall shower', 'Mini bar', 'Smart TV', 'Air conditioning', 'Free Wi-Fi', 'Safe'],
    images: ['garden-suite.jpg'],
    available: true,
  },
  {
    id: 'room-2',
    name: 'The Ivory Room',
    type: 'deluxe',
    description: 'Soft linen, warm timber, and a copper soaking tub that earns its own itinerary. Perfect for a solo escape or a couple seeking stillness.',
    price: 1450,
    capacity: 2,
    size: 35,
    amenities: ['Queen bed', 'Copper soaking tub', 'Walk-in shower', 'Smart TV', 'Air conditioning', 'Free Wi-Fi', 'Safe', 'Nespresso machine'],
    images: ['ivory-room.jpg'],
    available: true,
  },
  {
    id: 'room-3',
    name: 'The Amber Studio',
    type: 'standard',
    description: 'Compact, considered, and complete. Everything you need, nothing you don\'t. A beautifully appointed studio for the purposeful traveller.',
    price: 950,
    capacity: 1,
    size: 22,
    amenities: ['Queen bed', 'En-suite shower', 'Smart TV', 'Air conditioning', 'Free Wi-Fi', 'Writing desk'],
    images: ['amber-studio.jpg'],
    available: true,
  },
  {
    id: 'room-4',
    name: 'The Cedarwood Loft',
    type: 'suite',
    description: 'Two levels of warmth and texture. Raw cedarwood beams, a mezzanine lounge, and a deep freestanding bath beneath a skylight.',
    price: 2400,
    capacity: 3,
    size: 58,
    amenities: ['King bed + daybed', 'Mezzanine lounge', 'Freestanding bath', 'Rain shower', 'Mini bar', 'Smart TV', 'Air conditioning', 'Free Wi-Fi', 'Safe', 'Nespresso machine'],
    images: ['cedarwood-loft.jpg'],
    available: true,
  },
];

// ─── Bookings ──────────────────────────────────────────────────────────────
const bookings = [];

// ─── Admin Users ──────────────────────────────────────────────────────────
const adminUsers = [
  {
    id: 'admin-1',
    username: 'admin',
    // Default password: Serenity@Admin2024 — change this in production via env
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Serenity@Admin2024', 12),
    role: 'admin',
  },
];

// ─── Contact Messages ──────────────────────────────────────────────────────
const messages = [];

module.exports = {
  rooms,
  bookings,
  adminUsers,
  messages,
  uuidv4,
};
