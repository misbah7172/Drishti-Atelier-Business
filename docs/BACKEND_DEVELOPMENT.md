# Drishti — Backend Development Guide (Phase-by-Phase)

## How to Use This File

This file contains **backend-only work** — separated from the full-stack `DEVELOPMENT_PHASES.md`.
The backend is designed to **match the existing frontend exactly** so you never need to rewrite frontend code.

### References

- `BUILD_GUIDE.md` — complete project requirements and technical rules
- `DEVELOPMENT_PHASES.md` — full-stack execution order
- `BACKEND_DEVELOPMENT.md` — this file (backend-only phases)

### Rules

- Complete **one phase at a time**. Do not skip ahead.
- Test every phase before moving to the next.
- Every API response shape documented here is designed to match what the frontend components already consume.
- Do not change any existing frontend component props or data shapes — the backend must serve data the frontend already expects.

---

## Existing Frontend ↔ Backend Contract

Before building anything, understand what the frontend already uses:

### Frontend Data Source (Currently Static)

The frontend currently imports products from `client/src/services/productData.js` — a static JS file.
Your backend must serve data in a compatible shape so migrating from static to API requires minimal frontend changes.

The `ProductDetail` page uses the full product object:

```text
id, slug, name, code,
category      → string slug   (e.g. "sunglasses")
categoryLabel → string        (e.g. "Sunglasses")
price, comparePrice,
material      → string        (e.g. "Japanese Grade-5 Titanium")
shape         → string        (e.g. "Aviator")
gender        → string        (e.g. "Unisex")
image, hoverImage,
gallery[]     → array of { id, label, src, caption }
colors[]      → array of { name, hex }
badge,
weight, lensWidth, bridgeWidth, templeLength, lensType,
description,
features[]    → array of strings
stock         → integer
featured      → boolean
```

### Shop Page Filter Parameters

The `Shop.jsx` currently filters client-side using these keys:

```text
category   → slug string ("sunglasses", "prescription-glasses", "blue-light-glasses")
shape      → string ("Aviator", "Rectangle", "Round", "Statement")
material   → string ("Titanium", "Acetate", "Metal")
search     → free text
sort       → "featured", "price-low", "price-high", "newest"
```

### Frontend API Layer

`client/src/services/api.js` is already configured:
- Uses `axios` with `VITE_API_URL` or `/api` as base URL
- Auto-attaches JWT from `localStorage.getItem('token')`
- Intercepts 401 responses and clears the token
- All requests include `withCredentials: true`

### Frontend Routes Already Defined

```text
Public:
  /                          → Home
  /shop                      → Shop (with query params: ?category, ?search, ?shape)
  /product/:id               → Product Detail (uses integer ID)
  /about, /contact, /faq     → Static pages (placeholder)
  /login                     → Login (placeholder)
  /register                  → Register (placeholder)

Customer (placeholder):
  /cart                      → Cart
  /wishlist                  → Wishlist
  /checkout                  → Checkout
  /order-success/:id         → Order Confirmation
  /account                   → Account Dashboard
  /account/orders            → Order History
  /account/orders/:id        → Order Details

Admin (placeholder):
  /admin                     → Admin Dashboard
  /admin/products            → Product List
  /admin/products/new        → Add Product
  /admin/products/:id        → Edit Product
  /admin/users               → Users
  /admin/orders              → Orders
  /admin/orders/:id          → Order Details
  /admin/categories          → Categories
  /admin/coupons             → Coupons
  /admin/reviews             → Reviews
```

### Navbar State Hooks (Waiting for Context)

```js
// In Navbar.jsx — currently hardcoded, waiting for backend connection:
const cartCount = 0;      // Will connect to CartContext
const wishlistCount = 0;  // Will connect to WishlistContext
```

---

## Already Completed (Foundation)

```text
✅ server/server.js             — Entry point
✅ server/app.js                — Express app, middleware, health check, error handler
✅ server/db/pool.js            — Neon PostgreSQL connection pool
✅ server/config/cloudinary.js  — Cloudinary config
✅ server/package.json          — All backend dependencies installed
✅ database/schema.sql          — Full schema (19 tables, indexes, triggers)
✅ database/seed.sql            — 24 products, 7 categories, subcategories, tags, admin account
✅ database/setup.js            — Schema + seed runner
```

Routes are commented out in `app.js`. Uncomment each as you build its phase.

---

# Backend Phase 1 — Database Setup & Verification

### Goal

Run the schema and seed data. Verify the database is populated and the server connects.

### Steps

