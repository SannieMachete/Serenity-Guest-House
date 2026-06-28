import React from 'react';
import './Footer.css';

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-wordmark">Serenity</span>
              <span className="footer-sub">Guest House</span>
            </div>
            <p className="footer-tagline">Where stillness meets luxury.<br />Pretoria, South Africa.</p>
          </div>

          <div className="footer-col">
            <h4>Navigate</h4>
            <nav>
              {[['home','Home'],['rooms','Rooms'],['booking','Book a Stay'],['contact','Contact']].map(([k,l]) => (
                <button key={k} onClick={() => navigate(k)}>{l}</button>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <address>
              <p>12 Jacaranda Lane<br />Waterkloof, Pretoria<br />0181, South Africa</p>
              <a href="tel:+27123456789">+27 12 345 6789</a>
              <a href="mailto:hello@serenityguesthouse.co.za">hello@serenityguesthouse.co.za</a>
            </address>
          </div>

          <div className="footer-col">
            <h4>Hours</h4>
            <p>Check-in: 14:00 – 20:00</p>
            <p>Check-out: by 11:00</p>
            <p className="footer-note">Late arrivals by arrangement.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Serenity Guest House. All rights reserved.</p>
          <p className="footer-legal">
            A place of rest, not a platform. Your data is never sold.
          </p>
        </div>
      </div>
    </footer>
  );
}
