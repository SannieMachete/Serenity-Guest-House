import React, { useState, useEffect, useCallback } from 'react';
import { getAdminBookings, updateBookingStatus } from '../hooks/useApi';
import './AdminDashboard.css';

const API_BASE = '';

const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_COLORS = {
  confirmed: { bg: '#F0FAF4', color: '#1E6B3A', border: '#A8D5B5' },
  cancelled: { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
  completed: { bg: '#FFF9F0', color: '#92400E', border: '#FCD9A0' },
};

export default function AdminDashboard({ user, onLogout }) {
  const [tab, setTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [toast, setToast] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bData, mData] = await Promise.all([
        apiFetch('/bookings'),
        apiFetch('/contact'),
      ]);
      setBookings(bData.bookings || []);
      setMessages(mData.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setStatusUpdating(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      );
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
      showToast(`Booking status updated to "${newStatus}".`);
    } catch (err) {
      showToast('Failed to update status. Please try again.');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    onLogout();
  };

  // ─── Stats ───────────────────────────────────────────────────
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    messages: messages.length,
  };

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === bookingFilter);

  // Sort newest first
  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="admin-dashboard">
      {/* ─── Toast ─── */}
      {toast && <div className="admin-toast">{toast}</div>}

      {/* ─── Sidebar ─── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="sidebar-word">Serenity</span>
          <span className="sidebar-sub">Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {[
            { key: 'overview', icon: '⬡', label: 'Overview' },
            { key: 'bookings', icon: '📋', label: 'Bookings' },
            { key: 'messages', icon: '✉️', label: 'Messages' },
          ].map(item => (
            <button
              key={item.key}
              className={`admin-nav-btn ${tab === item.key ? 'active' : ''}`}
              onClick={() => { setTab(item.key); setSelectedBooking(null); }}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
              {item.key === 'messages' && messages.length > 0 && (
                <span className="admin-badge">{messages.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-avatar">{user?.username?.[0]?.toUpperCase()}</span>
            <div>
              <p className="admin-user-name">{user?.username}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-page-title">
              {tab === 'overview' && 'Overview'}
              {tab === 'bookings' && 'Bookings'}
              {tab === 'messages' && 'Messages'}
            </h1>
            <p className="admin-page-sub">
              {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button className="admin-refresh-btn" onClick={loadData} title="Refresh data">
            ↻ Refresh
          </button>
        </header>

        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner" />
            <p>Loading data…</p>
          </div>
        ) : (
          <>
            {/* ─── Overview Tab ─── */}
            {tab === 'overview' && (
              <div className="admin-overview">
                <div className="stats-grid">
                  {[
                    { label: 'Total Bookings', value: stats.total, color: 'brown' },
                    { label: 'Confirmed', value: stats.confirmed, color: 'green' },
                    { label: 'Completed', value: stats.completed, color: 'gold' },
                    { label: 'Cancelled', value: stats.cancelled, color: 'red' },
                    { label: 'Total Revenue', value: `R${stats.revenue.toLocaleString()}`, color: 'brown', wide: true },
                    { label: 'Contact Messages', value: stats.messages, color: 'blue' },
                  ].map(s => (
                    <div key={s.label} className={`stat-card stat-${s.color} ${s.wide ? 'stat-wide' : ''}`}>
                      <p className="stat-label">{s.label}</p>
                      <p className="stat-value">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="overview-sections">
                  {/* Recent Bookings */}
                  <div className="overview-panel">
                    <div className="panel-header">
                      <h2>Recent Bookings</h2>
                      <button className="panel-link" onClick={() => setTab('bookings')}>View all →</button>
                    </div>
                    {bookings.length === 0 ? (
                      <p className="empty-state">No bookings yet.</p>
                    ) : (
                      <div className="mini-table">
                        {[...bookings].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5).map(b => (
                          <div key={b.id} className="mini-row" onClick={() => { setTab('bookings'); setSelectedBooking(b); }}>
                            <div className="mini-row-main">
                              <span className="mini-name">{b.guestName}</span>
                              <span className="mini-room">{b.roomName}</span>
                            </div>
                            <div className="mini-row-right">
                              <span className="mini-amount">R{b.totalAmount?.toLocaleString()}</span>
                              <span className="status-pill" style={STATUS_COLORS[b.status]}>{b.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Messages */}
                  <div className="overview-panel">
                    <div className="panel-header">
                      <h2>Recent Messages</h2>
                      <button className="panel-link" onClick={() => setTab('messages')}>View all →</button>
                    </div>
                    {messages.length === 0 ? (
                      <p className="empty-state">No messages yet.</p>
                    ) : (
                      <div className="mini-table">
                        {[...messages].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5).map(m => (
                          <div key={m.id} className="mini-row">
                            <div className="mini-row-main">
                              <span className="mini-name">{m.name}</span>
                              <span className="mini-room">{m.subject}</span>
                            </div>
                            <span className="mini-date">{formatDate(m.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Bookings Tab ─── */}
            {tab === 'bookings' && (
              <div className="admin-bookings">
                {selectedBooking ? (
                  /* Booking Detail View */
                  <div className="booking-detail">
                    <button className="back-btn" onClick={() => setSelectedBooking(null)}>← Back to Bookings</button>

                    <div className="booking-detail-card">
                      <div className="booking-detail-header">
                        <div>
                          <p className="detail-code">{selectedBooking.confirmationCode}</p>
                          <h2 className="detail-guest">{selectedBooking.guestName}</h2>
                          <p className="detail-room">{selectedBooking.roomName}</p>
                        </div>
                        <span className="status-pill status-lg" style={STATUS_COLORS[selectedBooking.status]}>
                          {selectedBooking.status}
                        </span>
                      </div>

                      <div className="detail-grid">
                        {[
                          ['Email', selectedBooking.guestEmail],
                          ['Phone', selectedBooking.guestPhone],
                          ['Check-in', formatDate(selectedBooking.checkIn)],
                          ['Check-out', formatDate(selectedBooking.checkOut)],
                          ['Nights', selectedBooking.nights],
                          ['Guests', selectedBooking.guests],
                          ['Total Amount', `R${selectedBooking.totalAmount?.toLocaleString()}`],
                          ['Booked On', formatDateTime(selectedBooking.createdAt)],
                        ].map(([l, v]) => (
                          <div key={l} className="detail-item">
                            <span className="detail-item-label">{l}</span>
                            <span className="detail-item-value">{v}</span>
                          </div>
                        ))}
                      </div>

                      {selectedBooking.specialRequests && (
                        <div className="detail-requests">
                          <p className="detail-item-label">Special Requests</p>
                          <p className="detail-requests-text">{selectedBooking.specialRequests}</p>
                        </div>
                      )}

                      <div className="detail-actions">
                        <p className="detail-actions-label">Update Status</p>
                        <div className="detail-status-btns">
                          {['confirmed', 'completed', 'cancelled'].map(s => (
                            <button
                              key={s}
                              className={`status-btn status-btn-${s} ${selectedBooking.status === s ? 'active' : ''}`}
                              onClick={() => handleStatusChange(selectedBooking.id, s)}
                              disabled={statusUpdating === selectedBooking.id || selectedBooking.status === s}
                            >
                              {statusUpdating === selectedBooking.id ? '…' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Bookings List */
                  <>
                    <div className="bookings-filter-bar">
                      {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
                        <button
                          key={f}
                          className={`filter-btn ${bookingFilter === f ? 'active' : ''}`}
                          onClick={() => setBookingFilter(f)}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                          <span className="filter-count">
                            {f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length}
                          </span>
                        </button>
                      ))}
                    </div>

                    {sortedBookings.length === 0 ? (
                      <div className="empty-panel">
                        <p>No bookings found.</p>
                      </div>
                    ) : (
                      <div className="bookings-table-wrap">
                        <table className="bookings-table">
                          <thead>
                            <tr>
                              <th>Guest</th>
                              <th>Room</th>
                              <th>Check-in</th>
                              <th>Check-out</th>
                              <th>Nights</th>
                              <th>Total</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedBookings.map(b => (
                              <tr key={b.id} className="booking-row" onClick={() => setSelectedBooking(b)}>
                                <td>
                                  <div className="table-guest-name">{b.guestName}</div>
                                  <div className="table-guest-email">{b.guestEmail}</div>
                                </td>
                                <td>{b.roomName}</td>
                                <td>{formatDate(b.checkIn)}</td>
                                <td>{formatDate(b.checkOut)}</td>
                                <td>{b.nights}</td>
                                <td className="table-amount">R{b.totalAmount?.toLocaleString()}</td>
                                <td>
                                  <span className="status-pill" style={STATUS_COLORS[b.status]}>{b.status}</span>
                                </td>
                                <td onClick={e => e.stopPropagation()}>
                                  <select
                                    className="status-select"
                                    value={b.status}
                                    onChange={e => handleStatusChange(b.id, e.target.value)}
                                    disabled={statusUpdating === b.id}
                                  >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ─── Messages Tab ─── */}
            {tab === 'messages' && (
              <div className="admin-messages">
                {messages.length === 0 ? (
                  <div className="empty-panel"><p>No contact messages yet.</p></div>
                ) : (
                  <div className="messages-list">
                    {[...messages].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).map(m => (
                      <div key={m.id} className="message-card">
                        <div className="message-card-header">
                          <div className="message-sender">
                            <span className="message-avatar">{m.name[0].toUpperCase()}</span>
                            <div>
                              <p className="message-name">{m.name}</p>
                              <a href={`mailto:${m.email}`} className="message-email">{m.email}</a>
                            </div>
                          </div>
                          <span className="message-date">{formatDateTime(m.createdAt)}</span>
                        </div>
                        <p className="message-subject">{m.subject}</p>
                        <p className="message-body">{m.message}</p>
                        <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                          className="btn-outline message-reply-btn">
                          Reply via Email
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