1. Set `DATABASE_URL` in `.env` (Neon PostgreSQL connection string)
2. Run `node database/setup.js` to create tables + seed data
3. Start the server with `npm run dev` from `/server`
4. Test `GET http://localhost:5000/api/health`

### Verify

```bash
# Start server
cd server && npm run dev
# Expected output: ✅ Database connected successfully

# Health check
curl http://localhost:5000/api/health
```

### Test Checklist

- [ ] All 19 tables exist in Neon
- [ ] 7 categories seeded
- [ ] 24 products seeded
- [ ] Tags seeded
- [ ] Admin account exists
- [ ] Indexes and triggers created
- [ ] Server starts without errors
- [ ] Health check returns `{ status: "ok" }`

---

# Backend Phase 2 — Authentication System

### Goal

Register, login, JWT tokens, auth middleware, admin middleware.

### Files to Create

```text
server/
├── controllers/authController.js
├── middleware/auth.js                — JWT verification
├── middleware/adminAuth.js           — Admin role check
├── routes/auth.js
└── utils/generateToken.js           — JWT helper
```

### Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Create customer account |
| POST | `/api/auth/login` | Public | Login, return JWT + user |
| GET | `/api/auth/me` | Token | Get current user profile |
| POST | `/api/auth/logout` | Token | Logout (client clears token) |

### Register — `POST /api/auth/register`

**Request:**
```json
{
  "name": "Rakib Ahmed",
  "email": "rakib@example.com",
  "phone": "01712345678",
  "password": "secure123"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Rakib Ahmed",
      "email": "rakib@example.com",
      "phone": "01712345678",
      "role": "customer",
      "is_active": true,
      "created_at": "2026-09-28T..."
    },
    "token": "eyJhbGciOi..."
  }
}
```

**Logic:**
1. Validate required fields (name, email, password)
2. Validate email format
3. Check duplicate email → 409
4. Hash password with `bcryptjs` (10 salt rounds)
5. Insert into `users` (role = `'customer'`)
6. Generate JWT `{ id, email, role }` with `JWT_SECRET`, expires in `JWT_EXPIRES_IN`
7. Return user (never include `password_hash`) + token

### Login — `POST /api/auth/login`

**Request:**
```json
{
  "email": "rakib@example.com",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": { "id": 1, "name": "...", "email": "...", "role": "customer", "is_active": true },
    "token": "eyJhbGciOi..."
  }
}
```

**Logic:**
1. Find user by email → 401 if not found
2. Check `is_active` → 403 if disabled
3. Compare password with `bcryptjs` → 401 if wrong
4. Generate JWT → return user + token

### Auth Middleware — `server/middleware/auth.js`

**The frontend sends:** `Authorization: Bearer <token>` (set by `api.js` interceptor from `localStorage`)

```text
1. Extract token from Authorization header
2. jwt.verify(token, JWT_SECRET)
3. Query user by decoded id
4. Attach req.user = { id, name, email, role, is_active }
5. next() or 401
```

### Admin Middleware — `server/middleware/adminAuth.js`

```text
Runs AFTER auth middleware.
Check req.user.role === 'admin' → next() or 403
```

### Wire Up

In `server/app.js`, uncomment:
```js
app.use('/api/auth', require('./routes/auth'));
```

### Test Checklist

- [ ] Register → 201 + token + user data (no password_hash)
- [ ] Register duplicate email → 409
- [ ] Register missing fields → 400
- [ ] Login valid → 200 + token
- [ ] Login wrong password → 401
- [ ] Login non-existent email → 401
- [ ] Login disabled account → 403
- [ ] `GET /api/auth/me` with valid token → 200 + user
- [ ] `GET /api/auth/me` without token → 401
- [ ] `GET /api/auth/me` with invalid token → 401
- [ ] Admin seed account can login with `role: "admin"`

> **Frontend note:** The frontend stores the token with `localStorage.setItem('token', token)`.
> The `api.js` interceptor auto-attaches it to every request. Your backend just needs to read `Authorization: Bearer <token>`.

---

# Backend Phase 3 — Categories API

### Goal

Serve categories and subcategories that match the category slugs the frontend already uses.

### Files to Create

```text
server/
├── controllers/categoryController.js
└── routes/categories.js
```

### Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/categories` | Public | All active categories |
| GET | `/api/categories/:id` | Public | Single category + subcategories |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |
| GET | `/api/categories/:id/subcategories` | Public | Subcategories list |
| POST | `/api/subcategories` | Admin | Create subcategory |
| PUT | `/api/subcategories/:id` | Admin | Update subcategory |
| DELETE | `/api/subcategories/:id` | Admin | Delete subcategory |

