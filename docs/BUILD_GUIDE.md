# Drishti — Comprehensive Website Build Guide Prompt

## 1. PROJECT ROLE

You are a senior full-stack engineer, UI/UX designer, database architect, and ecommerce developer.

Build a complete production-ready ecommerce website called **Drishti** for selling eyeglasses and related eyewear products.

The website must look professional, modern, premium, responsive, fast, and trustworthy.

### Brand

- Name: **Drishti**
- Business type: Eyewear / Glasses ecommerce
- Primary visual theme: **Neon Yellow + Black**
- Design direction:
  - Premium
  - Minimal
  - Modern
  - High contrast
  - Clean typography
  - Strong product photography
  - Subtle animations
  - Excellent mobile experience

Do not create only static pages or mock UI.

Every important button, form, navigation item, product action, authentication flow, cart action, checkout action, order action, and admin action must be connected to real functionality.

---

# 2. REQUIRED TECHNOLOGY STACK

Use exactly this stack unless there is a strong technical reason to add a supporting package.

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios or Fetch API
- JavaScript/JSX

Do NOT use Next.js.

## Backend

- Node.js
- Express.js
- REST API

Do NOT use Next.js API routes.

## Database

- PostgreSQL
- Neon PostgreSQL
- `pg` PostgreSQL client
- Raw SQL queries

Do NOT use Prisma unless explicitly requested later.

## Image Storage

- Cloudinary

Product images must not be stored directly inside PostgreSQL.

## Authentication

- JWT
- Secure password hashing using bcrypt/bcryptjs
- Role-based access control

Roles:

- customer
- admin

---

# 3. PROJECT STRUCTURE

Use a clean full-stack structure similar to:

```text
Drishti-Atelier/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── db/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
├── .env.example
├── README.md
└── BUILD_GUIDE.md
```

Keep frontend and backend responsibilities separated.

---

# 4. DESIGN SYSTEM

Create a consistent design system throughout the entire website.

## Primary Colors

Use:

```text
Black:       #050505
Dark Black:  #0B0B0B
Neon Yellow: #DFFF00
White:       #FFFFFF
Light Gray:  #F4F4F4
Dark Gray:   #171717
Muted Gray:  #A1A1A1
Border Gray: #292929
```

Neon yellow should be used for:

- Primary buttons
- Active navigation
- Important highlights
- Icons
- Badges
- Hover accents
- CTA sections

Do not make the entire interface neon yellow.

Use black/dark backgrounds with controlled neon-yellow accents.

## UI Style

Use:

- Rounded cards, but avoid excessive rounding
- Strong typography
- Large product images
- Clean spacing
- Subtle borders
- Smooth hover transitions
- Product cards with consistent image ratios
- Sticky navigation where appropriate
- Clear CTA buttons
- Responsive layouts

Avoid:

- Excessive gradients
- Excessive animations
- Cluttered dashboards
- Tiny text
- Poor contrast
- Random colors
- Generic default browser styles

---

# 5. USER-FACING PAGES

Build all of the following pages.

## Home Page

Route:

```text
/
```

Sections:

1. Navbar
2. Hero section
3. Primary CTA
4. Featured glasses
5. Categories
6. New arrivals
7. Best sellers
8. Promotional banner
9. Why choose Drishti
10. Customer reviews
11. Newsletter
12. Footer

Hero CTA buttons:

- Shop Now
- Explore Collection

Every CTA must navigate to a real page.

---

# 6. NAVIGATION

Create a professional responsive navbar.

Desktop:

```text
Logo | Home | Shop | Categories | About | Contact | Search | Wishlist | Cart | Account
```

Mobile:

- Hamburger menu
- Search
- Cart
- Account

Navbar must remain usable on all screen sizes.

Cart should display item count.

Wishlist should display item count where appropriate.

---

# 7. AUTHENTICATION

## Login

Route:

```text
/login
```

Features:

- Email
- Password
- Show/hide password
- Remember session
- Login validation
- Error handling
- Loading state
- Forgot password link
- Register link

## Register

Route:

```text
/register
```

Fields:

- Full name
- Email
- Phone
- Password
- Confirm password

Validate:

- Required fields
- Valid email
- Password strength
- Matching passwords
- Duplicate email

## Authentication

Implement:

- JWT authentication
- Password hashing
- Protected routes
- Admin protected routes
- Customer protected routes
- Persistent login
- Logout

Never store plain-text passwords.

---

# 8. SHOP / PRODUCTS PAGE

Route:

```text
/shop
```

Features:

- Product grid
- Search
- Category filter
- Subcategory filter
- Price range
- Gender
- Frame shape
- Frame color
- Availability
- Sort
- Pagination
- Clear filters

Sorting:

- Newest
- Price low to high
- Price high to low
- Most popular
- Best rated

Product card should show:

- Product image
- Product name
- Category
- Price
- Discount price if available
- Rating
- Stock status
- Wishlist button
- Add to cart
- Quick view if appropriate

Search and filtering should use backend API queries rather than loading every product unnecessarily.

---

# 9. PRODUCT DETAILS PAGE

Route:

```text
/product/:id
```

Include:

- Large image gallery
- Thumbnail images
- Image zoom
- Product name
- Price
- Discount
- Stock status
- Quantity selector
- Add to cart
- Buy now
- Wishlist
- Description
- Specifications
- Frame material
- Frame shape
- Frame color
- Gender
- Size
- Reviews
- Rating
- Related products

Handle:

- Product not found
- Out of stock
- Invalid product ID
- API failure

---

# 10. CART PAGE

Route:

```text
/cart
```

Features:

- Product image
- Product name
- Price
- Quantity
- Increase/decrease quantity
- Remove product
- Save for wishlist
- Subtotal
- Discount
- Coupon
- Shipping
- Grand total
- Continue shopping
- Proceed to checkout

Prevent users from ordering more units than available stock.

Cart must persist for logged-in users.

For guests, use local storage/session storage and merge the cart after login.

---

# 11. CHECKOUT

Route:

```text
/checkout
```

Sections:

### Customer Information

- Full name
- Email
- Phone

### Shipping Address

- Address
- City
- Area
- Postal code
- Country

### Payment

Initially support:

- Cash on Delivery

Design the payment system so online payment can be added later.

### Order Summary

Show:

- Products
- Quantity
- Subtotal
- Discount
- Shipping
- Total

Create the order only after server-side validation.

Never trust totals sent by the frontend.

The backend must recalculate:

- Product prices
- Quantity
- Discount
- Shipping
- Grand total

---

# 12. ORDER CONFIRMATION

Route:

```text
/order-success/:id
```

Show:

- Order number
- Order date
- Customer name
- Ordered products
- Total
- Payment method
- Shipping address
- Order status
- Estimated delivery information

Provide:

- View order
- Continue shopping

---

# 13. CUSTOMER ACCOUNT

Route:

```text
/account
```

Create an account dashboard with:

- Profile
- Orders
- Wishlist
- Addresses
- Account settings
- Logout

## Order History

Route:

```text
/account/orders
```

Show:

- Order number
- Date
- Total
- Payment status
- Order status
- View details

## Order Details

Route:

```text
/account/orders/:id
```

Show:

- Products
- Quantities
- Prices
- Shipping address
- Payment status
- Order status
- Order timeline

Statuses:

```text
pending
confirmed
processing
shipped
delivered
cancelled
```

---

# 14. WISHLIST

Route:

```text
/wishlist
```

Features:

- Add/remove products
- Product image
- Product price
- Stock status
- Add to cart
- Remove
- Empty wishlist state

Wishlist must work for authenticated users.

---

# 15. PRODUCT REVIEWS

Allow authenticated customers to review purchased products.

Review fields:

- Rating: 1–5
- Comment

Features:

- Average rating
- Review count
- Review list
- User name
- Review date
- Admin moderation/delete capability

Prevent duplicate reviews for the same purchased product unless explicitly allowed.

---

# 16. CATEGORY SYSTEM

Create:

- Categories
- Subcategories
- Tags

Example categories:

```text
Men
Women
Unisex
Sunglasses
Prescription Glasses
Blue Light Glasses
Kids
```

Example tags:

```text
New
Trending
Best Seller
Premium
Sale
Lightweight
```

Products can have multiple tags/categories where appropriate.

