const { query } = require('../db/pool');

/**
 * Get user's addresses
 * GET /api/addresses
 */
async function getAddresses(req, res, next) {
  try {
    const result = await query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    next(error);
  }
}

/**
 * Add new address
 * POST /api/addresses
 */
async function addAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { label, full_name, phone, address, city, area, postal_code, is_default } = req.body;

    if (!full_name || !phone || !address || !city) {
      return res.status(400).json({
        status: 'fail',
        message: 'Full name, phone, address, and city are required.',
      });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    }

    // If first address, make it default
    const countResult = await query('SELECT COUNT(*) FROM addresses WHERE user_id = $1', [userId]);
    const isFirst = parseInt(countResult.rows[0].count, 10) === 0;

    const result = await query(
      `INSERT INTO addresses (user_id, label, full_name, phone, address, city, area, postal_code, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, label || 'Home', full_name, phone, address, city, area || null, postal_code || null, is_default || isFirst]
    );

    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * Update address
 * PUT /api/addresses/:id
 */
async function updateAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { label, full_name, phone, address, city, area, postal_code, is_default } = req.body;

    // Verify ownership
    const check = await query('SELECT id FROM addresses WHERE id = $1 AND user_id = $2', [addressId, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Address not found.' });
    }

    if (is_default) {
      await query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    }

    const result = await query(
      `UPDATE addresses SET label = $1, full_name = $2, phone = $3, address = $4,
       city = $5, area = $6, postal_code = $7, is_default = $8, updated_at = NOW()
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [label || 'Home', full_name, phone, address, city, area || null, postal_code || null, is_default || false, addressId, userId]
    );

    res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete address
 * DELETE /api/addresses/:id
 */
async function deleteAddress(req, res, next) {
  try {
    const result = await query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Address not found.' });
    }

    res.status(200).json({ status: 'success', message: 'Address deleted.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