### Category List Response — `GET /api/categories`

**Critical:** The frontend `TopCategories` component and `Shop.jsx` use these exact category slugs:

```text
"sunglasses"
"prescription-glasses"
"blue-light-glasses"
```

The navbar links go to `/shop?category=sunglasses`, etc.

**Response:**
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Sunglasses",
        "slug": "sunglasses",
        "description": "...",
        "image_url": null,
        "is_active": true,
        "sort_order": 1,
        "product_count": 8
      }
    ]
  }
}
```

### Business Rules

- Public endpoints return only `is_active = true`
- Admin endpoints return all
- Cannot delete category with products → 409
- Slug auto-generated from name

### Wire Up

```js
app.use('/api/categories', require('./routes/categories'));
```

### Test Checklist

- [ ] `GET /api/categories` returns seeded categories
- [ ] Response includes `product_count`
- [ ] Category slugs match frontend: `sunglasses`, `prescription-glasses`, `blue-light-glasses`
- [ ] `GET /api/categories/:id` returns category + subcategories
- [ ] Admin CRUD works
- [ ] Non-admin cannot create/update/delete → 403
- [ ] Delete category with products → 409

---

# Backend Phase 4 — Products API

### Goal

Serve products in the exact shape the frontend components consume. Support search, filters, sort, and pagination.

### Files to Create

```text
server/
├── controllers/productController.js
├── controllers/productImageController.js
├── routes/products.js
├── middleware/upload.js                   — Multer config
└── services/cloudinaryService.js          — Upload/delete helpers
```

### Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/products` | Public | List with filters/search/sort/pagination |
| GET | `/api/products/:id` | Public | Single product with full details |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product + images |
| POST | `/api/products/:id/images` | Admin | Upload images |
| DELETE | `/api/products/:id/images/:imageId` | Admin | Delete image |

### Product List — `GET /api/products`

**Query parameters (matching what Shop.jsx will send):**

```text
?search=rayban                 — Full-text search (name, brand, description, sku)
?category=sunglasses           — Filter by category SLUG (not id!)
?subcategory=aviator-sunglasses — Filter by subcategory slug
?gender=men                    — gender field
?frame_shape=Aviator           — frame_shape field
?frame_material=Titanium       — frame_material (partial match)
?frame_color=black             — frame_color field
?min_price=500                 — price >= min
?max_price=5000                — price <= max
?featured=true                 — featured products
?bestseller=true               — bestseller products
?new_arrival=true              — new arrivals
?status=active                 — (public defaults to active)
?sort=price-low                — Sort options (matching frontend select values):
                                   "featured"   → featured DESC, created_at DESC
                                   "price-low"  → price ASC
                                   "price-high" → price DESC
                                   "newest"     → created_at DESC
?page=1                        — default 1
?limit=12                      — default 12, max 50
```

> **IMPORTANT:** The frontend `Shop.jsx` filters by category **slug**, not category ID.
> The sort values are `"featured"`, `"price-low"`, `"price-high"`, `"newest"` — match these exactly.

**Response shape:**

```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Classic Aviator Sunglasses",
        "slug": "classic-aviator-sunglasses",
        "code": null,
        "sku": "VEC-SUN-001",
        "short_description": "Timeless aviator with UV400 polarized lenses",
        "price": 2450.00,
        "compare_price": 3200.00,
        "stock": 45,
        "category_slug": "sunglasses",
        "category_name": "Sunglasses",
        "brand": "Drishti Elite",
        "frame_material": "Metal",
        "frame_shape": "Aviator",
        "frame_color": "Gold",
        "gender": "unisex",
        "status": "active",
        "featured": true,
        "bestseller": true,
        "new_arrival": false,
        "image": "https://res.cloudinary.com/.../primary.jpg",
        "hover_image": "https://res.cloudinary.com/.../secondary.jpg",
        "badge": "Best Seller",
        "created_at": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalItems": 24,
      "totalPages": 2
    }
  }
}
```

**Badge logic (computed on backend):**
```text
if featured → "Featured"
if bestseller → "Best Seller"
if new_arrival → "New Arrival"
else → null
```

**Image fields:**
- `image` = primary image URL (`product_images` where `is_primary = true`)
- `hover_image` = second image URL (`product_images` sorted by `sort_order`, second item)
- If no images uploaded yet, return product placeholder or null

### Single Product — `GET /api/products/:id`

