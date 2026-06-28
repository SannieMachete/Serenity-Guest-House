import React, { useState } from 'react';
import { sendContact } from '../hooks/useApi';
import './ContactPage.css';

const INITIAL = { name: '', email: '', subject: '', message: '' };

export default function ContactPage({ navigate }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name is required (min 2 characters).';
    if (!/^[a-zA-Z\s'-]+$/.test(form.name.trim())) errs.name = 'Name may only contain letters.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'A valid email is required.';
    if (!form.subject.trim() || form.subject.trim().length < 3) errs.subject = 'Subject must be at least 3 characters.';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    if (form.message.trim().length > 1000) errs.message = 'Message must not exceed 1000 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const result = await sendContact(form);
      setSuccess(result.message);
      setForm(INITIAL);
    } catch (err) {
      const msgs = err.errors?.join(' ') || err.error || 'Something went wrong. Please try again.';
      setApiError(msgs);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="page-hero contact-hero">
        <div className="container">
          <p className="eyebrow">Get in Touch</p>
          <h1 className="display-xl">Contact Us</h1>
          <p>We respond to all enquiries within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* ─── Form ─── */}
            <div className="contact-form-wrap">
              <h2 className="display-md" style={{marginBottom:'0.5rem', color:'var(--espresso)'}}>Send us a message</h2>
              <div className="gold-line" style={{marginBottom:'1.75rem'}} />

              {success ? (
                <div className="contact-success">
                  <span className="success-icon">✓</span>
                  <div>
                    <h3>Message received</h3>
                    <p>{success}</p>
                  </div>
                  <button className="btn-outline" onClick={() => setSuccess('')} style={{marginTop:'1.25rem'}}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {apiError && <div className="alert alert-error" style={{marginBottom:'1.5rem'}}>{apiError}</div>}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input id="name" name="name" type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                        value={form.name} onChange={handleChange} placeholder="Your name" autoComplete="name" />
                      {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <input id="email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                        value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
                      {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="form-group" style={{marginBottom:'1rem'}}>
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <input id="subject" name="subject" type="text" className={`form-input ${errors.subject ? 'error' : ''}`}
                      value={form.subject} onChange={handleChange} placeholder="How can we help?" />
                    {errors.subject && <p className="form-error">{errors.subject}</p>}
                  </div>
                  <div className="form-group" style={{marginBottom:'1.5rem'}}>
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea id="message" name="message" className={`form-input ${errors.message ? 'error' : ''}`}
                      value={form.message} onChange={handleChange} placeholder="Tell us more…" rows={5} maxLength={1000} />
                    <span className="char-count">{form.message.length}/1000</span>
                    {errors.message && <p className="form-error">{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn-primary contact-submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* ─── Info Panel ─── */}
            <div className="contact-info">
              <div className="contact-info-card">
                <h3 className="display-md" style={{color:'var(--ivory)', marginBottom:'1.5rem'}}>Find us</h3>

                {[
                  {
                    icon: '📍',
                    label: 'Address',
                    content: '12 Jacaranda Lane\nWaterkloof, Pretoria\n0181, South Africa',
                  },
                  {
                    icon: '📞',
                    label: 'Phone',
                    content: '+27 12 345 6789',
                    href: 'tel:+27123456789',
                  },
                  {
                    icon: '✉️',
                    label: 'Email',
                    content: 'hello@serenityguesthouse.co.za',
                    href: 'mailto:hello@serenityguesthouse.co.za',
                  },
                  {
                    icon: '🕐',
                    label: 'Reception Hours',
                    content: 'Mon–Sun: 07:00 – 21:00\nAfter hours by arrangement',
                  },
                ].map(item => (
                  <div key={item.label} className="contact-info-item">
                    <span className="contact-info-icon">{item.icon}</span>
                    <div>
                      <p className="contact-info-label">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="contact-info-value contact-info-link">{item.content}</a>
                      ) : (
                        <p className="contact-info-value" style={{whiteSpace:'pre-line'}}>{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-booking-prompt">
                <p>Ready to book? Skip the enquiry and go straight to a reservation.</p>
                <button className="btn-outline contact-book-btn" onClick={() => navigate('booking')}>
                  Book a Stay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