---

# 17. ADMIN DASHBOARD

Admin route:

```text
/admin
```

Protect the entire admin area with role-based middleware.

Dashboard cards:

- Total sales
- Total orders
- Total customers
- Total products
- Low-stock products
- Pending orders

Dashboard sections:

- Recent orders
- Recent customers
- Best-selling products
- Sales overview
- Low-stock alerts

Do not use fake statistics after backend integration is complete.

---

# 18. ADMIN PRODUCT MANAGEMENT

Route:

```text
/admin/products
```

Features:

- Product list
- Search
- Filters
- Sorting
- Pagination
- Add product
- Edit product
- Delete product
- Stock management
- Image management

Product fields:

```text
name
slug
description
short_description
price
compare_price
stock
sku
category_id
subcategory_id
brand
frame_material
frame_shape
frame_color
gender
size
status
featured
images
tags
```

Product statuses:

```text
active
draft
out_of_stock
archived
```

Admin must be able to:

- Upload multiple images
- Reorder images
- Delete images
- Set primary image
- Update price
- Update stock
- Update description
- Update specifications
- Mark featured
- Mark bestseller

---

# 19. ADMIN PRODUCT DETAILS

Route:

```text
/admin/products/:id
```

Create a professional editing interface.

Sections:

### Basic Information

- Name
- SKU
- Description
- Short description

### Pricing

- Price
- Compare-at price
- Discount

### Inventory

- Stock
- Low-stock threshold
- SKU
- Availability

### Product Attributes

- Category
- Subcategory
- Gender
- Frame shape
- Frame material
- Frame color
- Size

### Images

- Cloudinary upload
- Preview
- Reorder
- Delete

### Marketing

- Featured
- Bestseller
- New arrival
- Tags

Include:

- Save
- Cancel
- Delete
- Preview product

---

# 20. ADMIN USER MANAGEMENT

Route:

```text
/admin/users
```

Features:

- User list
- Search
- Filter
- Pagination
- User details
- Account status
- Registration date
- Order count
- Total spending

Admin actions:

- View user
- Disable account
- Enable account
- View user's orders

Do not allow admins to directly view or change user passwords.

---

# 21. ADMIN ORDER MANAGEMENT

Route:

```text
/admin/orders
```

Features:

- Order list
- Search by order number
- Search by customer
- Filter by status
- Filter by payment status
- Date filter
- Pagination

Order details:

```text
/admin/orders/:id
```

Admin can update:

- Order status
- Payment status
- Shipping/tracking information

Order status:

```text
pending
confirmed
processing
shipped
delivered
cancelled
```

Keep an order status history where practical.

---

# 22. ADMIN CATEGORY MANAGEMENT

Route:

```text
/admin/categories
```

Features:

- Create category
- Edit category
- Delete category
- Activate/deactivate category
- Create subcategory
- Edit subcategory
- Delete subcategory

Prevent deleting categories that still contain products unless products are reassigned.

---

# 23. ADMIN COUPON MANAGEMENT

Route:

```text
/admin/coupons
```

Features:

- Create coupon
- Edit coupon
- Delete coupon
- Activate/deactivate
- Expiration date
- Usage limit
- Minimum order amount
- Percentage discount
- Fixed discount

Validate coupons on the backend.

---

# 24. ADMIN REVIEW MANAGEMENT

Route:

```text
/admin/reviews
```

Features:

- View reviews
- Search
- Filter by rating
- Approve/reject if moderation is implemented
- Delete review

---

# 25. DATABASE DESIGN

Use PostgreSQL on Neon.

Create normalized tables.

Recommended tables:

```text
users
categories
subcategories
products
product_images
tags
product_tags
wishlist_items
cart_items
addresses
orders
order_items
payments
coupons
coupon_usages
reviews
order_status_history
```

Optional:

```text
newsletter_subscribers
contact_messages
```

---

# 26. USERS TABLE

Recommended fields:

```text
id
name
email
phone
password_hash
role
is_active
created_at
updated_at
```

Constraints:

- Unique email
- Valid role
- Timestamps

---

# 27. PRODUCTS TABLE

Recommended fields:

```text
id
name
slug
sku
description
short_description
price
compare_price
stock
low_stock_threshold
category_id
subcategory_id
brand
frame_material
frame_shape
frame_color
gender
size
status
featured
bestseller
new_arrival
created_at
updated_at
```

Use appropriate PostgreSQL data types.

Money should use a safe numeric/decimal representation rather than floating-point storage.

---

# 28. PRODUCT IMAGES

Fields:

```text
id
product_id
image_url
cloudinary_public_id
alt_text
sort_order
is_primary
created_at
```

Use foreign keys.

Deleting a product should handle associated images correctly.

---

# 29. ORDERS

Fields:

```text
id
user_id
order_number
subtotal
discount
shipping_fee
total
coupon_id
payment_method
payment_status
order_status
shipping_name
shipping_phone
shipping_address
shipping_city
shipping_area
shipping_postal_code
created_at
updated_at
```

---

# 30. ORDER ITEMS

Fields:

```text
id
order_id
product_id
product_name
sku
price
quantity
subtotal
```

Store product name and price snapshots so historical orders remain accurate even if the product changes later.

---

# 31. API DESIGN

Create REST APIs using Express.

## Auth

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

## Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Public users should only access public product endpoints.

Admin product mutations must require admin authentication.

## Categories

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## Cart

```text
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
DELETE /api/cart
```

## Wishlist

```text
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
```

## Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
```

Admin:

```text
GET    /api/admin/orders
GET    /api/admin/orders/:id
PUT    /api/admin/orders/:id/status
```

## Users

```text
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id/status
```

## Reviews

```text
GET    /api/products/:id/reviews
POST   /api/products/:id/reviews
DELETE /api/reviews/:id
```

---

# 32. API SECURITY

Implement:

- JWT authentication
- Password hashing
- Authentication middleware
- Admin authorization middleware
- Input validation
- Parameterized SQL queries
- CORS configuration
- Rate limiting where appropriate
- Secure error handling
- Environment variables
- No secrets in source code

Never construct SQL queries by directly concatenating user input.

Never expose:

- Password hashes
- JWT secrets
- Database credentials
- Cloudinary secrets

---

# 33. CLOUDINARY

Use Cloudinary for product images.

Environment variables:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Implement:

- Upload
- Delete
- Multiple images
- Primary image
- Image ordering

Validate uploaded files:

- MIME type
- File size
- Image format

---

# 34. ENVIRONMENT VARIABLES

Create `.env.example`.

Example:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never commit `.env`.

---

# 35. FRONTEND API ARCHITECTURE

Create a centralized API layer.

Example:

```text
services/
├── api.js
├── authService.js
├── productService.js
├── cartService.js
├── orderService.js
├── wishlistService.js
└── adminService.js
```

Do not scatter API URLs throughout components.

Use environment configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 36. STATE MANAGEMENT

Use React Context or another lightweight state approach for:

- Authentication
- Cart
- Wishlist
- UI state where necessary

Do not overcomplicate state management.

Cart state must remain synchronized with the backend for authenticated users.

---

# 37. ERROR HANDLING

Every API request must handle:

- Loading
- Success
- Empty state
- Error state

Create reusable components:

```text
LoadingSpinner
ErrorMessage
EmptyState
ConfirmDialog
Toast
SkeletonLoader
```

Show user-friendly error messages.

Do not expose raw backend/database errors to customers.

---

# 38. RESPONSIVE DESIGN

Support:

- Mobile
- Tablet
- Laptop
- Desktop
- Large desktop

Test at minimum:

```text
360px
390px
768px
1024px
1280px
1440px+
```

The mobile experience must not be an afterthought.

---

# 39. ACCESSIBILITY

Implement:

- Semantic HTML
- Keyboard navigation
- Proper labels
- Alt text
- Visible focus states
- Accessible buttons
- Sufficient contrast
- ARIA attributes when needed

Do not rely only on color to communicate state.

---

# 40. SEO

Implement basic SEO.

Each public product page should have:

- Dynamic title
- Meta description
- Product-specific information
- Clean URL slug

Example:

```text
/products/rayban-classic-black-frame
```

Also implement:

- Proper heading hierarchy
- Image alt text
- Canonical URLs where appropriate
- robots.txt
- sitemap where practical

---

# 41. PERFORMANCE

Optimize:

- Product images
- Lazy loading
- API queries
- Pagination
- Database indexes
- React rendering
- Bundle size

Do not load hundreds of products at once.

Use server-side filtering/pagination.

---

# 42. DATABASE INDEXING

Add indexes for frequently queried fields such as:

```text
users.email
products.slug
products.category_id
products.subcategory_id
products.status
products.price
orders.user_id
orders.order_number
orders.order_status
reviews.product_id
```

Use unique indexes where appropriate.

---

# 43. PRODUCT SEARCH

Implement backend search.

Search should support:

- Product name
- SKU
- Brand
- Category
- Relevant product attributes

Use PostgreSQL-compatible search techniques.

Do not download the entire product table into React just to perform search.

---

# 44. CART LOGIC

Important rules:

1. Product must exist.
2. Product must be active.
3. Product must have sufficient stock.
4. Quantity must be positive.
5. Backend calculates the current price.
6. Backend calculates totals.
7. Frontend cannot manipulate final order price.
8. Stock must be checked again during checkout.
9. Stock should be reduced safely when an order is created.
10. Prevent negative inventory.

Use database transactions for order creation and stock updates.

---

# 45. ORDER CREATION TRANSACTION

Order creation should be atomic.

Recommended flow:

```text
BEGIN TRANSACTION