**Full response matching `ProductDetail.jsx` expectations:**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 1,
      "name": "Classic Aviator Sunglasses",
      "slug": "classic-aviator-sunglasses",
      "code": null,
      "sku": "VEC-SUN-001",
      "description": "Full description...",
      "short_description": "Short desc...",
      "price": 2450.00,
      "compare_price": 3200.00,
      "stock": 45,
      "low_stock_threshold": 5,
      "category": "sunglasses",
      "category_label": "Sunglasses",
      "subcategory": "aviator-sunglasses",
      "subcategory_label": "Aviator",
      "brand": "Drishti Elite",
      "frame_material": "Metal",
      "frame_shape": "Aviator",
      "frame_color": "Gold",
      "gender": "unisex",
      "size": "Medium",
      "status": "active",
      "featured": true,
      "bestseller": true,
      "new_arrival": false,
      "badge": "Best Seller",
      "image": "https://...",
      "hover_image": "https://...",
      "gallery": [
        {
          "id": 1,
          "label": "Front View",
          "src": "https://res.cloudinary.com/.../image1.jpg",
          "caption": "Front view of Classic Aviator"
        }
      ],
      "colors": [],
      "tags": ["Trending", "Premium"],
      "features": [],
      "weight": null,
      "lens_width": null,
      "bridge_width": null,
      "temple_length": null,
      "lens_type": null,
      "reviews": {
        "average_rating": 4.5,
        "total_reviews": 12,
        "distribution": { "5": 6, "4": 3, "3": 2, "2": 1, "1": 0 }
      },
      "created_at": "..."
    },
    "related_products": [...]
  }
}
```

> **Note on `gallery`, `colors`, `features`, and spec fields:**
> The frontend `ProductDetail.jsx` reads `product.gallery`, `product.colors`, `product.features`, `product.weight`, etc.
> The database schema doesn't have dedicated columns for colors/features/weight/lens specs.
> **Options (pick one):**
> 1. **Recommended:** Map existing DB fields into the expected shape:
>    - `gallery` → build from `product_images` table: `[{ id: img.id, label: img.alt_text || "View N", src: img.image_url, caption: img.alt_text }]`
>    - `colors` → return empty array `[]` (or add a `product_colors` table later)
>    - `features` → parse from description or return `[]` (or add a `product_features` JSON column later)
>    - `weight`, `lens_width`, etc. → return null (or add columns to products table)
>    - `badge` → compute from `featured`/`bestseller`/`new_arrival` flags
> 2. **Alternative:** Add columns to `products` table for `weight`, `lens_type`, `lens_width`, `bridge_width`, `temple_length` and a `product_features` table or JSONB column.

### Cloudinary Image Upload

- Multer for multipart handling
- Cloudinary folder: `drishti/products`
- Store `image_url` + `cloudinary_public_id` in `product_images`
- Validate: jpeg/png/webp, max 5MB
- On product delete → delete all Cloudinary images

### Wire Up

```js
app.use('/api/products', require('./routes/products'));
```

### Test Checklist

- [ ] `GET /api/products` returns paginated product list
- [ ] Filter by `?category=sunglasses` works (uses slug, not ID)
- [ ] Filter by `?frame_shape=Aviator` works
- [ ] Filter by `?gender=men` works
- [ ] Filter by `?min_price=1000&max_price=3000` works
- [ ] Search by `?search=aviator` works
- [ ] Sort `?sort=price-low` works
- [ ] Sort `?sort=newest` works
- [ ] Pagination works (`page`, `limit`, `totalPages`, `totalItems`)
- [ ] `GET /api/products/:id` returns full product with gallery, reviews
- [ ] Product list includes `image` and `hover_image` from `product_images`
- [ ] Product list includes `badge` computed from flags
- [ ] Product list includes `category_slug` and `category_name`
- [ ] Admin CRUD works
- [ ] Cloudinary upload/delete works
- [ ] Non-admin cannot modify products → 403

---

# Backend Phase 5 — Cart API

### Goal

Authenticated cart with stock validation and backend-calculated totals.

### Files to Create

```text
server/
├── controllers/cartController.js
└── routes/cart.js
```

### Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/cart` | Token | Get cart with details + totals |
| POST | `/api/cart` | Token | Add product to cart |
| PUT | `/api/cart/:id` | Token | Update item quantity |
| DELETE | `/api/cart/:id` | Token | Remove item |
| DELETE | `/api/cart` | Token | Clear entire cart |

### Get Cart — `GET /api/cart`

