const { query } = require('../db/pool');

/**
 * Validate a coupon code
 * POST /api/orders/validate-coupon
 * Body: { code, subtotal }
 */
async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Coupon code is required.' });
    }

    const result = await query(
      `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) AND is_active = true`,
      [code.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Invalid coupon code.' });
    }

    const coupon = result.rows[0];

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ status: 'fail', message: 'This coupon has expired.' });
    }

    // Check start date
    if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
      return res.status(400).json({ status: 'fail', message: 'This coupon is not yet active.' });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ status: 'fail', message: 'This coupon has reached its usage limit.' });
    }

    // Check if user already used this coupon
    if (req.user) {
      const usageCheck = await query(
        'SELECT id FROM coupon_usages WHERE coupon_id = $1 AND user_id = $2',
        [coupon.id, req.user.id]
      );
      if (usageCheck.rows.length > 0) {
        return res.status(400).json({ status: 'fail', message: 'You have already used this coupon.' });
      }
    }

    // Check minimum order amount
    const orderSubtotal = parseFloat(subtotal);
    if (coupon.min_order_amount && orderSubtotal < parseFloat(coupon.min_order_amount)) {
      return res.status(400).json({
        status: 'fail',
        message: `Minimum order of ৳${parseFloat(coupon.min_order_amount).toFixed(0)} required for this coupon.`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderSubtotal * parseFloat(coupon.discount_value)) / 100;
      if (coupon.max_discount) {
        discount = Math.min(discount, parseFloat(coupon.max_discount));
      }
    } else {
      discount = parseFloat(coupon.discount_value);
    }
    discount = parseFloat(discount.toFixed(2));

    res.status(200).json({
      status: 'success',
      data: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: parseFloat(coupon.discount_value),
        discount,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new order (full transaction)
 * POST /api/orders
 * Body: { shipping_name, shipping_phone, shipping_address, shipping_city,
 *         shipping_area, shipping_postal_code, coupon_code, notes }
 */
async function createOrder(req, res, next) {
  const { getClient } = require('../db/pool');
  const client = await getClient();

  try {
    const userId = req.user.id;
    const {
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_area,
      shipping_postal_code,
      coupon_code,
      notes,
    } = req.body;

    // Validate required shipping fields
    if (!shipping_name || !shipping_phone || !shipping_address || !shipping_city) {
      client.release();
      return res.status(400).json({
        status: 'fail',
        message: 'Shipping name, phone, address, and city are required.',
      });
    }

    await client.query('BEGIN');

    // 1. Get cart items with current product data
    const cartResult = await client.query(
      `SELECT c.id AS cart_item_id, c.product_id, c.quantity,
              p.name, p.slug, p.sku, p.price, p.stock, p.status,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       FOR UPDATE OF p`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ status: 'fail', message: 'Your cart is empty.' });
    }

    // 2. Validate stock for all items
    const stockErrors = [];
    for (const item of cartResult.rows) {
      if (item.status !== 'active') {
        stockErrors.push(`${item.name} is no longer available.`);
      } else if (item.quantity > item.stock) {
        stockErrors.push(`${item.name}: only ${item.stock} in stock (you have ${item.quantity}).`);
      }
    }

    if (stockErrors.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({
        status: 'fail',
        message: 'Stock issues found.',
        errors: stockErrors,
      });
    }

    // 3. Calculate subtotal (backend recalculates everything)
    let subtotal = 0;
    const orderItems = cartResult.rows.map((item) => {
      const price = parseFloat(item.price);
      const itemTotal = parseFloat((price * item.quantity).toFixed(2));
      subtotal += itemTotal;
      return {
        product_id: item.product_id,
        product_name: item.name,
        product_slug: item.slug,
        sku: item.sku,
        price,
        quantity: item.quantity,
        subtotal: itemTotal,
        image_url: item.image_url,
      };
    });
    subtotal = parseFloat(subtotal.toFixed(2));

    // 4. Apply coupon if provided
    let discount = 0;
    let couponId = null;

    if (coupon_code && coupon_code.trim()) {
      const couponResult = await client.query(
        `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) AND is_active = true`,
        [coupon_code.trim()]
      );

      if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];
        const now = new Date();

        const isValid =
          (!coupon.expires_at || new Date(coupon.expires_at) >= now) &&
          (!coupon.starts_at || new Date(coupon.starts_at) <= now) &&
          (!coupon.usage_limit || coupon.used_count < coupon.usage_limit) &&
          (!coupon.min_order_amount || subtotal >= parseFloat(coupon.min_order_amount));

        // Check user usage
        const usageCheck = await client.query(
          'SELECT id FROM coupon_usages WHERE coupon_id = $1 AND user_id = $2',
          [coupon.id, userId]
        );

        if (isValid && usageCheck.rows.length === 0) {
          couponId = coupon.id;
          if (coupon.discount_type === 'percentage') {
            discount = (subtotal * parseFloat(coupon.discount_value)) / 100;
            if (coupon.max_discount) {
              discount = Math.min(discount, parseFloat(coupon.max_discount));
            }
          } else {
            discount = parseFloat(coupon.discount_value);
          }
          discount = parseFloat(discount.toFixed(2));
        }
      }
    }

    // 5. Calculate shipping & total
    const shipping = subtotal > 2000 ? 0 : 60;
    const total = parseFloat((subtotal - discount + shipping).toFixed(2));

    // 6. Generate unique order number
    const orderNumber = `DRI-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 7. Create order
    const orderResult = await client.query(
      `INSERT INTO orders
        (user_id, order_number, subtotal, discount, shipping_fee, total,
         coupon_id, payment_method, payment_status, order_status,
         shipping_name, shipping_phone, shipping_address, shipping_city,
         shipping_area, shipping_postal_code, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'cod','pending','pending',$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        userId, orderNumber, subtotal, discount, shipping, total,
        couponId, shipping_name, shipping_phone, shipping_address,
        shipping_city, shipping_area || null, shipping_postal_code || null, notes || null,
      ]
    );
    const order = orderResult.rows[0];

    // 8. Create order items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, product_slug, sku, price, quantity, subtotal, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [order.id, item.product_id, item.product_name, item.product_slug,
         item.sku, item.price, item.quantity, item.subtotal, item.image_url]
      );
    }

    // 9. Reduce stock
    for (const item of orderItems) {
      await client.query(
        'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // 10. Record coupon usage
    if (couponId) {
      await client.query(
        'INSERT INTO coupon_usages (coupon_id, user_id, order_id) VALUES ($1,$2,$3)',
        [couponId, userId, order.id]
      );
      await client.query(
        'UPDATE coupons SET used_count = used_count + 1, updated_at = NOW() WHERE id = $1',
        [couponId]
      );
    }

    // 11. Create payment record (COD)
    await client.query(
      `INSERT INTO payments (order_id, payment_method, amount, status) VALUES ($1,'cod',$2,'pending')`,
      [order.id, total]
    );

    // 12. Create initial status history
    await client.query(
      `INSERT INTO order_status_history (order_id, status, note, changed_by)
       VALUES ($1, 'pending', 'Order placed successfully', $2)`,
      [order.id, userId]
    );

    // 13. Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    // COMMIT
    await client.query('COMMIT');
    client.release();

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully!',
      data: {
        id: order.id,
        order_number: order.order_number,
        total: parseFloat(order.total),
        items_count: orderItems.length,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    next(error);
  }
}

/**
 * Get user's orders
 * GET /api/orders
 */
async function getOrders(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT o.*, 
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );

    const orders = result.rows.map((o) => ({
      ...o,
      subtotal: parseFloat(o.subtotal),
      discount: parseFloat(o.discount),
      shipping_fee: parseFloat(o.shipping_fee),
      total: parseFloat(o.total),
      items_count: parseInt(o.items_count, 10),
    }));

    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single order details
 * GET /api/orders/:id
 */
async function getOrderById(req, res, next) {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id',
      [order.id]
    );

    // Get status history
    const historyResult = await query(
      `SELECT osh.*, u.name AS changed_by_name
       FROM order_status_history osh
       LEFT JOIN users u ON osh.changed_by = u.id
       WHERE osh.order_id = $1
       ORDER BY osh.created_at ASC`,
      [order.id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        ...order,
        subtotal: parseFloat(order.subtotal),
        discount: parseFloat(order.discount),
        shipping_fee: parseFloat(order.shipping_fee),
        total: parseFloat(order.total),
        items: itemsResult.rows.map((i) => ({
          ...i,
          price: parseFloat(i.price),
          subtotal: parseFloat(i.subtotal),
        })),
        status_history: historyResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateCoupon,
  createOrder,
  getOrders,
  getOrderById,
};