1. Validate authenticated user
2. Load cart
3. Lock/check product stock
4. Read current product prices
5. Validate coupon
6. Calculate subtotal
7. Calculate discount
8. Calculate shipping
9. Calculate final total
10. Create order
11. Create order items
12. Reduce stock
13. Clear cart
14. Create status history

COMMIT
```

Rollback if any step fails.

---

# 46. ADMIN UX

Admin dashboard should look like a real ecommerce management system.

Use:

- Sidebar
- Top navigation
- Breadcrumbs
- Cards
- Tables
- Filters
- Search
- Pagination
- Modal/dialogs
- Form validation
- Confirmation dialogs

Admin UI must use the same Drishti visual identity but should prioritize usability.

---

# 47. USER EXPERIENCE

Add professional states:

### Empty cart

Show:

```text
Your cart is empty.
Explore our latest eyewear collection.
```

With Shop Now button.

### Empty wishlist

Show a useful CTA.

### No search results

Show:

- Search query
- Clear filters
- Suggested categories

### Out of stock

Disable purchasing.

### Loading

Use skeletons instead of blank screens where practical.

---

# 48. NOTIFICATIONS

Implement toast notifications for:

- Login successful
- Registration successful
- Product added to cart
- Product removed
- Wishlist updated
- Order placed
- Product updated
- Product deleted
- Coupon applied
- API errors

Do not overuse notifications.

---

# 49. CONFIRMATION DIALOGS

Require confirmation before destructive actions:

- Delete product
- Delete category
- Delete review
- Disable user
- Cancel order

Example:

```text
Are you sure you want to delete this product?
This action cannot be undone.
```

---

# 50. SAMPLE PRODUCT DATA

Create realistic seed data.

Include at least:

- 20+ products
- Multiple categories
- Multiple price ranges
- Different frame colors
- Different frame shapes
- Different genders
- Featured products
- Bestseller products
- New arrivals
- Some discounted products

Use realistic product descriptions.

Do not use fake placeholder text such as:

```text
Lorem ipsum
Product 1
Product 2
```

---

# 51. ADMIN SEED ACCOUNT

Create a development-only admin seed account.

Do not hardcode a production password into frontend code.

Document the development credentials separately and require the password to be changed before production.

---

# 52. ROUTING

Create protected routing.

Public:

```text
/
 /shop
 /product/:id
 /login
 /register
 /about
 /contact