**Response (what the Cart page will consume):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 5,
        "product_name": "Classic Aviator Sunglasses",
        "product_slug": "classic-aviator-sunglasses",
        "price": 2450.00,
        "compare_price": 3200.00,
        "image_url": "https://...",
        "quantity": 2,
        "stock": 45,
        "status": "active",
        "subtotal": 4900.00
      }
    ],
    "summary": {
      "totalItems": 2,
      "subtotal": 4900.00
    }
  }
}
```

### Add to Cart — `POST /api/cart`

**Request:**
```json
{ "product_id": 5, "quantity": 1 }
```

**Logic:**
1. Product must exist and be `active`
2. Stock >= requested quantity
3. If already in cart → update quantity (sum)
4. Total quantity must not exceed stock
5. Return updated cart

### Business Rules

- Backend calculates `subtotal` = `price × quantity` — never trust frontend prices
- Flag out-of-stock items in response
- Quantity must be >= 1

### Wire Up

```js
app.use('/api/cart', require('./routes/cart'));
```

### Test Checklist

- [ ] Add product → 201
- [ ] Add same product → quantity increases
- [ ] Exceed stock → 400
- [ ] Update quantity → 200
- [ ] Remove item → 200
- [ ] Clear cart → 200
- [ ] Cart shows backend-calculated subtotals
- [ ] Unauthenticated → 401
- [ ] Inactive product → 400

---

# Backend Phase 6 — Wishlist API

### Goal

Authenticated wishlist — add, remove, list.

### Files to Create

```text
server/
├── controllers/wishlistController.js
└── routes/wishlist.js
```

### Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/wishlist` | Token | Get wishlist with product details |
| POST | `/api/wishlist` | Token | Add product |
| DELETE | `/api/wishlist/:productId` | Token | Remove product |

### Get Wishlist Response

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 5,
        "product_name": "Classic Aviator Sunglasses",
        "product_slug": "classic-aviator-sunglasses",
        "price": 2450.00,
        "compare_price": 3200.00,
        "image_url": "https://...",
        "stock": 45,
        "status": "active",
        "created_at": "..."
      }
    ],
    "totalItems": 1
  }
}
```

### Wire Up

```js
app.use('/api/wishlist', require('./routes/wishlist'));
```

### Test Checklist

- [ ] Add to wishlist → 201
- [ ] Duplicate → 409 or idempotent 200
- [ ] Remove → 200
- [ ] Get list with product details → 200
- [ ] Unauthenticated → 401

---

# Backend Phase 7 — Orders & Checkout

### Goal

Full order flow with database transaction, coupon validation, stock management.

### Files to Create

```text
server/
├── controllers/orderController.js
├── controllers/couponController.js
├── routes/orders.js
└── routes/coupons.js
```

### Endpoints — Orders

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/orders` | Token | Create order from cart |
| GET | `/api/orders` | Token | User's order history |
| GET | `/api/orders/:id` | Token | Order details (own only) |

### Endpoints — Coupons

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/coupons/validate` | Token | Validate coupon code |

### Create Order — `POST /api/orders`

**Request (matching the Checkout page form):**
```json
{
  "shipping_name": "Rakib Ahmed",
  "shipping_phone": "01712345678",
  "shipping_address": "House 15, Road 5, Dhanmondi",
  "shipping_city": "Dhaka",
  "shipping_area": "Dhanmondi",
  "shipping_postal_code": "1205",
  "payment_method": "cod",
  "coupon_code": "WELCOME10",
  "notes": "Please call before delivery"
}
```

### Order Creation Transaction (CRITICAL — Must Be Atomic)

```text
BEGIN TRANSACTION

  1. Validate authenticated user
  2. Load cart items with current product prices
  3. Cart must not be empty → 400
  4. For each item:
     a. SELECT product FOR UPDATE (row lock)
     b. Verify product is active → 400
     c. Verify stock >= quantity → 400
  5. Calculate subtotal from DB prices (NEVER trust frontend)
  6. If coupon_code:
     a. Validate coupon: exists, is_active, not expired, usage limit, min_order
     b. Calculate discount (percentage or fixed, apply max_discount cap)
  7. Calculate shipping_fee
  8. total = subtotal - discount + shipping_fee
  9. Generate order_number: DRS-{timestamp}-{random4}
 10. INSERT orders
 11. INSERT order_items (snapshot: product_name, price, image_url)
 12. UPDATE product stock (decrease)
 13. If coupon → INSERT coupon_usages + increment used_count
 14. DELETE cart_items for this user
 15. INSERT order_status_history (status: 'pending')
 16. INSERT payments (status: 'pending', method: 'cod')

COMMIT — Rollback everything if any step fails
```

### Order History — `GET /api/orders`

**Response (for Account → Order History page):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": 1,
        "order_number": "DRS-1727512345-A7K2",
        "subtotal": 4900.00,
        "discount": 490.00,
        "shipping_fee": 60.00,
        "total": 4470.00,
        "order_status": "pending",
        "payment_status": "pending",
        "payment_method": "cod",
        "item_count": 2,
        "created_at": "..."
      }
    ]
  }
}
```

