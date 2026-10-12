# 🕶️ Drishti Atelier — Premium Eyewear E-Commerce

> Bangladesh's premier luxury eyewear platform. Built with React, Express, PostgreSQL, and Cloudinary.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Customer
- 🛍️ Browse products with search, filter (category, shape, material, price), and sorting
- 🔍 Detailed product pages with image gallery, specifications, and reviews
- 🛒 Full shopping cart (add, update quantity, remove)
- ❤️ Wishlist management
- 📦 Checkout with address management and coupon codes
- 📜 Order history and tracking
- 👤 Profile management with Google OAuth login
- ⭐ Product reviews and ratings

### Admin Panel
- 📊 Real-time dashboard with revenue, orders, and user analytics
- 📦 Full product CRUD with multi-image upload (Cloudinary)
- 👥 User management (activate/deactivate accounts)
- 🏷️ Category & subcategory management
- 🎟️ Coupon management (percentage/fixed, usage limits, expiry)
- 📋 Order management with status workflow (pending → confirmed → processing → shipped → delivered)
- ⭐ Review moderation (approve/hide/delete)
- ⚙️ Site settings (SEO, social links, shipping fees, contact info)

### Security
- 🔒 JWT with issuer/audience validation
- 🛡️ Rate limiting (auth: 10/15min, API: 300/15min)
- 🔐 Account lockout after 5 failed login attempts
- 🔑 Helmet security headers
- 📁 Secure file uploads (crypto filenames, extension whitelist)
- ✅ Parameterized SQL queries (no SQL injection)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, Vite 6 |
| **Styling** | Vanilla CSS (dark editorial theme) |
| **Backend** | Node.js, Express 5 |
| **Database** | PostgreSQL (Neon serverless) |
| **Auth** | JWT + Google OAuth 2.0 |
| **Images** | Cloudinary |
| **Icons** | React Icons (Heroicons) |

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────┐
│  React Frontend │ ───▶ │  Express Backend │ ───▶ │   Neon DB     │
│  (Vite SPA)     │      │  (REST API)      │      │  (PostgreSQL) │
└─────────────────┘      └──────────────────┘      └───────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  Cloudinary  │
                         │  (Images)    │
                         └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **PostgreSQL** database (recommended: [Neon](https://neon.tech))
- **Cloudinary** account (free tier works)
- **Google Cloud** project (for OAuth)

### Clone

```bash
git clone https://github.com/misbah7172/Drishti-Atelier-Business.git
cd Drishti-Atelier-Business
```

### Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# Database
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# JWT (REQUIRED — must be 32+ characters)
JWT_SECRET=your-secure-random-string-minimum-32-chars
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Client URL (comma-separated for multiple origins)
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🗄️ Database Setup

```bash
# 1. Create your database on Neon (or local PostgreSQL)
# 2. Run the schema
psql $DATABASE_URL -f database/schema.sql

# 3. Run the seed data
psql $DATABASE_URL -f database/seed.sql

# 4. Run migrations (if first time)
cd server
node migrate-settings.js
node migrate-phase13.js
```

### Default Accounts (from seed.sql)

| Role | Email | Password |
|---|---|---|
| Admin | admin@drishtiatelier.com | Admin@123 |
| Customer | rahim@example.com | Customer@123 |

---

## 💻 Running Locally

```bash
# Terminal 1 — Backend
cd server
npm run dev    # or: npx nodemon server.js

# Terminal 2 — Frontend
cd client
npm run dev    # Opens at http://localhost:5173
```

---

## 🌐 Deployment

### Backend (Render)

1. Create a **Web Service** on [Render](https://render.com)
2. Set **Root Directory**: `server`
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. Add all environment variables from the `.env` section above
6. Set `NODE_ENV=production` and `CLIENT_URL=https://your-frontend.vercel.app`

### Frontend (Vercel)

1. Import repo on [Vercel](https://vercel.com)
2. Set **Root Directory**: `client`
3. **Framework Preset**: Vite
4. Add environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID=your-google-client-id`

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (email/phone + password) |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/google` | Google OAuth login |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (paginated, filterable) |
| GET | `/api/products/:id` | Get product detail |
| GET | `/api/products/bestsellers` | Get bestsellers |

### Cart & Wishlist
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist` | Toggle wishlist |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | List user's orders |
| GET | `/api/orders/:id` | Get order detail |

### Admin (requires admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard analytics |
| GET/POST/PUT/DELETE | `/api/admin/products` | Product CRUD |
| GET | `/api/admin/users` | List users |
| PUT | `/api/admin/users/:id/status` | Toggle user status |
| GET | `/api/admin/orders` | List all orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| GET/POST/PUT/DELETE | `/api/admin/categories` | Category CRUD |
| GET/POST/PUT/DELETE | `/api/admin/coupons` | Coupon CRUD |
| GET/DELETE | `/api/admin/reviews` | Review moderation |
| GET/PUT | `/api/admin/settings` | Site settings |

### Public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter` | Subscribe to newsletter |
| GET | `/api/settings` | Get public site settings |

---

## 📁 Project Structure

```
Drishti/
├── client/                    # React frontend (Vite)
│   ├── public/                # Static assets, robots.txt
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Footer/
│   │   │   ├── Navbar/
│   │   │   ├── ProductCard/
│   │   │   ├── SEO/
│   │   │   ├── Skeleton/
│   │   │   └── ...
│   │   ├── context/           # React context (Auth, Cart, Wishlist, Theme)
│   │   ├── layouts/           # MainLayout, AdminLayout
│   │   ├── pages/             # Route pages
│   │   │   ├── Admin/         # Admin panel pages
│   │   │   ├── Auth/          # Login, Register
│   │   │   ├── Home/          # Landing page
│   │   │   ├── Shop/          # Product catalog
│   │   │   └── ...
│   │   ├── services/          # API service layer
│   │   └── styles/            # Global CSS
│   └── index.html
├── server/                    # Express backend
│   ├── config/                # Cloudinary config
│   ├── controllers/           # Route handlers
│   ├── db/                    # Database pool
│   ├── middleware/            # Auth, admin, upload middleware
│   ├── routes/                # API route definitions
│   └── server.js              # Entry point
├── database/                  # SQL files
│   ├── schema.sql             # Full schema (20 tables)
│   └── seed.sql               # Sample data
└── docs/                      # Documentation
    └── implementation_plan.md
```

---

## 📊 Database Schema

20 tables including:
- `users` — Authentication and profiles
- `products` — Product catalog with variants
- `categories` / `subcategories` — Taxonomy
- `product_images` — Multi-image support
- `orders` / `order_items` — Order management
- `order_status_history` — Status audit trail
- `cart_items` / `wishlist_items` — Shopping state
- `reviews` — Product reviews with ratings
- `coupons` / `coupon_usages` — Discount system
- `addresses` — User shipping addresses
- `site_settings` — Admin-configurable settings
- `contact_messages` / `newsletter_subscribers` — Public forms
- `audit_logs` — Admin action tracking

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <strong>Drishti Atelier</strong> — Architectural Luxury Eyewear<br>
  Built with ❤️ in Dhaka, Bangladesh
</p>
