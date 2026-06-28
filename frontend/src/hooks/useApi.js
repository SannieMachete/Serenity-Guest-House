const API_BASE = process.env.REACT_APP_API_URL || '';

const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
};

export const getRooms = () => apiFetch('/rooms');
export const getRoom = (id) => apiFetch(`/rooms/${id}`);
export const createBooking = (body) => apiFetch('/bookings', { method: 'POST', body: JSON.stringify(body) });
export const lookupBooking = (email, code) => apiFetch(`/bookings/lookup?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
export const sendContact = (body) => apiFetch('/contact', { method: 'POST', body: JSON.stringify(body) });
export const adminLogin = (body) => apiFetch('/admin/login', { method: 'POST', body: JSON.stringify(body) });
export const getAdminBookings = () => apiFetch('/bookings');
export const updateBookingStatus = (id, status) => apiFetch(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