### Order Details — `GET /api/orders/:id`

**Response (for Order Details page):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 1,
      "order_number": "DRS-1727512345-A7K2",
      "subtotal": 4900.00,
      "discount": 490.00,
      "shipping_fee": 60.00,
      "total": 4470.00,
      "order_status": "pending",
      "payment_status": "pending",
      "payment_method": "cod",
      "coupon_code": "WELCOME10",
      "shipping_name": "Rakib Ahmed",
      "shipping_phone": "01712345678",
      "shipping_address": "House 15, Road 5, Dhanmondi",
      "shipping_city": "Dhaka",
      "shipping_area": "Dhanmondi",
      "shipping_postal_code": "1205",
      "notes": "...",
      "created_at": "...",
      "items": [
        {
          "id": 1,
          "product_id": 5,
          "product_name": "Classic Aviator Sunglasses",
          "product_slug": "classic-aviator-sunglasses",
          "sku": "VEC-SUN-001",
          "price": 2450.00,
          "quantity": 2,
          "subtotal": 4900.00,
          "image_url": "https://..."
        }
      ],
      "status_history": [
        { "status": "pending", "note": "Order placed", "created_at": "..." }
      ]
    }
  }
}
```

**Security:** Customer can only view their own orders → 403/404 if not owner.

### Coupon Validation — `POST /api/coupons/validate`

**Request:**
```json
{ "code": "WELCOME10", "subtotal": 4900.00 }
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "code": "WELCOME10",
    "discount_type": "percentage",
    "discount_value": 10,
    "max_discount": 500,
    "calculated_discount": 490.00
  }
}
```

### Wire Up

```js
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
```

### Test Checklist

- [ ] Create order with valid cart → 201 + order_number
- [ ] Order items snapshot product name/price/image
- [ ] Stock decreased correctly
- [ ] Cart cleared after order
- [ ] Status history has 'pending' entry
- [ ] Empty cart → 400
- [ ] Insufficient stock → 400
- [ ] Invalid/expired coupon → 400
- [ ] Valid coupon → correct discount applied
- [ ] Transaction rollback on failure
- [ ] `GET /api/orders` returns user's orders
- [ ] `GET /api/orders/:id` → full order + items + status history
- [ ] Cannot view another user's order → 403/404

---

# Backend Phase 8 — Customer Account APIs

### Goal

Profile management, address CRUD, product reviews.

### Files to Create

```text
server/
├── controllers/userController.js
├── controllers/addressController.js
├── controllers/reviewController.js
├── routes/users.js
├── routes/addresses.js
└── routes/reviews.js
```

### Endpoints — Profile

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/users/profile` | Token | Get own profile |
| PUT | `/api/users/profile` | Token | Update name, phone |
| PUT | `/api/users/password` | Token | Change password |

### Endpoints — Addresses

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/addresses` | Token | User's addresses |
| POST | `/api/addresses` | Token | Create address |
| PUT | `/api/addresses/:id` | Token | Update address |
| DELETE | `/api/addresses/:id` | Token | Delete address |
| PUT | `/api/addresses/:id/default` | Token | Set as default |

### Endpoints — Reviews

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/products/:id/reviews` | Public | Product reviews + summary |
| POST | `/api/products/:id/reviews` | Token | Submit review |
| PUT | `/api/reviews/:id` | Token | Update own review |
| DELETE | `/api/reviews/:id` | Token | Delete own review |

### Review Rules

1. Must be authenticated
2. Must have purchased the product (check `order_items` where order `order_status = 'delivered'`)
3. One review per user per product (DB constraint)
4. Rating: 1–5 integer
5. Comment: optional text

### Product Reviews Response — `GET /api/products/:id/reviews`

```json
{
  "status": "success",
  "data": {
    "reviews": [
      {
        "id": 1,
        "user_name": "Rakib Ahmed",
        "rating": 5,
        "comment": "Excellent quality frames!",
        "created_at": "..."
      }
    ],
    "summary": {
      "average_rating": 4.5,
      "total_reviews": 12,
      "distribution": { "5": 6, "4": 3, "3": 2, "2": 1, "1": 0 }
    }
  }
}
```

### Wire Up

```js
app.use('/api/users', require('./routes/users'));
app.use('/api/addresses', require('./routes/addresses'));
// Reviews nested in products route file
```

### Test Checklist

