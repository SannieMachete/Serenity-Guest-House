import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ currentPage, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { key: 'home', label: 'Home' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'booking', label: 'Book a Stay' },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => { navigate('home'); setMenuOpen(false); }}>
          <span className="logo-wordmark">Serenity</span>
          <span className="logo-sub">Guest House</span>
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <button
              key={l.key}
              className={`nav-link ${currentPage === l.key ? 'active' : ''} ${l.key === 'booking' ? 'nav-cta' : ''}`}
              onClick={() => { navigate(l.key); setMenuOpen(false); }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
