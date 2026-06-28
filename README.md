# Serenity Guest House — Full Stack Website

A secure, production-ready guest house website built with React + Node.js/Express.

## Stack

- **Frontend**: React 18 SPA — Home, Rooms, Booking, Contact pages
- **Backend**: Node.js + Express REST API
- **Security**: Helmet, CORS, rate limiting, JWT auth, input validation, XSS sanitization

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env        # Then edit .env with your real secrets
npm install
node server.js              # Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start                   # Runs on http://localhost:3000
```

---

## Security Features

| Feature | Implementation |
|---|---|
| Helmet headers | CSP, HSTS, X-Frame-Options, etc. |
| CORS | Restricted to frontend origin only |
| Rate limiting | 100 req/15min global; 10/15min on bookings/auth |
| Input validation | express-validator on all POST endpoints |
| XSS sanitization | Custom middleware strips `<>`, JS protocols, event handlers |
| JWT auth | Admin routes protected; tokens expire in 8h |
| Password hashing | bcrypt with cost factor 12 |
| Timing attack prevention | Dummy hash comparison prevents username enumeration |
| Payload size limit | 10kb max body size |
| No SQL injection risk | In-memory store (no raw queries) |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/rooms | — | List all rooms |
| GET | /api/rooms/:id | — | Single room |
| POST | /api/bookings | — | Create booking |
| GET | /api/bookings/lookup | — | Guest booking lookup |
| GET | /api/bookings | Admin JWT | All bookings |
| PATCH | /api/bookings/:id/status | Admin JWT | Update status |
| POST | /api/contact | — | Send message |
| GET | /api/contact | Admin JWT | All messages |
| POST | /api/admin/login | — | Admin login |
| GET | /api/admin/me | Admin JWT | Verify session |

---

## Default Admin Credentials

```
Username: admin
Password: Serenity@Admin2024
```

**Change these immediately via the `.env` file before deploying.**

---

## Production Checklist

- [ ] Set a strong `JWT_SECRET` (64+ random characters)
- [ ] Set a strong `ADMIN_PASSWORD`
- [ ] Set `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to your real domain
- [ ] Run `npm run build` in `/frontend` and serve static files
- [ ] Add HTTPS via your hosting provider or nginx + Let's Encrypt
- [ ] Replace in-memory store with a real database (PostgreSQL recommended)
- [ ] Add email notifications for bookings (Nodemailer + SendGrid)

---

## Replacing the In-Memory Store

The data layer is isolated in `backend/data/store.js`. To migrate to a database:
1. Replace the arrays with database queries
2. The API route logic stays the same
3. Add a migration script to seed initial room data
