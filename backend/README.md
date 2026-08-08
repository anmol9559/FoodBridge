# 🍲 FoodBridge Backend API

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg?style=flat&logo=nodedotjs)
![Express.js](https://img.shields.io/badge/Express.js-v5.0-black.svg?style=flat&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-5A67D8.svg?style=flat&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1.svg?style=flat&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)

FoodBridge is a backend RESTful API platform designed to bridge the gap between food donors (Restaurants) and non-profit organizations (NGOs). By facilitating surplus food donations, real-time reservations, and pickup workflows, FoodBridge reduces food waste and helps distribute fresh meals to communities in need.

---

## 📌 Problem & Solution

- **The Problem**: Tons of edible surplus food prepared by restaurants and food businesses go to waste daily due to lack of real-time coordination with charitable distribution networks.
- **The Solution**: FoodBridge provides a real-time, secure, role-based platform where restaurants publish surplus food donations, NGOs browse and reserve available meals, and platform administrators monitor food distribution analytics.

---

## 👥 Main Platform Actors

- **🏢 Restaurant**: Publishes food donations, specifies quantity, meal types, expiration dates, and manages incoming NGO reservation requests (confirming or rejecting bookings).
- **🤝 NGO**: Browses non-expired available food donations in real time, reserves meals, tracks pickup statuses, and confirms pickup completion.
- **🛡️ Admin**: Monitors platform-wide analytics (active restaurants, NGOs, donations, reservations) and manages organizational listings.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration**: Register user accounts with associated organizational profiles (Restaurant or NGO).
- **User Login**: Secure authentication issuing signed JSON Web Tokens (JWT).
- **JWT Authentication**: Protected API access using `Bearer` token verification.
- **Role-Based Access Control (RBAC)**: Fine-grained permission enforcement (`RESTAURANT`, `NGO`, `ADMIN`, `RECYCLER`).

### 🍕 Restaurant Management
- **Create Donation**: Publish surplus food items with details such as meal type, packaging, quantity, and expiration.
- **View My Donations**: Paginated listing of donations created by the authenticated restaurant.
- **Update Donation**: Partial update of donation details (gated exclusively to `AVAILABLE` status).
- **Delete Donation**: Soft deletion of donations (`deletedAt` timestamp).
- **View Incoming Reservations**: Monitor reservation requests submitted for owned food donations.
- **Confirm Reservation**: Atomic state transition from `PENDING` to `CONFIRMED`.
- **Reject Reservation**: Atomic rejection (`PENDING` → `CANCELLED`), releasing the donation back to `AVAILABLE`.

### 🛟 NGO Workflows
- **Browse Available Donations**: Filtered feed returning active, non-deleted, non-expired (`expiresAt > now()`) donations.
- **Reserve Donation**: Atomic reservation creation, linking NGO organization and setting donation to `RESERVED`.
- **View My Reservations**: Paginated list of reservations placed by the authenticated NGO.
- **Complete Pickup**: Mark confirmed reservations as `COMPLETED`, updating donation status to `COMPLETED`.

### 📊 Admin Analytics & Platform Overview
- **Dashboard Statistics**: Aggregate transactional count queries for organizations, donations, and reservations.
- **Manage Restaurants**: Searchable, paginated directory of registered restaurant organizations and owner details.
- **Manage NGOs**: Searchable, paginated directory of registered NGO organizations and owner details.
- **View Donations**: Comprehensive platform-wide food donation audit feed.
- **View Reservations**: Comprehensive platform-wide reservation tracking log with status filters.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [MySQL](https://www.mysql.com/) / [MariaDB](https://mariadb.org/)
- **ORM**: [Prisma ORM](https://www.prisma.io/) (v7)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: [JSONWebToken (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dherault/bcryptjs)
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)

---

## 📁 Project Structure

```text
backend/
├── prisma/
│   ├── migrations/             # Database SQL migration files
│   └── schema.prisma           # Prisma data models & enums
├── src/
│   ├── config/
│   │   └── env.js              # Zod-validated environment variables
│   ├── lib/
│   │   └── prisma.js           # Prisma Client & MariaDB adapter instance
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT Bearer token authentication
│   │   ├── errorHandler.js    # Global 404 and Error handling middlewares
│   │   ├── role.middleware.js  # Role-Based Access Control (RBAC)
│   │   └── validate.middleware.js # Reusable route parameter validation
│   ├── modules/
│   │   ├── admin/              # Admin services, controllers & validations
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.service.js
│   │   │   └── admin.validation.js
│   │   ├── auth/               # Authentication services & schemas
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   └── donation/           # Donation & Reservation business logic
│   │       ├── donation.controller.js
│   │       ├── donation.service.js
│   │       └── donation.validation.js
│   ├── routes/                 # Express API router declarations
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── health.routes.js
│   │   ├── ngo.routes.js
│   │   ├── recycler.routes.js
│   │   └── restaurant.routes.js
│   ├── app.js                  # Express middleware setup & route mounting
│   └── server.js               # HTTP server entrypoint & graceful shutdown
├── package.json
└── README.md
```

---

## ⚙️ Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/foodbridge-backend.git
cd foodbridge-backend/backend
```

### 2. Install Dependencies
```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` root directory:

```env
# Server Port & Environment
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:3000

# Database Connection
DATABASE_URL="mysql://username:password@localhost:3306/foodbridge_db"

# JWT Authentication Configuration
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
```

---

## 🗄️ Prisma Database Setup

Apply database migrations and generate the Prisma Client:

```bash
# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# (Optional) Open Prisma Studio GUI
npx prisma studio
```

---

## 🚀 Running the Server

```bash
# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start

# Run linter checks
npm run lint
```

---

## 📑 API Overview

### 🔐 Authentication Routes (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register new user and organization
- `POST /api/v1/auth/login` — Authenticate user and issue JWT access token
- `GET /api/v1/auth/me` — Get current user profile

### 🍕 Restaurant Routes (`/api/v1/restaurant`)
- `POST /api/v1/restaurant/donations` — Create a new food donation
- `GET /api/v1/restaurant/donations` — List restaurant's own donations
- `GET /api/v1/restaurant/donations/:id` — View specific donation details
- `PUT /api/v1/restaurant/donations/:id` — Update donation (if status is `AVAILABLE`)
- `DELETE /api/v1/restaurant/donations/:id` — Soft-delete food donation
- `GET /api/v1/restaurant/reservations` — List incoming reservation requests
- `PATCH /api/v1/restaurant/reservations/:id/confirm` — Confirm pending reservation
- `PATCH /api/v1/restaurant/reservations/:id/reject` — Reject pending reservation

### 🛟 NGO Routes (`/api/v1/ngo`)
- `GET /api/v1/ngo/donations` — Browse active available donations feed
- `POST /api/v1/ngo/donations/:id/reserve` — Reserve available food donation
- `GET /api/v1/ngo/reservations` — List NGO's reservations
- `PATCH /api/v1/ngo/reservations/:id/complete` — Mark confirmed reservation pickup as completed

### 🛡️ Admin Routes (`/api/v1/admin`)
- `GET /api/v1/admin/dashboard` — Platform overview statistics
- `GET /api/v1/admin/restaurants` — List & search restaurant organizations
- `GET /api/v1/admin/ngos` — List & search NGO organizations
- `GET /api/v1/admin/donations` — Audit platform food donations
- `GET /api/v1/admin/reservations` — Audit platform reservations

### 🏥 Health Route (`/health`)
- `GET /health` — API health check status

---

## 🗃️ Database Entities

- **`User`**: System user account with email, password hash, role (`RESTAURANT`, `NGO`, `ADMIN`, `RECYCLER`), and organization relation.
- **`Organization`**: Business entity profile (Restaurant or NGO) containing name, type, registration number, and contact info.
- **`FoodDonation`**: Surplus food posting containing quantity, meal type, food type, pickup address, creation, and expiration timestamps (`expiresAt`).
- **`Reservation`**: Booking link connecting a `FoodDonation` to an `Organization` (NGO) and `User` with lifecycle status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `EXPIRED`).
- **`RefreshToken`**: Session security tokens stored for refresh token generation and user revocation.

---

## 🔄 Reservation Workflow

### 1. Successful Pickup Flow
```text
Restaurant                NGO                   Restaurant                 NGO
   │                       │                         │                      │
   ├── Create Donation ───►│                         │                      │
   │  (status: AVAILABLE)  │                         │                      │
   │                       ├── Reserve Donation ────►│                      │
   │                       │   (status: RESERVED)    │                      │
   │                       │                         ├── Confirm Request ──►│
   │                       │                         │  (status: CONFIRMED) │
   │                       │                         │                      ├── Complete Pickup
   │                       │                         │                      │  (status: COMPLETED)
```

### 2. Rejection Flow
```text
Restaurant                NGO                   Restaurant
   │                       │                         │
   ├── Create Donation ───►│                         │
   │  (status: AVAILABLE)  │                         │
   │                       ├── Reserve Donation ────►│
   │                       │   (status: RESERVED)    │
   │                       │                         └── Reject Request
   │                       │                             (reservation: CANCELLED)
   │                       │                             (donation: AVAILABLE)
```

---

## 🛡️ Security Implementation

- **JWT Authentication**: State-less authentication using Bearer tokens verified on each protected request.
- **Bcrypt Password Hashing**: Passwords stored using 12 salt rounds.
- **Role-Based Access Control**: Strict role verification (`requireRole`) preventing cross-role resource manipulation.
- **Input & Parameter Validation**: Zod schemas validate both query/body payloads and URL parameters (`:id`) prior to execution.
- **Soft Deletion**: Soft deletes (`deletedAt = now()`) ensure historical data integrity and prevent accidental cascade deletions.
- **Rate Limiting**: `express-rate-limit` prevents brute-force login and spam registration attacks.
- **HTTP Security Headers**: `helmet()` and restrictive CORS configuration.

---

## 🔮 Future Enhancements

- 📸 **Cloudinary Image Uploads**: Direct image binary upload integration for food donation photographs.
- ✉️ **Nodemailer Notifications**: Email alerts on reservation confirmation, rejection, and pickup reminders.
- ♻️ **Recycler Module**: Waste collection claim endpoints for spoiled or uncollected food waste recycling.
- ⚡ **Redis Caching**: Caching frequently accessed available donation feeds and user authentication checks.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**FoodBridge Engineering Team**  
*Built with ❤️ for zero food waste.*
