# Drishti — Phase-by-Phase Development Plan

## How to Use This File

Use this file together with `BUILD_GUIDE.md`.

- `BUILD_GUIDE.md` = complete project requirements and technical rules.
- `DEVELOPMENT_PHASES.md` = execution order.
- Complete **one phase at a time**.
- Do not start the next phase until the current phase is working and tested.
- Do not replace existing working functionality unnecessarily.
- Reuse the architecture, database rules, API rules, and design system from `BUILD_GUIDE.md`.

---

# Phase 1 — Project Foundation

### Build
- React + Vite frontend
- Node.js + Express backend
- Neon PostgreSQL connection
- Tailwind CSS
- Environment configuration
- Frontend/backend folder structure
- Base routing
- Base UI/layout system
- Drishti black + neon-yellow theme

### Deliverables
- Frontend runs
- Backend runs
- Database connects
- Basic navbar/footer/layout works
- No console/server errors

### Test
- `npm run dev` works for frontend
- Backend starts successfully
- Neon database connection succeeds

---

# Phase 2 — Database & Seed Data

### Build
Create the database schema from `BUILD_GUIDE.md`:

- users
- categories
- subcategories
- products
- product_images
- tags
- product_tags
- wishlist_items
- cart_items
- addresses
- orders
- order_items
- payments
- coupons
- coupon_usages
- reviews
- order_status_history

### Build
- Foreign keys
- Required indexes
- Constraints
- Seed categories
- Seed 20+ realistic products
- Development admin account

### Test
- Schema executes successfully
- Seed script works
- Relationships work
- Product/category queries work

---

# Phase 3 — Authentication

### Customer
Build:

- Register
- Login
- Logout
- Current-user session
- Password hashing
- JWT authentication
- Protected customer routes

### Admin
Build:

- Admin authentication
- Admin role middleware
- Protected admin routes

### Test
- Register/login/logout
- Invalid credentials
- Duplicate email
- Customer cannot access admin APIs
- Admin can access admin APIs

---

# Phase 4 — Product System

### Backend
Build:

- Product CRUD
- Category CRUD
- Subcategory CRUD
- Tags
- Product images
- Cloudinary integration

### Frontend
Build:

- Shop page
- Product cards
- Search
- Filters
- Sorting
- Pagination
- Product details
- Product image gallery

### Test
- Products load from database
- Search works
- Filters work
- Product details work
- Admin can create/edit/delete products
- Cloudinary upload works

---

# Phase 5 — Cart & Wishlist

### Build
Cart:

- Add product
- Remove product
- Update quantity
- Stock validation
- Cart totals
- Persistent authenticated cart
- Guest cart

Wishlist:

- Add/remove product
- Wishlist page
- Add wishlist product to cart

### Test
- Cart survives refresh
- Quantity updates correctly
- Cannot exceed stock
- Wishlist works
- Guest cart merges correctly after login

---

# Phase 6 — Checkout & Orders

### Build
- Checkout page
- Customer information
- Shipping address
- Cash on Delivery
- Coupon validation
- Order creation
- Order confirmation
- Order history
- Order details
- Order status

### Important
Use a database transaction for order creation:

```text
Validate cart
→ Check stock
→ Calculate prices
→ Apply coupon
→ Create order
→ Create order items
→ Reduce stock
→ Clear cart
→ Create status history
→ Commit
```

### Test
- Successful checkout
- Empty cart checkout blocked
- Insufficient stock blocked
- Invalid coupon blocked
- Correct total calculated by backend
- Stock decreases correctly
- Order appears in customer account

---

# Phase 7 — Customer Account

### Build
- Account dashboard
- Profile
- Addresses
- Order history
- Order details
- Wishlist
- Order tracking
- Product reviews

### Test
- Customer sees only their own information
- Orders display correctly
- Review can only be submitted according to purchase rules
- Account updates work

---

# Phase 8 — Admin Dashboard

### Build
- Admin layout/sidebar
- Dashboard
- Sales overview
- Order statistics
- Customer statistics
- Product statistics
- Low-stock products
- Recent orders

### Test
- Statistics come from real database data
- Admin navigation works
- No fake dashboard data remains

---

# Phase 9 — Admin Management

### Build

## Products
- Product list
- Search/filter
- Add/edit/delete
- Price
- Stock
- Images
- Categories/tags

## Users
- User list
- Search/filter
- User details
- Enable/disable account

## Orders
- Order list
- Search/filter
- Order details
- Update order status
- Update payment status

## Categories
- Category CRUD
- Subcategory CRUD

## Coupons
- Create/edit/delete
- Activate/deactivate
- Expiration
- Usage limits

## Reviews
- View
- Filter
- Delete/moderate

### Test
Verify every admin CRUD operation against the database.

---

# Phase 10 — Remaining Public Pages

### Build
- About
- Contact
- FAQ
- Privacy Policy
- Terms
- 404 page
- Footer links
- Newsletter UI

### Test
- All routes work
- Forms validate correctly
- No dead links

---

# Phase 11 — UI/UX Polish

### Improve
- Black + neon-yellow design consistency
- Typography
- Spacing
- Product cards
- Buttons
- Forms
- Tables
- Admin dashboard
- Mobile navigation
- Loading skeletons
- Empty states
- Error states
- Toast notifications
- Confirmation dialogs
- Subtle animations

### Test
Check:

```text
360px
390px
768px
1024px
1280px
1440px+
```

---

# Phase 12 — Security, SEO & Performance

### Security
- Validate all inputs
- Parameterized SQL
- JWT protection
- Admin authorization
- File upload validation
- Rate limiting
- Secure CORS
- Hide secrets

### SEO
- Page titles
- Meta descriptions
- Product SEO
- Clean slugs
- Alt text
- Sitemap
- robots.txt

### Performance
- Image optimization
- Lazy loading
- Pagination
- Database indexes
- Efficient API queries
- Avoid unnecessary React renders

---

# Phase 13 — Full Testing & Bug Fixing

Test the complete flow:

```text
Register
→ Login
→ Browse products
→ Search
→ Filter
→ Product details
→ Wishlist
→ Add to cart
→ Update cart
→ Checkout
→ Place order
→ View order
→ Review product
```

Then test:

```text
Admin login
→ Dashboard
→ Product management
→ User management
→ Order management
→ Category management
→ Coupon management
→ Review management
```

Fix all:

- Broken routes
- Broken buttons
- API errors
- Database errors
- UI issues
- Responsive issues
- Authentication issues
- Authorization issues
- Stock/order issues
- Console errors

---

# Phase 14 — Final Production Preparation

### Verify
- Production environment variables
- Database connection
- Cloudinary configuration
- Build succeeds
- No secrets in repository
- No mock functionality
- No unused/dead code
- No broken links
- No critical console errors

### Final Deliverables
- Working frontend
- Working backend
- Working Neon database
- Working Cloudinary integration
- Complete customer flow
- Complete admin flow
- README with setup instructions

---

# Agent Execution Rule

For every phase:

```text
1. Read BUILD_GUIDE.md
2. Read the current phase in DEVELOPMENT_PHASES.md
3. Inspect existing implementation
4. Implement only the current phase
5. Connect frontend → API → database where required
6. Test the phase
7. Fix errors
8. Verify existing features still work
9. Report what was completed
10. Stop and wait for the next phase
```

Do not implement future phases automatically.

When a phase is incomplete, fix that phase before moving forward.
