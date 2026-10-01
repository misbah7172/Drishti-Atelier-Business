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

module.exports = { getDashboardStats };