- [ ] Get/update profile works
- [ ] Change password with correct old password → 200
- [ ] Change password with wrong old password → 400
- [ ] Address CRUD works
- [ ] Set default address works
- [ ] Can only access own data
- [ ] Submit review for delivered product → 201
- [ ] Review without purchase → 403
- [ ] Duplicate review → 409
- [ ] Review summary (avg + distribution) works

---

# Backend Phase 9 — Admin APIs

### Goal

Dashboard statistics, and full management CRUD for users, orders, coupons, and reviews.

### Files to Create

```text
server/
├── controllers/admin/
│   ├── dashboardController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── couponController.js
│   └── reviewController.js
└── routes/admin.js
```

All admin routes require `auth` + `adminAuth` middleware.

### Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats (real DB queries) |
| GET | `/api/admin/users` | User list (search, filter, paginate) |
| GET | `/api/admin/users/:id` | User details + order summary |
| PUT | `/api/admin/users/:id/status` | Enable/disable user |
| GET | `/api/admin/orders` | All orders (search, filter, paginate) |
| GET | `/api/admin/orders/:id` | Full order details |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| PUT | `/api/admin/orders/:id/payment` | Update payment status |
| GET | `/api/admin/coupons` | List all coupons |
| POST | `/api/admin/coupons` | Create coupon |
| PUT | `/api/admin/coupons/:id` | Update coupon |
| DELETE | `/api/admin/coupons/:id` | Delete coupon |
| GET | `/api/admin/reviews` | All reviews (filter, paginate) |
| DELETE | `/api/admin/reviews/:id` | Delete review |
| PUT | `/api/admin/reviews/:id/visibility` | Toggle visibility |

### Dashboard Response — `GET /api/admin/dashboard`

```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalSales": 125000.00,
      "totalOrders": 48,
      "totalCustomers": 35,
      "totalProducts": 52,
      "pendingOrders": 5,
      "lowStockProducts": 3
    },
    "recentOrders": [],
    "topProducts": [],
    "lowStockAlerts": []
  }
}
```

**All statistics from real database queries — no fake data.**

### Order Status Update

Must:
1. Validate status transition
2. Insert into `order_status_history`
3. Update `orders.order_status`

### Wire Up

```js
app.use('/api/admin', require('./routes/admin'));
```

### Test Checklist

- [ ] Dashboard returns real stats
- [ ] User list + search + pagination
- [ ] Enable/disable user
- [ ] Order list + filters
- [ ] Update order status + history recorded
- [ ] Update payment status
- [ ] Coupon CRUD works
- [ ] Review list + delete + toggle visibility
- [ ] Non-admin → 403 on all endpoints
- [ ] Unauthenticated → 401 on all endpoints

---

# Backend Phase 10 — Security, Performance & Final Verification

### Goal

Harden everything, optimize queries, run full integration test.

### Security Checklist

- [ ] All SQL uses parameterized queries (`$1, $2...`)
- [ ] All input validated before processing
- [ ] JWT secret strong and in `.env`
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] All admin endpoints verify role on backend
- [ ] File uploads validate MIME + size
- [ ] Rate limiting on auth endpoints
- [ ] CORS configured: only `CLIENT_URL`
- [ ] No secrets in code or responses
- [ ] No `password_hash` in any response
- [ ] No stack traces in production errors

### Rate Limiting

Create `server/middleware/rateLimiter.js`:
```text
Auth routes:   max 10 requests / 15 min per IP
General API:   max 100 requests / 15 min per IP
```

### Performance Checklist

- [ ] Product listing uses JOINs, not N+1
- [ ] Pagination enforced (max 50)
- [ ] Large text fields omitted from list endpoints
- [ ] Database indexes exist (already in schema)

### Input Validation Helper

Create `server/utils/validators.js`:
```text
validateEmail(email)
validatePassword(password)    — min 6 chars
validatePositiveInt(value)
validatePrice(value)
sanitizeString(str)           — trim + basic sanitize
```

### Complete API Endpoint Reference

