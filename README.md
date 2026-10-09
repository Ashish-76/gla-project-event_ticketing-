# Eventix – Full-Stack MERN Event Ticketing Platform

> **Capstone Project:** Full Stack Web Application with QR-Secured Ticketing & Gate Entry Verification  
> **Tech Stack:** MongoDB, Express.js, React 19, Node.js, JWT, Vite

---

## 📌 Project Overview

**Eventix** is an end-to-end digital event ticketing platform built using the MERN stack. It digitizes the entire lifecycle of event management:
1. **Discovery & Booking:** Attendees can browse, search, filter, and book multi-tiered event tickets with instant simulated checkout.
2. **Encrypted QR E-Tickets:** Instant generation of digital passes with encrypted QR codes ready for on-screen presentation or print/PDF export.
3. **Fraud-Proof Gate Entry:** Organizers and security staff can verify and check in attendees via device camera or code lookup in real-time, eliminating counterfeit tickets and double-entry fraud.
4. **Role-Based Control Suites:** Dedicated dashboards with Role-Based Access Control (RBAC) for **Attendees**, **Organizers**, and **Platform Administrators**.

---

## 🔑 Demo Login Accounts

Use the **1-Click Quick Fill** buttons on the Login page or log in with these pre-seeded accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@eventix.com` | `admin123` | Platform Analytics, User Management, Event Moderation, Audit Logs |
| 🎪 **Organizer** | `organizer@eventix.com` | `organizer123` | Create/Edit Events, Ticket Sales, Roster, Live QR Scanner |
| 🎟️ **Attendee** | `attendee@eventix.com` | `attendee123` | Explore Events, Book Tickets, View/Print QR Passes, Cancel Bookings |

---

## 🚀 Key Modules & Architecture

```
event-ticketing/
├── server/                                # Express + Node.js Backend API
│   ├── Backend Configuration/
│   │   ├── Configuration Folders/         # DB & Middleware (JWT, RBAC)
│   │   ├── Controllers/                   # Auth, Events, Bookings, Tickets, Admin
│   │   ├── Models/                        # 8 Mongoose Collections
│   │   │   ├── UserSchema/
│   │   │   ├── RoleSchema/
│   │   │   ├── EventSchema/
│   │   │   ├── BookingSchema/
│   │   │   ├── TicketSchema/
│   │   │   ├── PaymentSchema/
│   │   │   ├── ActivityLogSchema/
│   │   │   └── SettingSchema/
│   │   └── Routes/                        # Express REST Routers
│   ├── seeder.js                          # Database Seeder (Demo Data)
│   └── server.js                          # Application Entry Point
└── client/                                # React 19 + Vite Frontend
    ├── src/
    │   ├── Components/                    # Reusable Components (Navbar, Footer, Modal, QR)
    │   ├── context/                       # AuthContext & Axios Interceptors
    │   ├── Pages/                         # 12+ Pages (Home, Events, Checkout, QR Scanner, Dashboards)
    │   ├── App.jsx                        # React Router + Protected Routes
    │   └── index.css                      # Modern CSS Design Tokens
    └── vite.config.js
```

---

## 🛠️ Step-by-Step Setup & Running

### 1. Prerequisites
- **Node.js**: v18+ (Tested on v22)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas)

### 2. Backend Setup & Seeding
```bash
# Navigate to server directory
cd server

# Install dependencies (if not already installed)
npm install

# Seed the database with sample events, users, tickets & logs
npm run seed

# Start Backend Server (runs on http://localhost:4000)
npm run dev
# or
npm start
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start Vite Development Server (runs on http://localhost:5173)
npm run dev
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register new Attendee or Organizer
- `POST /api/auth/login` – Login & receive JWT token
- `GET  /api/auth/me` – Fetch current user profile *(Protected)*
- `PUT  /api/auth/profile` – Update name, phone, profile image *(Protected)*
- `PUT  /api/auth/change-password` – Change account password *(Protected)*

### Events (`/api/events`)
- `GET    /api/events` – Browse events (Supports `search`, `category`, `location`, `sort`, `page`)
- `GET    /api/events/meta` – Get list of distinct categories and locations
- `GET    /api/events/:id` – Get single event details & ticket tiers
- `GET    /api/events/my` – Get organizer's created events & sales stats *(Organizer/Admin)*
- `POST   /api/events` – Create new event *(Organizer/Admin)*
- `PUT    /api/events/:id` – Update event details *(Organizer/Admin)*
- `DELETE /api/events/:id` – Delete event *(Organizer/Admin)*

### Bookings & Checkout (`/api/bookings`)
- `POST /api/bookings` – Book tickets, trigger QR ticket generation & simulated payment *(Protected)*
- `GET  /api/bookings/my` – Get logged-in user's bookings with digital QR passes *(Protected)*
- `GET  /api/bookings/:id` – Get booking summary by ID *(Protected)*
- `POST /api/bookings/:id/cancel` – Cancel booking, restore capacities & process refund *(Protected)*
- `GET  /api/bookings/organizer` – Get sales orders for organizer's events *(Organizer/Admin)*
- `GET  /api/bookings/admin` – Global bookings list *(Admin)*

### Tickets & QR Gate Verification (`/api/tickets`)
- `GET  /api/tickets/booking/:bookingId` – Get individual tickets & QR codes for a booking *(Protected)*
- `POST /api/tickets/verify` – Scan/lookup ticket code for gate verification *(Organizer/Admin)*
- `POST /api/tickets/checkin` – Confirm attendee gate entry & mark ticket used *(Organizer/Admin)*
- `GET  /api/tickets/event/:eventId/attendees` – Attendee check-in roster *(Organizer/Admin)*

### Admin Management (`/api/admin`)
- `GET    /api/admin/stats` – Revenue metrics, category breakdown, KPI analytics *(Admin)*
- `GET    /api/admin/users` – Search & filter all users *(Admin)*
- `PATCH  /api/admin/users/:id/status` – Activate / Deactivate user *(Admin)*
- `PATCH  /api/admin/users/:id/role` – Update user role *(Admin)*
- `DELETE /api/admin/users/:id` – Delete user *(Admin)*
- `GET    /api/admin/logs` – View platform security audit trail *(Admin)*
- `GET    /api/admin/settings` – View platform settings *(Admin)*
- `POST   /api/admin/settings` – Save platform fee & configurations *(Admin)*

---

## 🎨 Technology Highlights & Features

- **Encrypted QR Codes**: Generated on backend via `qrcode` with visual presentation using high-contrast themes.
- **Device Camera Scanner**: Real-time venue scanning powered by `html5-qrcode`.
- **Celebration Effects**: Interactive post-booking confetti using `canvas-confetti`.
- **Responsive UI**: Hand-crafted CSS token design system with glassmorphism, responsive grid layouts, and custom animations.
- **Audit Logging**: Every critical action (logins, bookings, cancellations, check-ins) is logged in the `ActivityLog` collection.
