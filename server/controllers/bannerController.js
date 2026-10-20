const { query, getClient } = require('../db/pool');
const { uploadImage } = require('../config/cloudinary');
const fs = require('fs');

/**
 * GET /api/banners
 * Public route to fetch active banners for storefront
 * Query param: ?section=hero
 */
async function getPublicBanners(req, res, next) {
  try {
    const { section = 'hero' } = req.query;

    const result = await query(
      `SELECT * FROM banners 
       WHERE is_active = true AND section = $1
       ORDER BY sort_order ASC, id ASC`,
      [section]
    );

    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/banners
 * Admin route to list all banners (including inactive)
 * Query param: ?section=hero (optional)
 */
async function getAdminBanners(req, res, next) {
  try {
    const { section } = req.query;

    let sql = 'SELECT * FROM banners';
    const params = [];

    if (section && section !== 'all') {
      sql += ' WHERE section = $1';
      params.push(section);
    }

    sql += ' ORDER BY sort_order ASC, id ASC';

    const result = await query(sql, params);

    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/banners/:id
 */
async function getBannerById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM banners WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Banner not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/banners
 * Create a new banner (supports JSON or multipart form-data file upload)
 */
async function createBanner(req, res, next) {
  try {
    const {
      title,
      subtitle = '',
      badge = '',
      cta_text = 'Explore Collection',
      cta_link = '/shop',
      section = 'hero',
      sort_order,
      is_active = true,
    } = req.body;

    let image_url = req.body.image_url;

    // Handle file upload if present
    if (req.file) {
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
          const cloudRes = await uploadImage(req.file.path, {
            folder: 'drishti/banners',
            transformation: [{ width: 1600, quality: 'auto', fetch_format: 'auto' }],
          });
          image_url = cloudRes.secure_url;
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        } else {
          image_url = `/uploads/${req.file.filename}`;
        }
      } catch (uploadErr) {
        console.error('Failed to upload image:', uploadErr);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to process banner image file.',
        });
      }
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Banner title is required.' });
    }

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Banner image is required (upload file or specify URL).' });
    }

    // Auto-calculate sort order if not given
    let finalSortOrder = parseInt(sort_order, 10);
    if (isNaN(finalSortOrder)) {
      const maxOrderRes = await query(
        'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM banners WHERE section = $1',
        [section]
      );
      finalSortOrder = parseInt(maxOrderRes.rows[0].next_order, 10) || 1;
    }

    const insertRes = await query(
      `INSERT INTO banners (title, subtitle, badge, image_url, cta_text, cta_link, section, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title.trim(),
        subtitle ? subtitle.trim() : '',
        badge ? badge.trim() : '',
        image_url.trim(),
        cta_text ? cta_text.trim() : 'Explore Collection',
        cta_link ? cta_link.trim() : '/shop',
        section,
        finalSortOrder,
        is_active === 'true' || is_active === true,
      ]
    );

    res.status(201).json({
      status: 'success',
      data: insertRes.rows[0],
      message: 'Banner created successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/banners/:id
 * Update an existing banner
 */
async function updateBanner(req, res, next) {
  try {
    const { id } = req.params;

    const checkRes = await query('SELECT * FROM banners WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Banner not found.' });
    }

    const existing = checkRes.rows[0];
    let image_url = req.body.image_url || existing.image_url;

    // Handle uploaded file if present
    if (req.file) {
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
          const cloudRes = await uploadImage(req.file.path, {
            folder: 'drishti/banners',
            transformation: [{ width: 1600, quality: 'auto', fetch_format: 'auto' }],
          });
          image_url = cloudRes.secure_url;
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        } else {
          image_url = `/uploads/${req.file.filename}`;
        }
      } catch (uploadErr) {
        console.error('Failed to upload image:', uploadErr);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to process banner image file.',
        });
      }
    }

    const {
      title = existing.title,
      subtitle = existing.subtitle,
      badge = existing.badge,
      cta_text = existing.cta_text,
      cta_link = existing.cta_link,
      section = existing.section,
      sort_order = existing.sort_order,
      is_active = existing.is_active,
    } = req.body;

    const updateRes = await query(
      `UPDATE banners 
       SET title = $1, subtitle = $2, badge = $3, image_url = $4, cta_text = $5,
           cta_link = $6, section = $7, sort_order = $8, is_active = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        title ? title.trim() : existing.title,
        subtitle !== undefined ? subtitle.trim() : existing.subtitle,
        badge !== undefined ? badge.trim() : existing.badge,
        image_url.trim(),
        cta_text ? cta_text.trim() : existing.cta_text,
        cta_link ? cta_link.trim() : existing.cta_link,
        section || existing.section,
        parseInt(sort_order, 10) || existing.sort_order,
        is_active === 'true' || is_active === true,
        id,
      ]
    );

    res.status(200).json({
      status: 'success',
      data: updateRes.rows[0],
      message: 'Banner updated successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/banners/:id
 */
async function deleteBanner(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM banners WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Banner not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Banner deleted successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/banners/:id/toggle
 * Toggle is_active status
 */
async function toggleBannerStatus(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE banners 
       SET is_active = NOT is_active, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Banner not found.' });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
      message: `Banner ${result.rows[0].is_active ? 'activated' : 'deactivated'}.`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/banners/reorder
 * Bulk reorder banners: body: { items: [{ id: 1, sort_order: 1 }, ...] }
 */
async function reorderBanners(req, res, next) {
  const client = await getClient();
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Items array required for reordering.' });
    }

    await client.query('BEGIN');

    for (const item of items) {
      await client.query(
        'UPDATE banners SET sort_order = $1, updated_at = NOW() WHERE id = $2',
        [parseInt(item.sort_order, 10), item.id]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Banners reordered successfully.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
}

module.exports = {
  getPublicBanners,
  getAdminBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  reorderBanners,
};