```

Customer:

```text
/cart
/checkout
/account
/account/orders
/account/orders/:id
/wishlist
```

Admin:

```text
/admin
/admin/products
/admin/products/new
/admin/products/:id
/admin/users
/admin/orders
/admin/orders/:id
/admin/categories
/admin/coupons
/admin/reviews
```

Unknown routes should show a professional 404 page.

---

# 53. 404 PAGE

Create:

- Large 404 message
- Short explanation
- Back home
- Shop now button

Use the Drishti black/neon-yellow design.

---

# 54. FOOTER

Footer should contain:

### Company

- About
- Contact
- FAQ

### Customer Service

- Shipping
- Returns
- Order tracking

### Legal

- Privacy policy
- Terms

### Social

- Facebook
- Instagram
- Other relevant social links

### Newsletter

- Email field
- Subscribe button

---

# 55. CONTACT PAGE

Route:

```text
/contact
```

Include:

- Contact form
- Name
- Email
- Phone
- Subject
- Message
- Business contact information
- Social links

Validate the form.

---

# 56. ABOUT PAGE

Route:

```text
/about
```

Include:

- Drishti story
- Brand values
- Why choose us
- Quality statement
- Customer-focused message

Keep it visually consistent with the brand.

---

# 57. FAQ PAGE

Include common questions:

- How do I order?
- How long does delivery take?
- What payment methods are supported?
- Can I return a product?
- How do I track my order?
- How do I choose a frame?
- What happens if a product is out of stock?

---

# 58. CODE QUALITY

Follow these principles:

- Reusable components
- Small focused functions
- Clear naming
- No unnecessary duplication
- Proper error handling
- Comments only where useful
- Consistent formatting
- No dead code
- No unused imports
- No hardcoded API URLs
- No hardcoded secrets

Do not create one giant React component for an entire page.

---

# 59. COMPONENT SYSTEM

Create reusable components such as:

```text
Navbar
Footer
ProductCard
ProductGrid
ProductFilters
SearchBar
PriceRange
CategoryFilter
RatingStars
QuantitySelector
CartItem
OrderSummary
CheckoutForm
ProductGallery
ReviewCard
Pagination
Modal
ConfirmDialog
Toast
LoadingSpinner
Skeleton
EmptyState
ProtectedRoute
AdminRoute
```

---

# 60. ADMIN COMPONENTS

Create reusable admin components:

```text
AdminLayout
AdminSidebar
AdminHeader
StatCard
DataTable
SearchFilterBar
ProductForm
ProductImageUploader
OrderStatusBadge
UserStatusBadge
Pagination
AdminModal
```

---

# 61. SECURITY REQUIREMENTS

Must protect against:

- SQL injection
- XSS
- CSRF where applicable
- Broken access control
- Unauthorized admin API access
- Invalid JWT
- Brute-force login attempts
- Malicious file uploads

Never trust frontend authorization.

Every admin API endpoint must verify the user's admin role on the backend.

---

# 62. VALIDATION

Use backend validation for:

- Email
- Password
- Product ID
- Price
- Stock
- Quantity
- Coupon
- Order data
- User data

Frontend validation improves UX but backend validation is mandatory.

---

# 63. TESTING

Test all major workflows.

## Customer

```text
Register
Login
Logout
Search product
Filter product
Open product
Add to cart
Update quantity
Remove item
Wishlist
Checkout
Place order
View order
Review product
```

## Admin

```text
Login
Open dashboard
Create product
Edit product
Upload image
Delete product
Update stock
Update price
Create category
Edit category
View users
Disable user
View orders
Update order status
View reviews
Manage coupons
```

---

# 64. ERROR TESTING

Test:

- Invalid login
- Duplicate registration
- Invalid product ID
- Out-of-stock product
- Invalid coupon
- Expired coupon
- Empty cart checkout
- Invalid quantity
- Unauthorized API access
- Customer accessing admin page
- Admin API without authentication
- Database failure
- Cloudinary upload failure
- Network failure

---

# 65. FINAL FUNCTIONAL REQUIREMENT

Do NOT consider a page complete simply because it visually exists.

A page is complete only when:

```text
UI
+
Routing
+
API
+
Database
+
Validation
+
Error handling
+
Loading state
+
Empty state
+
Authentication/authorization where needed
```

are correctly connected.

---

# 66. IMPLEMENTATION ORDER

Build the project in this order.

## Phase 1 — Foundation

1. Create React/Vite frontend
2. Create Express backend
3. Configure Neon PostgreSQL
4. Configure environment variables
5. Configure Tailwind
6. Create base project structure
7. Create database schema
8. Create seed data

## Phase 2 — Authentication

1. Register
2. Login
3. JWT
4. Auth middleware
5. Admin middleware
6. Protected routes
7. Logout

## Phase 3 — Product System

1. Categories
2. Products
3. Product images
4. Cloudinary
5. Product API
6. Product listing
7. Search
8. Filters
9. Product details

## Phase 4 — Ecommerce

1. Cart
2. Wishlist
3. Checkout
4. Orders
5. Stock management
6. Order history
7. Order status

## Phase 5 — Customer Features

1. Account
2. Addresses
3. Reviews
4. Order tracking
5. Contact
6. FAQ
7. About

## Phase 6 — Admin

1. Dashboard
2. Product management
3. User management
4. Order management
5. Category management
6. Coupon management
7. Review management

## Phase 7 — Polish

1. Responsive design
2. Loading states
3. Empty states
4. Error states
5. Animations
6. SEO
7. Accessibility
8. Performance
9. Security
10. Testing

---

# 67. DEVELOPMENT RULE

When implementing the project, do not replace existing working functionality unnecessarily.

Before changing an existing feature:

1. Inspect the current implementation.
2. Understand its dependencies.
3. Preserve working functionality.
4. Modify only what is necessary.
5. Test related features afterward.

If something is incomplete, finish it instead of creating a duplicate implementation.

---

# 68. NO MOCK FUNCTIONALITY

Do not leave:

```text
TODO
Coming soon
Fake API
Fake order creation
Fake admin statistics
Fake buttons
Dead navigation links
Static product lists
```

unless explicitly requested.

Use real database-backed functionality.

---

# 69. FINAL QUALITY CHECKLIST

Before declaring the project complete, verify:

### Frontend

- [ ] All pages exist
- [ ] All routes work
- [ ] All buttons work
- [ ] All forms work
- [ ] Responsive design works
- [ ] No console errors
- [ ] No broken images
- [ ] Loading states exist
- [ ] Error states exist
- [ ] Empty states exist

### Backend

- [ ] API routes work
- [ ] Authentication works
- [ ] Admin authorization works
- [ ] Validation works
- [ ] Error handling works
- [ ] SQL queries are parameterized
- [ ] Transactions are used where required

### Database

- [ ] Schema works
- [ ] Foreign keys work
- [ ] Indexes exist
- [ ] Seed data works
- [ ] Product relationships work
- [ ] Order relationships work

### Ecommerce

- [ ] Search works
- [ ] Filters work
- [ ] Product details work
- [ ] Cart works
- [ ] Wishlist works
- [ ] Checkout works
- [ ] Orders are created correctly
- [ ] Stock decreases correctly
- [ ] Order status works
- [ ] Reviews work

### Admin

- [ ] Dashboard works
- [ ] Products CRUD works
- [ ] Users work
- [ ] Orders work
- [ ] Categories work
- [ ] Coupons work
- [ ] Reviews work
- [ ] Cloudinary uploads work

### Security

- [ ] Passwords hashed
- [ ] JWT protected
- [ ] Admin APIs protected
- [ ] SQL injection prevented
- [ ] Secrets hidden
- [ ] File uploads validated
- [ ] Input validation implemented

---

# 70. FINAL INSTRUCTION TO THE AI CODING AGENT

Build **Drishti** as a complete, production-quality full-stack ecommerce application.

Do not stop at UI mockups.

Implement the complete connection:

```text
React/Vite
      ↓
REST API
      ↓
Express/Node.js
      ↓
Neon PostgreSQL
      ↓
Cloudinary
```

Every customer-facing ecommerce operation must work end-to-end.

Every admin operation must work end-to-end.

Maintain the **black + neon-yellow Drishti identity** throughout the application.

Prioritize:

1. Functionality
2. Data correctness
3. Security
4. UX
5. Responsive design
6. Performance
7. Visual polish

After each major implementation phase, test the related functionality before moving to the next phase.

At the end, provide:

- Final project structure
- Database schema summary
- API endpoint summary
- Environment variable list
- Installation commands
- Development commands
- Production build commands
- Admin setup instructions
- Testing checklist
- Known limitations, if any
