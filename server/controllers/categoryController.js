const { query } = require('../db/pool');

/**
 * Helper to slugify string
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * GET /api/categories
 * List all categories with their associated subcategories
 */
async function getCategories(req, res, next) {
  try {
    const categoriesResult = await query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status = 'active') AS product_count
       FROM categories c
       WHERE c.is_active = true
       ORDER BY c.sort_order ASC, c.name ASC`
    );

    const subcategoriesResult = await query(
      `SELECT * FROM subcategories WHERE is_active = true ORDER BY sort_order ASC, name ASC`
    );

    const categories = categoriesResult.rows.map((cat) => ({
      ...cat,
      subcategories: subcategoriesResult.rows.filter((sub) => sub.category_id === cat.id),
    }));

    res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/categories/:idOrSlug
 */
async function getCategoryByIdOrSlug(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    const isId = !isNaN(idOrSlug);

    const sql = isId
      ? 'SELECT * FROM categories WHERE id = $1'
      : 'SELECT * FROM categories WHERE slug = $1';

    const result = await query(sql, [idOrSlug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Category not found.' });
    }

    const category = result.rows[0];

    const subsResult = await query(
      'SELECT * FROM subcategories WHERE category_id = $1 AND is_active = true ORDER BY sort_order ASC, name ASC',
      [category.id]
    );

    category.subcategories = subsResult.rows;

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/categories (Admin only)
 */
async function createCategory(req, res, next) {
  try {
    const { name, description, image_url, sort_order } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Category name is required.' });
    }

    const slug = slugify(name);

    const result = await query(
      `INSERT INTO categories (name, slug, description, image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), slug, description || null, image_url || null, sort_order || 0]
    );

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ status: 'fail', message: 'Category with this name already exists.' });
    }
    next(error);
  }
}

/**
 * PUT /api/categories/:id (Admin only)
 */
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, image_url, is_active, sort_order } = req.body;

    const existing = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Category not found.' });
    }

    const category = existing.rows[0];
    const newName = name ? name.trim() : category.name;
    const newSlug = name ? slugify(name) : category.slug;

    const result = await query(
      `UPDATE categories
       SET name = $1, slug = $2, description = $3, image_url = $4, is_active = $5, sort_order = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        newName,
        newSlug,
        description !== undefined ? description : category.description,
        image_url !== undefined ? image_url : category.image_url,
        is_active !== undefined ? is_active : category.is_active,
        sort_order !== undefined ? sort_order : category.sort_order,
        id,
      ]
    );

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/categories/:id (Admin only)
 */
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    // Check if category has products
    const prodCount = await query('SELECT COUNT(*) FROM products WHERE category_id = $1', [id]);
    if (parseInt(prodCount.rows[0].count) > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot delete category that contains existing products. Reassign or delete products first.',
      });
    }

    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Category not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
