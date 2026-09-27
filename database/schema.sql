-- ============================================
-- Drishti — Complete Database Schema
-- ============================================
-- Run this file against your Neon PostgreSQL database
-- to create all required tables, indexes, and constraints.
--
-- Usage: psql $DATABASE_URL -f schema.sql
-- Or run via: node database/run-schema.js
-- ============================================

-- Enable UUID extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Drop existing tables (in reverse dependency order)
-- ============================================
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS coupon_usages CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS product_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer', 'admin')),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CATEGORIES
-- ============================================
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  image_url   VARCHAR(500),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. SUBCATEGORIES
-- ============================================
CREATE TABLE subcategories (
  id          SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. PRODUCTS
-- ============================================
CREATE TABLE products (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(255) NOT NULL,
  slug                VARCHAR(280) NOT NULL UNIQUE,
  sku                 VARCHAR(50) UNIQUE,
  description         TEXT,
  short_description   VARCHAR(500),
  price               NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_price       NUMERIC(10,2) CHECK (compare_price >= 0),
  stock               INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id      INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
  brand               VARCHAR(100),
  frame_material      VARCHAR(100),
  frame_shape         VARCHAR(100),
  frame_color         VARCHAR(100),
  gender              VARCHAR(20) CHECK (gender IN ('men', 'women', 'unisex', 'kids')),
  size                VARCHAR(50),
  status              VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'draft', 'out_of_stock', 'archived')),
  featured            BOOLEAN NOT NULL DEFAULT false,
  bestseller          BOOLEAN NOT NULL DEFAULT false,
  new_arrival         BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. PRODUCT IMAGES
-- ============================================
CREATE TABLE product_images (
  id                   SERIAL PRIMARY KEY,
  product_id           INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url            VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255),
  alt_text             VARCHAR(255),
  sort_order           INTEGER NOT NULL DEFAULT 0,
  is_primary           BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. TAGS
-- ============================================
CREATE TABLE tags (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE,
  slug       VARCHAR(60) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. PRODUCT_TAGS (Many-to-Many)
-- ============================================
CREATE TABLE product_tags (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(product_id, tag_id)
);

-- ============================================
-- 8. WISHLIST ITEMS
-- ============================================
CREATE TABLE wishlist_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- 9. CART ITEMS
-- ============================================
CREATE TABLE cart_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- 10. ADDRESSES
-- ============================================
CREATE TABLE addresses (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label       VARCHAR(50) DEFAULT 'Home',
  full_name   VARCHAR(100) NOT NULL,
  phone       VARCHAR(20) NOT NULL,
  address     TEXT NOT NULL,
  city        VARCHAR(100) NOT NULL,
  area        VARCHAR(100),
  postal_code VARCHAR(20),
  country     VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 11. COUPONS
-- ============================================
CREATE TABLE coupons (
  id                SERIAL PRIMARY KEY,
  code              VARCHAR(50) NOT NULL UNIQUE,
  description       VARCHAR(255),
  discount_type     VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value    NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount  NUMERIC(10,2) DEFAULT 0,
  max_discount      NUMERIC(10,2),
  usage_limit       INTEGER,
  used_count        INTEGER NOT NULL DEFAULT 0,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  starts_at         TIMESTAMP WITH TIME ZONE,
  expires_at        TIMESTAMP WITH TIME ZONE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 12. ORDERS
-- ============================================
CREATE TABLE orders (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_number        VARCHAR(50) NOT NULL UNIQUE,
  subtotal            NUMERIC(10,2) NOT NULL,
  discount            NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee        NUMERIC(10,2) NOT NULL DEFAULT 0,
  total               NUMERIC(10,2) NOT NULL,
  coupon_id           INTEGER REFERENCES coupons(id) ON DELETE SET NULL,
  payment_method      VARCHAR(50) NOT NULL DEFAULT 'cod',
  payment_status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                      CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status        VARCHAR(20) NOT NULL DEFAULT 'pending'
                      CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_name       VARCHAR(100) NOT NULL,
  shipping_phone      VARCHAR(20) NOT NULL,
  shipping_address    TEXT NOT NULL,
  shipping_city       VARCHAR(100) NOT NULL,
  shipping_area       VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  notes               TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 13. ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_slug VARCHAR(280),
  sku          VARCHAR(50),
  price        NUMERIC(10,2) NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  subtotal     NUMERIC(10,2) NOT NULL,
  image_url    VARCHAR(500),
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 14. PAYMENTS
-- ============================================
CREATE TABLE payments (
  id               SERIAL PRIMARY KEY,
  order_id         INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method   VARCHAR(50) NOT NULL,
  amount           NUMERIC(10,2) NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id   VARCHAR(255),
  payment_details  JSONB,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 15. COUPON USAGES
-- ============================================
CREATE TABLE coupon_usages (
  id        SERIAL PRIMARY KEY,
  coupon_id INTEGER NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id  INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  used_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coupon_id, user_id, order_id)
);

-- ============================================
-- 16. REVIEWS
-- ============================================
CREATE TABLE reviews (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id   INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- 17. ORDER STATUS HISTORY
-- ============================================
CREATE TABLE order_status_history (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     VARCHAR(20) NOT NULL,
  note       TEXT,
  changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 18. NEWSLETTER SUBSCRIBERS (Optional)
-- ============================================
CREATE TABLE newsletter_subscribers (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  is_subscribed BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 19. CONTACT MESSAGES (Optional)
-- ============================================
CREATE TABLE contact_messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  subject    VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);

-- Subcategories
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_subcategories_slug ON subcategories(slug);

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_bestseller ON products(bestseller) WHERE bestseller = true;
CREATE INDEX idx_products_new_arrival ON products(new_arrival) WHERE new_arrival = true;
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_sku ON products(sku);

-- Product Images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id) WHERE is_primary = true;

-- Product Tags
CREATE INDEX idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag_id ON product_tags(tag_id);

-- Wishlist
CREATE INDEX idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist_items(product_id);

-- Cart
CREATE INDEX idx_cart_user_id ON cart_items(user_id);

-- Addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Payments
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Coupon Usages
CREATE INDEX idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
CREATE INDEX idx_coupon_usages_user_id ON coupon_usages(user_id);

-- Reviews
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Order Status History
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- Full-text search index on products
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(brand, '') || ' ' || coalesce(description, ''))
);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-update triggers
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_subcategories_updated_at
  BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cart_items_updated_at
  BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_coupons_updated_at
  BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE
-- ============================================
-- Schema created successfully.
-- Run seed.sql next to populate initial data.
