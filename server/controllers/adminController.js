const { query } = require('../db/pool');

/**
 * Get admin dashboard statistics
 * GET /api/admin/dashboard
 * All stats from real database queries — no hardcoded data
 */
async function getDashboardStats(req, res, next) {
  try {
    // Run all stat queries in parallel
    const [
      totalSalesResult,
      orderCountResult,
      customerCountResult,
      productCountResult,
      pendingOrdersResult,
      lowStockResult,
      recentOrdersResult,
      bestSellersResult,
      ordersByStatusResult,
      revenueByMonthResult,
    ] = await Promise.all([
      // 1. Total sales (sum of all non-cancelled order totals)
      query(`
        SELECT COALESCE(SUM(total), 0) AS total_sales,
               COALESCE(SUM(discount), 0) AS total_discounts
        FROM orders WHERE order_status != 'cancelled'
      `),

      // 2. Total orders count
      query('SELECT COUNT(*) AS count FROM orders'),

      // 3. Total customers count
      query("SELECT COUNT(*) AS count FROM users WHERE role = 'customer'"),

      // 4. Total active products
      query("SELECT COUNT(*) AS count FROM products WHERE status = 'active'"),

      // 5. Pending orders count
      query("SELECT COUNT(*) AS count FROM orders WHERE order_status = 'pending'"),

      // 6. Low stock products (stock <= low_stock_threshold or stock <= 5)
      query(`
        SELECT id, name, slug, sku, stock, low_stock_threshold, price,
               (SELECT image_url FROM product_images WHERE product_id = products.id AND is_primary = true LIMIT 1) AS image_url
        FROM products
        WHERE status = 'active' AND stock <= COALESCE(low_stock_threshold, 5)
        ORDER BY stock ASC
        LIMIT 10
      `),

      // 7. Recent orders (latest 10)
      query(`
        SELECT o.id, o.order_number, o.total, o.order_status, o.payment_status,
               o.created_at, u.name AS customer_name, u.email AS customer_email,
               (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
      `),

      // 8. Best sellers (top 8 by order quantity)
      query(`
        SELECT p.id, p.name, p.slug, p.price, p.stock,
               SUM(oi.quantity) AS total_sold,
               COUNT(DISTINCT oi.order_id) AS order_count,
               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.order_status != 'cancelled'
        GROUP BY p.id
        ORDER BY total_sold DESC
        LIMIT 8
      `),

      // 9. Orders by status breakdown
      query(`
        SELECT order_status, COUNT(*) AS count
        FROM orders
        GROUP BY order_status
        ORDER BY count DESC
      `),

      // 10. Revenue by month (last 6 months)
      query(`
        SELECT TO_CHAR(created_at, 'YYYY-MM') AS month,
               COALESCE(SUM(total), 0) AS revenue,
               COUNT(*) AS orders
        FROM orders
        WHERE order_status != 'cancelled'
          AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY month ASC
      `),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          total_sales: parseFloat(totalSalesResult.rows[0].total_sales),
          total_discounts: parseFloat(totalSalesResult.rows[0].total_discounts),
          total_orders: parseInt(orderCountResult.rows[0].count, 10),
          total_customers: parseInt(customerCountResult.rows[0].count, 10),
          total_products: parseInt(productCountResult.rows[0].count, 10),
          pending_orders: parseInt(pendingOrdersResult.rows[0].count, 10),
        },
        low_stock: lowStockResult.rows.map((p) => ({
          ...p,
          price: parseFloat(p.price),
        })),
        recent_orders: recentOrdersResult.rows.map((o) => ({
          ...o,
          total: parseFloat(o.total),
          items_count: parseInt(o.items_count, 10),
        })),
        best_sellers: bestSellersResult.rows.map((p) => ({
          ...p,
          price: parseFloat(p.price),
          total_sold: parseInt(p.total_sold, 10),
          order_count: parseInt(p.order_count, 10),
        })),
        orders_by_status: ordersByStatusResult.rows.map((s) => ({
          status: s.order_status,
          count: parseInt(s.count, 10),
        })),
        revenue_by_month: revenueByMonthResult.rows.map((r) => ({
          month: r.month,
          revenue: parseFloat(r.revenue),
          orders: parseInt(r.orders, 10),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}

// ============ USERS ============

async function getUsers(req, res, next) {
  try {
    const { search, role, status, page = 1 } = req.query;
    const limit = 20; const offset = (page - 1) * limit;
    let where = [], params = [], idx = 1;
    if (search) { where.push(`(u.name ILIKE $${idx} OR u.email ILIKE $${idx})`); params.push(`%${search}%`); idx++; }
    if (role) { where.push(`u.role = $${idx}`); params.push(role); idx++; }
    if (status === 'active') where.push('u.is_active = true');
    if (status === 'inactive') where.push('u.is_active = false');
    const wc = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const [usersR, countR] = await Promise.all([
      query(`SELECT u.id, u.name, u.email, u.phone, u.role, u.is_active, u.created_at, (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count FROM users u ${wc} ORDER BY u.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`, [...params, limit, offset]),
      query(`SELECT COUNT(*) FROM users u ${wc}`, params),
    ]);
    res.json({ status: 'success', data: { users: usersR.rows, total: parseInt(countR.rows[0].count, 10), page: +page, limit } });
  } catch (e) { next(e); }
}

async function toggleUserStatus(req, res, next) {
  try {
    const r = await query('UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, is_active', [req.body.is_active, req.params.id]);
    if (!r.rows.length) return res.status(404).json({ status: 'fail', message: 'User not found.' });
    res.json({ status: 'success', data: r.rows[0] });
  } catch (e) { next(e); }
}

// ============ ORDERS ============

async function getOrders(req, res, next) {
  try {
    const { search, order_status, payment_status, page = 1 } = req.query;
    const limit = 20; const offset = (page - 1) * limit;
    let where = [], params = [], idx = 1;
    if (search) { where.push(`(o.order_number ILIKE $${idx} OR u.name ILIKE $${idx})`); params.push(`%${search}%`); idx++; }
    if (order_status) { where.push(`o.order_status = $${idx}`); params.push(order_status); idx++; }
    if (payment_status) { where.push(`o.payment_status = $${idx}`); params.push(payment_status); idx++; }
    const wc = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const [ordersR, countR] = await Promise.all([
      query(`SELECT o.*, u.name AS customer_name, u.email AS customer_email, (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count FROM orders o JOIN users u ON o.user_id = u.id ${wc} ORDER BY o.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`, [...params, limit, offset]),
      query(`SELECT COUNT(*) FROM orders o JOIN users u ON o.user_id = u.id ${wc}`, params),
    ]);
    res.json({ status: 'success', data: { orders: ordersR.rows, total: parseInt(countR.rows[0].count, 10), page: +page, limit } });
  } catch (e) { next(e); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { order_status, payment_status, note } = req.body;
    if (!order_status && !payment_status) return res.status(400).json({ status: 'fail', message: 'Provide order_status or payment_status.' });
    let updates = [], params = [], idx = 1;
    if (order_status) { updates.push(`order_status = $${idx}`); params.push(order_status); idx++; }
    if (payment_status) { updates.push(`payment_status = $${idx}`); params.push(payment_status); idx++; }
    updates.push('updated_at = NOW()');
    const r = await query(`UPDATE orders SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`, [...params, req.params.id]);
    if (!r.rows.length) return res.status(404).json({ status: 'fail', message: 'Order not found.' });
    if (order_status) await query('INSERT INTO order_status_history (order_id, status, note, changed_by) VALUES ($1, $2, $3, $4)', [req.params.id, order_status, note || `Status updated to ${order_status}`, req.user.id]);
    res.json({ status: 'success', data: r.rows[0] });
  } catch (e) { next(e); }
}

// ============ COUPONS ============

async function getCoupons(req, res, next) {
  try {
    const r = await query('SELECT c.*, (SELECT COUNT(*) FROM coupon_usages WHERE coupon_id = c.id) AS usage_count FROM coupons c ORDER BY c.created_at DESC');
    res.json({ status: 'success', data: r.rows });
  } catch (e) { next(e); }
}

async function createCoupon(req, res, next) {
  try {
    const { code, description, discount_type, discount_value, max_discount, min_order_amount, usage_limit, expires_at, is_active } = req.body;
    if (!code || !discount_type || !discount_value) return res.status(400).json({ status: 'fail', message: 'Code, discount_type, and discount_value required.' });
    const r = await query('INSERT INTO coupons (code, description, discount_type, discount_value, max_discount, min_order_amount, usage_limit, expires_at, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [code.toUpperCase(), description||null, discount_type, discount_value, max_discount||null, min_order_amount||0, usage_limit||null, expires_at||null, is_active!==false]);
    res.status(201).json({ status: 'success', data: r.rows[0] });
  } catch (e) { if (e.code === '23505') return res.status(400).json({ status: 'fail', message: 'Coupon code exists.' }); next(e); }
}

async function updateCoupon(req, res, next) {
  try {
    const { code, description, discount_type, discount_value, max_discount, min_order_amount, usage_limit, expires_at, is_active } = req.body;
    const r = await query('UPDATE coupons SET code=$1, description=$2, discount_type=$3, discount_value=$4, max_discount=$5, min_order_amount=$6, usage_limit=$7, expires_at=$8, is_active=$9, updated_at=NOW() WHERE id=$10 RETURNING *',
      [code?.toUpperCase(), description, discount_type, discount_value, max_discount||null, min_order_amount||0, usage_limit||null, expires_at||null, is_active, req.params.id]);
    if (!r.rows.length) return res.status(404).json({ status: 'fail', message: 'Coupon not found.' });
    res.json({ status: 'success', data: r.rows[0] });
  } catch (e) { if (e.code === '23505') return res.status(400).json({ status: 'fail', message: 'Coupon code exists.' }); next(e); }
}

async function deleteCoupon(req, res, next) {
  try {
    const r = await query('DELETE FROM coupons WHERE id = $1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ status: 'fail', message: 'Coupon not found.' });
    res.json({ status: 'success', message: 'Coupon deleted.' });
  } catch (e) { next(e); }
}

// ============ REVIEWS ============

async function getReviews(req, res, next) {
  try {
    const { product_id, rating, page = 1 } = req.query;
    const limit = 20; const offset = (page - 1) * limit;
    let where = [], params = [], idx = 1;
    if (product_id) { where.push(`r.product_id = $${idx}`); params.push(product_id); idx++; }
    if (rating) { where.push(`r.rating = $${idx}`); params.push(rating); idx++; }
    const wc = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const [revR, countR] = await Promise.all([
      query(`SELECT r.*, u.name AS user_name, p.name AS product_name FROM reviews r JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id ${wc} ORDER BY r.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`, [...params, limit, offset]),
      query(`SELECT COUNT(*) FROM reviews r ${wc}`, params),
    ]);
    res.json({ status: 'success', data: { reviews: revR.rows, total: parseInt(countR.rows[0].count, 10), page: +page, limit } });
  } catch (e) { next(e); }
}

async function deleteReview(req, res, next) {
  try {
    const r = await query('DELETE FROM reviews WHERE id = $1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ status: 'fail', message: 'Review not found.' });
    res.json({ status: 'success', message: 'Review deleted.' });
  } catch (e) { next(e); }
}

async function toggleReviewVisibility(req, res, next) {
  try {
    const r = await query('UPDATE reviews SET is_visible = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [req.body.is_visible, req.params.id]);
    if (!r.rows.length) return res.status(404).json({ status: 'fail', message: 'Review not found.' });
    res.json({ status: 'success', data: r.rows[0] });
  } catch (e) { next(e); }
}

// ============ SITE SETTINGS ============

async function getSettings(req, res, next) {
  try {
    const r = await query('SELECT key, value, category, label FROM site_settings ORDER BY category, key');
    // Group by category
    const grouped = {};
    r.rows.forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    res.json({ status: 'success', data: grouped });
  } catch (e) { next(e); }
}

async function updateSettings(req, res, next) {
  try {
    const { settings } = req.body; // { key: value, key: value, ... }
    if (!settings || typeof settings !== 'object') return res.status(400).json({ status: 'fail', message: 'Settings object required.' });
    const keys = Object.keys(settings);
    for (const key of keys) {
      await query('UPDATE site_settings SET value = $1, updated_at = NOW() WHERE key = $2', [String(settings[key]), key]);
    }
    res.json({ status: 'success', message: `${keys.length} settings updated.` });
  } catch (e) { next(e); }
}

async function getPublicSettings(req, res, next) {
  try {
    const r = await query("SELECT key, value FROM site_settings WHERE category IN ('general', 'seo', 'social', 'contact')");
    const obj = {};
    r.rows.forEach(s => { obj[s.key] = s.value; });
    res.json({ status: 'success', data: obj });
  } catch (e) { next(e); }
}

module.exports = {
  getDashboardStats,
  getUsers, toggleUserStatus,
  getOrders, updateOrderStatus,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  getReviews, deleteReview, toggleReviewVisibility,
  getSettings, updateSettings, getPublicSettings,
};
