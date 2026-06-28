// Curated Unsplash photo IDs for Serenity Guest House
// Format: https://images.unsplash.com/photo-{ID}?w={width}&q=80&fit=crop

export const IMAGES = {
  // Hero — dramatic luxury interior
  hero: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1800&q=85&fit=crop',

  // Rooms — each room gets a main + secondary image
  rooms: {
    'room-1': {
      main: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&fit=crop',
      alt: 'The Garden Suite — king bed with garden view',
    },
    'room-2': {
      main: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80&fit=crop',
      alt: 'The Ivory Room — warm luxury bedroom',
    },
    'room-3': {
      main: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&fit=crop',
      alt: 'The Amber Studio — compact luxury studio',
    },
    'room-4': {
      main: 'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=900&q=80&fit=crop',
      alt: 'The Cedarwood Loft — two-level luxury suite',
    },
  },

  // Gallery / feature images
  garden:    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80&fit=crop',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=900&q=80&fit=crop',
  exterior:  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80&fit=crop',
  bathroom:  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80&fit=crop',
  pool:      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80&fit=crop',
  lounge:    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&fit=crop',
};

export const getRoomImage = (roomId) =>
  IMAGES.rooms[roomId]?.main || IMAGES.rooms['room-1'].main;

export const getRoomAlt = (roomId) =>
  IMAGES.rooms[roomId]?.alt || 'Serenity Guest House room';
