const { query } = require('../db/pool');

/**
 * Get reviews for a product
 * GET /api/products/:id/reviews
 */
async function getProductReviews(req, res, next) {
  try {
    const productId = req.params.id;

    const result = await query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 AND r.is_visible = true
       ORDER BY r.created_at DESC`,
      [productId]
    );

    // Calculate average
    const reviews = result.rows;
    const avgRating = reviews.length > 0
      ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        reviews,
        count: reviews.length,
        average_rating: avgRating,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a review (must have purchased the product)
 * POST /api/products/:id/reviews
 * Body: { rating, comment }
 */
async function createReview(req, res, next) {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'fail',
        message: 'Rating must be between 1 and 5.',
      });
    }

    // Check if user has purchased this product
    const purchaseCheck = await query(
      `SELECT oi.order_id FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = $1 AND oi.product_id = $2
         AND o.order_status NOT IN ('cancelled')
       LIMIT 1`,
      [userId, productId]
    );

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only review products you have purchased.',
      });
    }

    // Check if already reviewed
    const existingReview = await query(
      'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingReview.rows.length > 0) {
      // Update existing review
      const result = await query(
        `UPDATE reviews SET rating = $1, comment = $2, updated_at = NOW()
         WHERE user_id = $3 AND product_id = $4
         RETURNING *`,
        [rating, comment || null, userId, productId]
      );
      return res.status(200).json({
        status: 'success',
        message: 'Review updated.',
        data: result.rows[0],
      });
    }

    // Create new review with the order_id
    const orderId = purchaseCheck.rows[0].order_id;
    const result = await query(
      `INSERT INTO reviews (user_id, product_id, order_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, productId, orderId, rating, comment || null]
    );

    res.status(201).json({
      status: 'success',
      message: 'Review submitted.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProductReviews, createReview };
