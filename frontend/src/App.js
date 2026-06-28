import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Check if current URL is the admin route
const isAdminRoute = () => window.location.pathname === '/admin';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [adminUser, setAdminUser] = useState(() => {
    const token = localStorage.getItem('admin_token');
    const username = localStorage.getItem('admin_user');
    return token ? { username } : null;
  });
  const [showAdmin, setShowAdmin] = useState(isAdminRoute);

  useEffect(() => {
    if (!showAdmin) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, showAdmin]);

  // Listen for /admin in URL
  useEffect(() => {
    const handlePath = () => setShowAdmin(isAdminRoute());
    window.addEventListener('popstate', handlePath);
    return () => window.removeEventListener('popstate', handlePath);
  }, []);

  const navigate = (p, room = null) => {
    if (p === 'admin') {
      window.history.pushState({}, '', '/admin');
      setShowAdmin(true);
      return;
    }
    window.history.pushState({}, '', '/');
    setShowAdmin(false);
    setPage(p);
    if (room) setSelectedRoom(room);
  };

  const handleAdminLogin = (data) => setAdminUser(data);
  const handleAdminLogout = () => {
    setAdminUser(null);
    setShowAdmin(false);
    window.history.pushState({}, '', '/');
    setPage('home');
  };

  // ─── Admin Mode ───────────────────────────────────────────────
  if (showAdmin) {
    if (!adminUser) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard user={adminUser} onLogout={handleAdminLogout} />;
  }

  // ─── Public Site ──────────────────────────────────────────────
  return (
    <div className="app">
      <Navbar currentPage={page} navigate={navigate} />
      <main>
        {page === 'home' && <HomePage navigate={navigate} />}
        {page === 'rooms' && <RoomsPage navigate={navigate} />}
        {page === 'booking' && <BookingPage navigate={navigate} selectedRoom={selectedRoom} />}
        {page === 'contact' && <ContactPage navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
