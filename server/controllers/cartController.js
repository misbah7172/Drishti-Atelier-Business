const { query } = require('../db/pool');

/**
 * Get user's cart with calculated totals & product details
 * GET /api/cart
 */
async function getCart(req, res, next) {
  try {
    const userId = req.user.id;

    const cartResult = await query(
      `SELECT c.id, c.product_id, c.quantity, c.created_at, c.updated_at,
              p.name, p.slug, p.sku, p.price, p.compare_price, p.stock,
              p.brand, p.frame_color, p.frame_material, p.status,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );

    const items = cartResult.rows.map((item) => {
      const price = parseFloat(item.price);
      return {
        ...item,
        price,
        compare_price: item.compare_price ? parseFloat(item.compare_price) : null,
        line_total: parseFloat((price * item.quantity).toFixed(2)),
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
    const shipping = subtotal > 2000 || items.length === 0 ? 0 : 60;
    const total = subtotal + shipping;
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      status: 'success',
      data: {
        items,
        summary: {
          items_count: itemsCount,
          subtotal: parseFloat(subtotal.toFixed(2)),
          shipping: parseFloat(shipping.toFixed(2)),
          discount: 0,
          total: parseFloat(total.toFixed(2)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add item to cart
 * POST /api/cart
 * Body: { product_id, quantity }
 */
async function addToCart(req, res, next) {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    const qty = parseInt(quantity, 10);
    if (!product_id || isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Valid product_id and positive quantity are required.',
      });
    }

    // Check product existence and stock
    const prodResult = await query(
      'SELECT id, name, price, stock, status FROM products WHERE id = $1',
      [product_id]
    );

    if (prodResult.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found.',
      });
    }

    const product = prodResult.rows[0];
    if (product.status !== 'active') {
      return res.status(400).json({
        status: 'fail',
        message: 'Product is currently unavailable.',
      });
    }

    // Check existing item in cart
    const existing = await query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    let newQuantity = qty;
    if (existing.rows.length > 0) {
      newQuantity = existing.rows[0].quantity + qty;
    }

    if (newQuantity > product.stock) {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot add more than available stock (${product.stock} available).`,
      });
    }

    await query(
      `INSERT INTO cart_items (user_id, product_id, quantity, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = $3, updated_at = NOW()`,
      [userId, product_id, newQuantity]
    );

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * Update cart item quantity
 * PUT /api/cart/:id
 * Body: { quantity }
 */
async function updateCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Valid quantity number is required.',
      });
    }

    // If quantity is 0 or less, remove item
    if (qty <= 0) {
      await query(
        'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
        [itemId, userId]
      );
      return getCart(req, res, next);
    }

    // Get item & product stock
    const itemResult = await query(
      `SELECT c.id, c.product_id, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = $1 AND c.user_id = $2`,
      [itemId, userId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cart item not found.',
      });
    }

    const { stock } = itemResult.rows[0];
    if (qty > stock) {
      return res.status(400).json({
        status: 'fail',
        message: `Quantity exceeds available stock (${stock} available).`,
      });
    }

    await query(
      'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3',
      [qty, itemId, userId]
    );

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * Remove item from cart
 * DELETE /api/cart/:id
 */
async function removeCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const result = await query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cart item not found.',
      });
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * Clear entire cart
 * DELETE /api/cart
 */
async function clearCart(req, res, next) {
  try {
    const userId = req.user.id;
    await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully.',
      data: {
        items: [],
        summary: {
          items_count: 0,
          subtotal: 0,
          shipping: 0,
          discount: 0,
          total: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Merge guest cart into user cart upon login
 * POST /api/cart/merge
 * Body: { items: [ { product_id, quantity } ] }
 */
async function mergeCart(req, res, next) {
  try {
    const userId = req.user.id;
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return getCart(req, res, next);
    }

    for (const item of items) {
      const prodId = item.product_id || item.id;
      const qty = parseInt(item.quantity, 10) || 1;

      if (!prodId || qty <= 0) continue;

      const prodCheck = await query('SELECT stock, status FROM products WHERE id = $1', [prodId]);
      if (prodCheck.rows.length === 0 || prodCheck.rows[0].status !== 'active') continue;

      const stock = prodCheck.rows[0].stock;

      const existing = await query(
        'SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [userId, prodId]
      );

      let finalQty = qty;
      if (existing.rows.length > 0) {
        finalQty = Math.min(existing.rows[0].quantity + qty, stock);
      } else {
        finalQty = Math.min(qty, stock);
      }

      await query(
        `INSERT INTO cart_items (user_id, product_id, quantity, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = $3, updated_at = NOW()`,
        [userId, prodId, finalQty]
      );
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
};
