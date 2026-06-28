import React, { useEffect, useState } from 'react';
import { getRooms } from '../hooks/useApi';
import RoomCard from '../components/RoomCard';
import './RoomsPage.css';

export default function RoomsPage({ navigate }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getRooms()
      .then(d => setRooms(d.rooms))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? rooms : rooms.filter(r => r.type === filter);

  return (
    <div className="rooms-page">
      <div className="page-hero rooms-hero">
        <div className="container">
          <p className="eyebrow">Our Accommodation</p>
          <h1 className="display-xl">Rooms & Suites</h1>
          <p>Four rooms. Each one a different conversation with luxury.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="rooms-filter">
            {[['all','All Rooms'],['suite','Suites'],['deluxe','Deluxe'],['standard','Studios']].map(([k,l]) => (
              <button
                key={k}
                className={`filter-btn ${filter === k ? 'active' : ''}`}
                onClick={() => setFilter(k)}
              >
                {l}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rooms-loading">
              <div className="loading-spinner" />
              <p>Loading rooms…</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {filtered.map(room => (
                <RoomCard key={room.id} room={room} navigate={navigate} />
              ))}
              {filtered.length === 0 && (
                <p className="no-rooms">No rooms found for this filter.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="rooms-policies section-sm">
        <div className="container">
          <div className="policies-grid">
            {[
              { title: 'Check-in', body: '14:00 – 20:00 daily. Late arrivals possible by arrangement — simply let us know in advance.' },
              { title: 'Check-out', body: 'By 11:00. Luggage storage available. Late check-out until 13:00 on request, subject to availability.' },
              { title: 'Breakfast', body: 'Included with all rooms. Served 07:30 – 09:30 in the garden or your room by prior arrangement.' },
              { title: 'Cancellation', body: 'Full refund for cancellations 72 hours before arrival. 50% within 72 hours. No refund for no-shows.' },
            ].map(p => (
              <div key={p.title} className="policy-item">
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