```text
Health:
  GET    /api/health

Auth:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me                          (token)
  POST   /api/auth/logout                      (token)

Categories:
  GET    /api/categories                       (public)
  GET    /api/categories/:id                   (public)
  POST   /api/categories                       (admin)
  PUT    /api/categories/:id                   (admin)
  DELETE /api/categories/:id                   (admin)

Products:
  GET    /api/products                         (public)
  GET    /api/products/:id                     (public)
  POST   /api/products                         (admin)
  PUT    /api/products/:id                     (admin)
  DELETE /api/products/:id                     (admin)
  POST   /api/products/:id/images              (admin)
  DELETE /api/products/:id/images/:imageId     (admin)
  GET    /api/products/:id/reviews             (public)
  POST   /api/products/:id/reviews             (token)

Cart:
  GET    /api/cart                              (token)
  POST   /api/cart                              (token)
  PUT    /api/cart/:id                          (token)
  DELETE /api/cart/:id                          (token)
  DELETE /api/cart                              (token)

Wishlist:
  GET    /api/wishlist                          (token)
  POST   /api/wishlist                          (token)
  DELETE /api/wishlist/:productId               (token)

Orders:
  POST   /api/orders                            (token)
  GET    /api/orders                            (token)
  GET    /api/orders/:id                        (token)

Coupons:
  POST   /api/coupons/validate                  (token)

Profile:
  GET    /api/users/profile                     (token)
  PUT    /api/users/profile                     (token)
  PUT    /api/users/password                    (token)

Addresses:
  GET    /api/addresses                         (token)
  POST   /api/addresses                         (token)
  PUT    /api/addresses/:id                     (token)
  DELETE /api/addresses/:id                     (token)

Admin:
  GET    /api/admin/dashboard                   (admin)
  GET    /api/admin/users                       (admin)
  GET    /api/admin/users/:id                   (admin)
  PUT    /api/admin/users/:id/status            (admin)
  GET    /api/admin/orders                      (admin)
  GET    /api/admin/orders/:id                  (admin)
  PUT    /api/admin/orders/:id/status           (admin)
  PUT    /api/admin/orders/:id/payment          (admin)
  GET    /api/admin/coupons                     (admin)
  POST   /api/admin/coupons                     (admin)
  PUT    /api/admin/coupons/:id                 (admin)
  DELETE /api/admin/coupons/:id                 (admin)
  GET    /api/admin/reviews                     (admin)
  DELETE /api/admin/reviews/:id                 (admin)
  PUT    /api/admin/reviews/:id/visibility      (admin)
```

### Full Integration Test Flow

**Customer flow:**
```text
1.  POST /api/auth/register           → 201 + token
2.  POST /api/auth/login              → 200 + token
3.  GET  /api/auth/me                 → 200 + user
4.  GET  /api/categories              → 200 + categories
5.  GET  /api/products                → 200 + products
6.  GET  /api/products?category=sunglasses&sort=price-low → filtered list
7.  GET  /api/products?search=aviator → search results
8.  GET  /api/products/:id            → 200 + full product
9.  POST /api/wishlist                → 201
10. GET  /api/wishlist                → 200 + items
11. POST /api/cart                    → 201
12. GET  /api/cart                    → 200 + items + totals
13. PUT  /api/cart/:id                → 200
14. POST /api/coupons/validate        → 200 + discount
15. POST /api/orders                  → 201 + order
16. GET  /api/orders                  → 200 + order history
17. GET  /api/orders/:id              → 200 + full details
18. POST /api/products/:id/reviews    → 201
19. PUT  /api/users/profile           → 200
```

**Admin flow:**
```text
1.  POST /api/auth/login (admin)      → 200 + token
2.  GET  /api/admin/dashboard         → 200 + real stats
3.  GET  /api/admin/orders            → 200
4.  PUT  /api/admin/orders/:id/status → 200
5.  GET  /api/admin/users             → 200
6.  PUT  /api/admin/users/:id/status  → 200
7.  POST /api/admin/coupons           → 201
8.  GET  /api/admin/reviews           → 200
```

---

## Frontend Migration Notes

When the backend is complete, the frontend migration is minimal:

### Step 1: Replace static `productData.js` with API calls

Instead of:
```js
import { PRODUCTS, getFilteredProducts } from '../services/productData';
```

Create `services/productService.js`:
```js
import api from './api';
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
```

### Step 2: Connect Navbar counts to Context

Replace hardcoded `const cartCount = 0;` with context values from `CartContext` and `WishlistContext` that sync with the backend APIs.

### Step 3: Build remaining frontend pages

The placeholder pages (`/login`, `/register`, `/cart`, `/checkout`, `/account/*`, `/admin/*`) will be built during frontend phases. The backend APIs documented here provide the exact response shapes those pages will consume.

---

# Agent Execution Rule

For every backend phase:

```text
1. Read BUILD_GUIDE.md for specifications
2. Read the current phase in this file
3. Inspect existing server code
4. Implement only the current phase
5. Wire up routes in app.js
6. Test all endpoints with real requests
7. Fix errors
8. Verify previous phases still work
9. Report what was completed
10. Stop and wait for the next phase
```

Do not implement future phases automatically.
When a phase is incomplete, fix it before moving forward.
