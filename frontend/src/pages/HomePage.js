import React, { useEffect, useState } from 'react';
import { getRooms } from '../hooks/useApi';
import RoomCard from '../components/RoomCard';
import './HomePage.css';

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80&fit=crop',
    alt: 'Serenity Guest House exterior', span: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&q=80&fit=crop',
    alt: 'Fresh breakfast served daily', span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80&fit=crop',
    alt: 'Private garden', span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&q=80&fit=crop',
    alt: 'Luxury bathroom', span: 'wide',
  },
];

export default function HomePage({ navigate }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms().then(d => setRooms(d.rooms.slice(0, 2))).catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow hero-eyebrow">Waterkloof · Pretoria</p>
          <h1 className="display-xl hero-headline">
            Still. Warm.<br />
            <em>Utterly yours.</em>
          </h1>
          <p className="hero-sub">
            A private guest house where each room is a considered world of its own.
            Handcrafted linens, unhurried mornings, and the kind of quiet you don't forget.
          </p>
          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={() => navigate('booking')}>
              Reserve Your Stay
            </button>
            <button className="btn-ghost hero-ghost" onClick={() => navigate('rooms')}>
              Explore Rooms →
            </button>
          </div>
        </div>
        <div className="hero-scroll-hint"><span /></div>
      </section>

      {/* ─── Intro Strip ─── */}
      <section className="intro-strip section-sm">
        <div className="container">
          <div className="intro-grid">
            {[
              { icon: '◈', title: '4 Curated Rooms', desc: 'Each space designed for a distinct mood — from intimate studios to lofted suites.' },
              { icon: '✦', title: 'Daily Breakfast', desc: 'A fresh, unhurried breakfast served in the garden or your room, every morning.' },
              { icon: '◇', title: 'Private & Secure', desc: 'Gated property, 24-hour monitoring, and discreet staff who understand your privacy.' },
            ].map(item => (
              <div key={item.title} className="intro-item">
                <span className="intro-icon">{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Rooms ─── */}
      {rooms.length > 0 && (
        <section className="section featured-rooms">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Our Rooms</p>
              <div className="gold-line centered" />
              <h2 className="display-lg">Spaces that hold you</h2>
              <p className="section-sub">
                Every room at Serenity has been designed not just for sleep, but for a kind of arrival.
              </p>
            </div>
            <div className="rooms-preview-grid">
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} navigate={navigate} />
              ))}
            </div>
            <div className="section-cta">
              <button className="btn-outline" onClick={() => navigate('rooms')}>View All Rooms</button>
            </div>
          </div>
        </section>
      )}

      {/* ─── Photo Gallery ─── */}
      <section className="gallery-section section">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Life at Serenity</p>
            <div className="gold-line centered" />
            <h2 className="display-lg">Every detail considered</h2>
          </div>
          <div className="gallery-grid">
            {GALLERY.map((img, i) => (
              <div key={i} className={`gallery-item ${img.span}`}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-overlay" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Signature Detail ─── */}
      <section className="detail-section">
        <div className="detail-inner">
          <div className="detail-image-col">
            <div className="detail-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80&fit=crop"
                alt="Serenity pool and lounge area"
                loading="lazy"
              />
            </div>
            <div className="detail-img-accent">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80&fit=crop"
                alt="Elegant lounge interior"
                loading="lazy"
              />
            </div>
          </div>
          <div className="detail-text">
            <p className="eyebrow">The Serenity Difference</p>
            <div className="gold-line" />
            <h2 className="display-lg">Thoughtful to the last thread</h2>
            <p>
              We source our linens from a small mill in the Western Cape. Our coffee is roasted in Johannesburg,
              and our breakfasts change with the season. None of this shows up on a star rating — but you'll feel it.
            </p>
            <p>This is a home, hosted. Ten guests at most, ever.</p>
            <button className="btn-primary" onClick={() => navigate('booking')} style={{marginTop:'1.5rem'}}>
              Book a Stay
            </button>
            <div className="detail-stat-row" style={{marginTop:'2rem'}}>
              {[['4','Rooms'],['100%','Private'],['5★','Rated']].map(([n,l]) => (
                <div key={l} className="detail-stat">
                  <span className="stat-num">{n}</span>
                  <span className="stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonial ─── */}
      <section className="testimonial-section section-sm">
        <div className="container-narrow">
          <div className="testimonial-card">
            <span className="testimonial-ornament">❝</span>
            <blockquote>
              The quietest and most beautiful place I've stayed in South Africa.
              The attention to detail is extraordinary — from the hand-pressed linen to the
              morning coffee left silently outside my door.
            </blockquote>
            <cite>— A. Fourie, Cape Town</cite>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="cta-banner section-sm">
        <div className="container">
          <div className="cta-banner-inner">
            <div>
              <h2 className="display-md" style={{color:'var(--ivory)'}}>Ready for stillness?</h2>
              <p style={{color:'rgba(250,247,242,0.7)', marginTop:'0.5rem'}}>
                Direct bookings receive complimentary early check-in, subject to availability.
              </p>
            </div>
            <button className="btn-primary cta-banner-btn" onClick={() => navigate('booking')}>
              Reserve Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
