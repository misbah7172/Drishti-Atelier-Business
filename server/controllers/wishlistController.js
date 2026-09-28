const { query } = require('../db/pool');

/**
 * Get user's wishlist
 * GET /api/wishlist
 */
async function getWishlist(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT w.id AS wishlist_id, w.product_id, w.created_at,
              p.name, p.slug, p.sku, p.price, p.compare_price, p.stock,
              p.brand, p.frame_material, p.frame_shape, p.frame_color, p.status,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS image_url
       FROM wishlist_items w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        items: result.rows,
        count: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add product to wishlist
 * POST /api/wishlist
 * Body: { product_id }
 */
async function addToWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        status: 'fail',
        message: 'product_id is required.',
      });
    }

    // Verify product exists
    const prodCheck = await query('SELECT id, name FROM products WHERE id = $1', [product_id]);
    if (prodCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found.',
      });
    }

    await query(
      `INSERT INTO wishlist_items (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [userId, product_id]
    );

    res.status(201).json({
      status: 'success',
      message: 'Product added to wishlist.',
      product_id: parseInt(product_id, 10),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Remove product from wishlist
 * DELETE /api/wishlist/:productId
 */
async function removeFromWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const result = await query(
      'DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2 RETURNING id',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found in wishlist.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product removed from wishlist.',
      product_id: parseInt(productId, 10),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
