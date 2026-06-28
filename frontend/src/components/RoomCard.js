import React, { useState } from 'react';
import { getRoomImage, getRoomAlt } from '../hooks/useImages';
import './RoomCard.css';

export default function RoomCard({ room, navigate, compact = false }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const typeLabel = { suite: 'Suite', deluxe: 'Deluxe Room', standard: 'Studio' };

  const icons = {
    'King bed': '🛏', 'Queen bed': '🛏', 'King bed + daybed': '🛏',
    'Private patio': '🌿', 'Rainfall shower': '🚿', 'Mini bar': '🍷',
    'Smart TV': '📺', 'Air conditioning': '❄️', 'Free Wi-Fi': '📶',
    'Safe': '🔒', 'Nespresso machine': '☕', 'Walk-in shower': '🚿',
    'Copper soaking tub': '🛁', 'Freestanding bath': '🛁', 'Rain shower': '🚿',
    'En-suite shower': '🚿', 'Writing desk': '✍️', 'Mezzanine lounge': '🪑',
  };

  const imgSrc = getRoomImage(room.id);
  const imgAlt = getRoomAlt(room.id);

  return (
    <article className={`room-card ${compact ? 'compact' : ''}`}>
      <div className="room-card-image">
        {!imgError ? (
          <>
            {!imgLoaded && <div className="room-card-skeleton" />}
            <img
              src={imgSrc}
              alt={imgAlt}
              className={`room-card-photo ${imgLoaded ? 'loaded' : ''}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="room-card-placeholder">
            <span className="room-card-icon">
              {room.type === 'suite' ? '✦' : room.type === 'deluxe' ? '◈' : '◇'}
            </span>
          </div>
        )}
        <div className="room-card-type">
          <span className="eyebrow">{typeLabel[room.type]}</span>
        </div>
        <div className="room-card-price">
          <span className="price-amount">R{room.price.toLocaleString()}</span>
          <span className="price-per"> / night</span>
        </div>
      </div>

      <div className="room-card-body">
        <h3 className="display-md room-card-name">{room.name}</h3>
        <div className="room-card-meta">
          <span>{room.size}m²</span>
          <span className="meta-dot">·</span>
          <span>Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
        </div>
        {!compact && <p className="room-card-desc">{room.description}</p>}
        <div className="room-amenities">
          {room.amenities.slice(0, compact ? 4 : 6).map(a => (
            <span key={a} className="amenity-tag">
              {icons[a] && <i>{icons[a]}</i>} {a}
            </span>
          ))}
          {room.amenities.length > (compact ? 4 : 6) && (
            <span className="amenity-more">+{room.amenities.length - (compact ? 4 : 6)} more</span>
          )}
        </div>
        <div className="room-card-actions">
          <button className="btn-primary" onClick={() => navigate('booking', room)}>Reserve</button>
          {compact && (
            <button className="btn-outline" onClick={() => navigate('rooms')}>View all rooms</button>
          )}
        </div>
      </div>
    </article>
  );
}
