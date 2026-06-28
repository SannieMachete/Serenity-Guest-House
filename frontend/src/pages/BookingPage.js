import React, { useState, useEffect } from 'react';
import { getRooms, createBooking, lookupBooking } from '../hooks/useApi';
import './BookingPage.css';

const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const INITIAL = {
  roomId: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  checkIn: today(),
  checkOut: tomorrow(),
  guests: 1,
  specialRequests: '',
};

export default function BookingPage({ navigate, selectedRoom }) {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    ...INITIAL,
    roomId: selectedRoom?.id || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [apiError, setApiError] = useState('');
  const [activeTab, setActiveTab] = useState('book');

  // Lookup state
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    getRooms().then(d => setRooms(d.rooms)).catch(() => {});
  }, []);

  const selectedRoomData = rooms.find(r => r.id === form.roomId);

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut) - new Date(form.checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  const total = selectedRoomData ? selectedRoomData.price * nights : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.roomId) errs.roomId = 'Please select a room.';
    if (!form.guestName.trim() || form.guestName.trim().length < 2) errs.guestName = 'Full name is required (min 2 characters).';
    if (!/^[a-zA-Z\s'-]+$/.test(form.guestName.trim())) errs.guestName = 'Name may only contain letters.';
    if (!form.guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guestEmail)) errs.guestEmail = 'A valid email address is required.';
    if (!form.guestPhone || !/^[0-9+\s()-]{7,20}$/.test(form.guestPhone)) errs.guestPhone = 'A valid phone number is required.';
    if (!form.checkIn) errs.checkIn = 'Check-in date is required.';
    if (!form.checkOut) errs.checkOut = 'Check-out date is required.';
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn)) {
      errs.checkOut = 'Check-out must be after check-in.';
    }
    if (nights > 30) errs.checkOut = 'Bookings cannot exceed 30 nights.';
    if (selectedRoomData && form.guests > selectedRoomData.capacity) {
      errs.guests = `This room fits a maximum of ${selectedRoomData.capacity} guests.`;
    }
    if (form.specialRequests && form.specialRequests.length > 500) {
      errs.specialRequests = 'Special requests must not exceed 500 characters.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError('');
    try {
      const result = await createBooking({
        ...form,
        guests: parseInt(form.guests),
      });
      setConfirmation(result.booking);
    } catch (err) {
      const msgs = err.errors?.join(' ') || err.error || 'Something went wrong. Please try again.';
      setApiError(msgs);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupEmail || !lookupCode) {
      setLookupError('Please enter your email and confirmation code.');
      return;
    }
    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);
    try {
      const result = await lookupBooking(lookupEmail, lookupCode);
      setLookupResult(result.booking);
    } catch (err) {
      setLookupError(err.error || 'Booking not found.');
    } finally {
      setLookupLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  if (confirmation) {
    return (
      <div className="booking-page">
        <div className="page-hero page-hero-sm booking-hero">
          <div className="container">
            <p className="eyebrow">Booking Confirmed</p>
            <h1 className="display-xl">You're expected.</h1>
          </div>
        </div>
        <section className="section">
          <div className="container-narrow">
            <div className="confirmation-card">
              <div className="confirmation-header">
                <span className="confirmation-tick">✓</span>
                <h2 className="display-md">Reservation Confirmed</h2>
                <p>A confirmation has been noted. We look forward to welcoming you.</p>
              </div>
              <div className="confirmation-code-row">
                <span className="confirmation-label">Confirmation Code</span>
                <span className="confirmation-code">{confirmation.confirmationCode}</span>
              </div>
              <div className="confirmation-details">
                {[
                  ['Room', confirmation.roomName],
                  ['Check-in', formatDate(confirmation.checkIn)],
                  ['Check-out', formatDate(confirmation.checkOut)],
                  ['Duration', `${confirmation.nights} night${confirmation.nights > 1 ? 's' : ''}`],
                  ['Guests', confirmation.guests],
                  ['Total', `R${confirmation.totalAmount.toLocaleString()}`],
                  ['Status', 'Confirmed'],
                ].map(([l, v]) => (
                  <div key={l} className="confirmation-row">
                    <span className="conf-label">{l}</span>
                    <span className="conf-value">{v}</span>
                  </div>
                ))}
              </div>
              <div className="alert alert-info" style={{marginTop:'1.5rem'}}>
                Please save your confirmation code. You can use it to look up your booking at any time.
              </div>
              <div className="confirmation-actions">
                <button className="btn-primary" onClick={() => navigate('home')}>Back to Home</button>
                <button className="btn-outline" onClick={() => { setConfirmation(null); setForm({...INITIAL}); }}>Make Another Booking</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="page-hero page-hero-sm booking-hero">
        <div className="container">
          <p className="eyebrow">Reservations</p>
          <h1 className="display-xl">Book Your Stay</h1>
          <p>Direct bookings receive complimentary early check-in, subject to availability.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="booking-tabs">
            <button className={`booking-tab ${activeTab === 'book' ? 'active' : ''}`} onClick={() => setActiveTab('book')}>
              New Reservation
            </button>
            <button className={`booking-tab ${activeTab === 'lookup' ? 'active' : ''}`} onClick={() => setActiveTab('lookup')}>
              Find My Booking
            </button>
          </div>

          {activeTab === 'book' && (
            <div className="booking-layout">
              {/* ─── Form ─── */}
              <div className="booking-form-wrap">
                <form onSubmit={handleSubmit} noValidate>
                  {apiError && (
                    <div className="alert alert-error" style={{marginBottom:'1.5rem'}}>{apiError}</div>
                  )}

                  {/* Room Selection */}
                  <fieldset className="form-fieldset">
                    <legend>Choose Your Room</legend>
                    <div className="room-radio-grid">
                      {rooms.map(room => (
                        <label key={room.id} className={`room-radio ${form.roomId === room.id ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="roomId"
                            value={room.id}
                            checked={form.roomId === room.id}
                            onChange={handleChange}
                          />
                          <div className="room-radio-content">
                            <div className="room-radio-top">
                              <span className="room-radio-name">{room.name}</span>
                              <span className="room-radio-price">R{room.price.toLocaleString()}/night</span>
                            </div>
                            <span className="room-radio-meta">{room.size}m² · Up to {room.capacity} guests</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.roomId && <p className="form-error">{errors.roomId}</p>}
                  </fieldset>

                  {/* Dates & Guests */}
                  <fieldset className="form-fieldset">
                    <legend>Dates & Guests</legend>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="checkIn">Check-in Date</label>
                        <input id="checkIn" name="checkIn" type="date" className={`form-input ${errors.checkIn ? 'error' : ''}`}
                          value={form.checkIn} min={today()} onChange={handleChange} />
                        {errors.checkIn && <p className="form-error">{errors.checkIn}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="checkOut">Check-out Date</label>
                        <input id="checkOut" name="checkOut" type="date" className={`form-input ${errors.checkOut ? 'error' : ''}`}
                          value={form.checkOut} min={form.checkIn || today()} onChange={handleChange} />
                        {errors.checkOut && <p className="form-error">{errors.checkOut}</p>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="guests">Number of Guests</label>
                      <select id="guests" name="guests" className={`form-input ${errors.guests ? 'error' : ''}`}
                        value={form.guests} onChange={handleChange}>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                      </select>
                      {errors.guests && <p className="form-error">{errors.guests}</p>}
                    </div>
                  </fieldset>

                  {/* Guest Details */}
                  <fieldset className="form-fieldset">
                    <legend>Your Details</legend>
                    <div className="form-group">
                      <label className="form-label" htmlFor="guestName">Full Name</label>
                      <input id="guestName" name="guestName" type="text" className={`form-input ${errors.guestName ? 'error' : ''}`}
                        value={form.guestName} onChange={handleChange} placeholder="e.g. Thabo Nkosi" autoComplete="name" />
                      {errors.guestName && <p className="form-error">{errors.guestName}</p>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="guestEmail">Email Address</label>
                        <input id="guestEmail" name="guestEmail" type="email" className={`form-input ${errors.guestEmail ? 'error' : ''}`}
                          value={form.guestEmail} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
                        {errors.guestEmail && <p className="form-error">{errors.guestEmail}</p>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="guestPhone">Phone Number</label>
                        <input id="guestPhone" name="guestPhone" type="tel" className={`form-input ${errors.guestPhone ? 'error' : ''}`}
                          value={form.guestPhone} onChange={handleChange} placeholder="+27 12 345 6789" autoComplete="tel" />
                        {errors.guestPhone && <p className="form-error">{errors.guestPhone}</p>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="specialRequests">Special Requests <span className="optional">(optional)</span></label>
                      <textarea id="specialRequests" name="specialRequests" className="form-input"
                        value={form.specialRequests} onChange={handleChange}
                        placeholder="Dietary requirements, accessibility needs, special occasions…"
                        rows={3} maxLength={500} />
                      <span className="char-count">{form.specialRequests.length}/500</span>
                      {errors.specialRequests && <p className="form-error">{errors.specialRequests}</p>}
                    </div>
                  </fieldset>

                  <button type="submit" className="btn-primary booking-submit" disabled={submitting}>
                    {submitting ? 'Processing…' : 'Confirm Reservation'}
                  </button>
                </form>
              </div>

              {/* ─── Summary Sidebar ─── */}
              <div className="booking-summary">
                <div className="summary-card">
                  <h3 className="summary-title">Booking Summary</h3>
                  {selectedRoomData ? (
                    <>
                      <div className="summary-room">
                        <span className="summary-room-icon">✦</span>
                        <div>
                          <p className="summary-room-name">{selectedRoomData.name}</p>
                          <p className="summary-room-meta">{selectedRoomData.size}m² · Up to {selectedRoomData.capacity} guests</p>
                        </div>
                      </div>
                      <div className="summary-divider" />
                      <div className="summary-rows">
                        {form.checkIn && <div className="summary-row"><span>Check-in</span><span>{form.checkIn}</span></div>}
                        {form.checkOut && <div className="summary-row"><span>Check-out</span><span>{form.checkOut}</span></div>}
                        {nights > 0 && <div className="summary-row"><span>Nights</span><span>{nights}</span></div>}
                        {form.guests && <div className="summary-row"><span>Guests</span><span>{form.guests}</span></div>}
                      </div>
                      {nights > 0 && (
                        <>
                          <div className="summary-divider" />
                          <div className="summary-total-row">
                            <span>Total</span>
                            <span className="summary-total">R{total.toLocaleString()}</span>
                          </div>
                          <p className="summary-note">Payment is collected on arrival. We accept cash and card.</p>
                        </>
                      )}
                    </>
                  ) : (
                    <p className="summary-empty">Select a room to see your summary.</p>
                  )}
                </div>

                <div className="summary-card summary-help">
                  <h4>Need help?</h4>
                  <p>Call us on <a href="tel:+27123456789">+27 12 345 6789</a> or email <a href="mailto:hello@serenityguesthouse.co.za">hello@serenityguesthouse.co.za</a></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lookup' && (
            <div className="lookup-section">
              <div className="lookup-card">
                <h2 className="display-md">Find Your Booking</h2>
                <p>Enter your email and the confirmation code from your booking to retrieve your reservation details.</p>

                <form onSubmit={handleLookup} noValidate style={{marginTop:'1.75rem'}}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lookupEmail">Email Address</label>
                    <input id="lookupEmail" type="email" className="form-input"
                      value={lookupEmail} onChange={e => { setLookupEmail(e.target.value); setLookupError(''); }}
                      placeholder="you@example.com" />
                  </div>
                  <div className="form-group" style={{marginTop:'1rem'}}>
                    <label className="form-label" htmlFor="lookupCode">Confirmation Code</label>
                    <input id="lookupCode" type="text" className="form-input"
                      value={lookupCode} onChange={e => { setLookupCode(e.target.value.toUpperCase()); setLookupError(''); }}
                      placeholder="e.g. SGH-ABC123" style={{letterSpacing:'0.08em', textTransform:'uppercase'}} />
                  </div>
                  {lookupError && <div className="alert alert-error" style={{marginTop:'1rem'}}>{lookupError}</div>}
                  <button type="submit" className="btn-primary" style={{marginTop:'1.5rem', width:'100%'}} disabled={lookupLoading}>
                    {lookupLoading ? 'Searching…' : 'Find Booking'}
                  </button>
                </form>

                {lookupResult && (
                  <div className="lookup-result">
                    <div className="alert alert-success" style={{marginBottom:'1.5rem'}}>Booking found.</div>
                    <div className="confirmation-details">
                      {[
                        ['Room', lookupResult.roomName],
                        ['Check-in', formatDate(lookupResult.checkIn)],
                        ['Check-out', formatDate(lookupResult.checkOut)],
                        ['Nights', lookupResult.nights],
                        ['Guests', lookupResult.guests],
                        ['Total', `R${lookupResult.totalAmount.toLocaleString()}`],
                        ['Status', lookupResult.status.charAt(0).toUpperCase() + lookupResult.status.slice(1)],
                        ...(lookupResult.specialRequests ? [['Requests', lookupResult.specialRequests]] : []),
                      ].map(([l, v]) => (
                        <div key={l} className="confirmation-row">
                          <span className="conf-label">{l}</span>
                          <span className="conf-value">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
