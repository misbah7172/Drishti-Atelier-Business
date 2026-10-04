const { query, getClient } = require('../db/pool');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const fs = require('fs');

/**
 * Slugify helper
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
 * GET /api/products
 * Public list of products with search, filter, sort, pagination
 */
async function getProducts(req, res, next) {
  try {
    const {
      search,
      category,
      subcategory,
      gender,
      frame_shape,
      frame_material,
      min_price,
      max_price,
      in_stock,
      featured,
      bestseller,
      new_arrival,
      tag,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = ["p.status = 'active'"];
    const queryParams = [];

    // Search term
    if (search && search.trim()) {
      queryParams.push(`%${search.trim()}%`);
      const paramIdx = queryParams.length;
      whereConditions.push(
        `(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx} OR p.brand ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx})`
      );
    }

    // Category filter
    if (category) {
      if (!isNaN(category)) {
        queryParams.push(parseInt(category));
        whereConditions.push(`p.category_id = $${queryParams.length}`);
      } else {
        queryParams.push(category.toLowerCase());
        whereConditions.push(`c.slug = $${queryParams.length}`);
      }
    }

    // Subcategory filter
    if (subcategory) {
      if (!isNaN(subcategory)) {
        queryParams.push(parseInt(subcategory));
        whereConditions.push(`p.subcategory_id = $${queryParams.length}`);
      } else {
        queryParams.push(subcategory.toLowerCase());
        whereConditions.push(`sc.slug = $${queryParams.length}`);
      }
    }

    // Gender filter
    if (gender) {
      queryParams.push(gender.toLowerCase());
      whereConditions.push(`p.gender = $${queryParams.length}`);
    }

    // Frame Shape
    if (frame_shape) {
      queryParams.push(`%${frame_shape.trim()}%`);
      whereConditions.push(`p.frame_shape ILIKE $${queryParams.length}`);
    }

    // Frame Material
    if (frame_material) {
      const cleanMat = frame_material.trim().replace(/-/g, '');
      queryParams.push(`%${cleanMat}%`);
      whereConditions.push(`REPLACE(p.frame_material, '-', '') ILIKE $${queryParams.length}`);
    }

    // Min Price
    if (min_price && !isNaN(min_price)) {
      queryParams.push(parseFloat(min_price));
      whereConditions.push(`p.price >= $${queryParams.length}`);
    }

    // Max Price
    if (max_price && !isNaN(max_price)) {
      queryParams.push(parseFloat(max_price));
      whereConditions.push(`p.price <= $${queryParams.length}`);
    }

    // In Stock
    if (in_stock === 'true') {
      whereConditions.push('p.stock > 0');
    }

    // Featured / Bestseller / New Arrival
    if (featured === 'true') {
      whereConditions.push('p.featured = true');
    }
    if (bestseller === 'true') {
      whereConditions.push('p.bestseller = true');
    }
    if (new_arrival === 'true') {
      whereConditions.push('p.new_arrival = true');
    }

    // Tag filter
    if (tag) {
      queryParams.push(tag.toLowerCase());
      whereConditions.push(
        `p.id IN (SELECT pt.product_id FROM product_tags pt JOIN tags t ON pt.tag_id = t.id WHERE t.slug = $${queryParams.length} OR t.name ILIKE $${queryParams.length})`
      );
    }

    const whereClause = whereConditions.join(' AND ');

    // Order By
    let orderByClause = 'p.created_at DESC';
    if (sort === 'price_asc') {
      orderByClause = 'p.price ASC';
    } else if (sort === 'price_desc') {
      orderByClause = 'p.price DESC';
    } else if (sort === 'popular') {
      orderByClause = 'p.bestseller DESC, p.created_at DESC';
    } else if (sort === 'name_asc') {
      orderByClause = 'p.name ASC';
    }

    // Count Total
    const countSql = `
      SELECT COUNT(DISTINCT p.id) 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE ${whereClause}
    `;
    const countResult = await query(countSql, queryParams);
    const totalItems = parseInt(countResult.rows[0].count) || 0;
    const totalPages = Math.ceil(totalItems / limitNum);

    // Fetch Products with primary image & category info
    queryParams.push(limitNum);
    const limitIdx = queryParams.length;
    queryParams.push(offset);
    const offsetIdx = queryParams.length;

    const dataSql = `
      SELECT p.*,
             c.name AS category_name, c.slug AS category_slug,
             sc.name AS subcategory_name, sc.slug AS subcategory_slug,
             (
               SELECT image_url FROM product_images pi 
               WHERE pi.product_id = p.id 
               ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC 
               LIMIT 1
             ) AS primary_image,
             COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id), 5.0)::NUMERIC(2,1) AS average_rating,
             COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id), 0) AS review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const productsResult = await query(dataSql, queryParams);

    res.status(200).json({
      status: 'success',
      data: {
        products: productsResult.rows,
        pagination: {
          total: totalItems,
          page: pageNum,
          limit: limitNum,
          totalPages: totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/featured
 * Get featured products for landing sections
 */
async function getFeaturedProducts(req, res, next) {
  try {
    const sql = `
      SELECT p.*,
             c.name AS category_name, c.slug AS category_slug,
             (
               SELECT image_url FROM product_images pi 
               WHERE pi.product_id = p.id 
               ORDER BY pi.is_primary DESC, pi.sort_order ASC 
               LIMIT 1
             ) AS primary_image,
             COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id), 5.0)::NUMERIC(2,1) AS average_rating,
             COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id), 0) AS review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active' AND (p.featured = true OR p.bestseller = true OR p.new_arrival = true)
      ORDER BY p.featured DESC, p.bestseller DESC, p.created_at DESC
      LIMIT 12
    `;

    const result = await query(sql);

    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:idOrSlug
 * Get detailed product info
 */
async function getProductByIdOrSlug(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    const isId = !isNaN(idOrSlug);

    const sql = `
      SELECT p.*,
             c.name AS category_name, c.slug AS category_slug,
             sc.name AS subcategory_name, sc.slug AS subcategory_slug,
             COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id), 5.0)::NUMERIC(2,1) AS average_rating,
             COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id), 0) AS review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE ${isId ? 'p.id = $1' : 'p.slug = $1'}
    `;

    const result = await query(sql, [idOrSlug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    const product = result.rows[0];

    // Fetch images
    const imagesResult = await query(
      'SELECT id, image_url, cloudinary_public_id, alt_text, sort_order, is_primary FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC, id ASC',
      [product.id]
    );
    product.images = imagesResult.rows;

    // Fetch tags
    const tagsResult = await query(
      'SELECT t.id, t.name, t.slug FROM tags t JOIN product_tags pt ON t.id = pt.tag_id WHERE pt.product_id = $1',
      [product.id]
    );
    product.tags = tagsResult.rows;

    // Fetch recent reviews
    const reviewsResult = await query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = $1 AND r.is_visible = true
       ORDER BY r.created_at DESC LIMIT 5`,
      [product.id]
    );
    product.reviews = reviewsResult.rows;

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products (Admin only)
 */
async function createProduct(req, res, next) {
  try {
    const {
      name,
      sku,
      description,
      short_description,
      price,
      compare_price,
      stock,
      low_stock_threshold,
      category_id,
      subcategory_id,
      brand,
      frame_material,
      frame_shape,
      frame_color,
      gender,
      size,
      status,
      featured,
      bestseller,
      new_arrival,
      image_urls,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ status: 'fail', message: 'Product name and price are required.' });
    }

    const slug = slugify(name) + '-' + Math.floor(1000 + Math.random() * 9000);

    const result = await query(
      `INSERT INTO products (
        name, slug, sku, description, short_description, price, compare_price, 
        stock, low_stock_threshold, category_id, subcategory_id, brand, 
        frame_material, frame_shape, frame_color, gender, size, status, 
        featured, bestseller, new_arrival
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *`,
      [
        name.trim(),
        slug,
        sku || null,
        description || null,
        short_description || null,
        parseFloat(price),
        compare_price ? parseFloat(compare_price) : null,
        parseInt(stock) || 0,
        parseInt(low_stock_threshold) || 5,
        category_id ? parseInt(category_id) : null,
        subcategory_id ? parseInt(subcategory_id) : null,
        brand || 'Vision Standard',
        frame_material || null,
        frame_shape || null,
        frame_color || null,
        gender || 'unisex',
        size || 'Medium',
        status || 'active',
        featured === true || featured === 'true',
        bestseller === true || bestseller === 'true',
        new_arrival === true || new_arrival === 'true',
      ]
    );

    const product = result.rows[0];

    // If image URLs were provided in payload
    if (image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
      for (let i = 0; i < image_urls.length; i++) {
        await query(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ($1, $2, $3, $4)',
          [product.id, image_urls[i], i === 0, i]
        );
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully!',
      data: product,
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ status: 'fail', message: 'Product with this SKU or slug already exists.' });
    }
    next(error);
  }
}

/**
 * PUT /api/products/:id (Admin only)
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    const current = existing.rows[0];

    const result = await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        short_description = COALESCE($3, short_description),
        price = COALESCE($4, price),
        compare_price = $5,
        stock = COALESCE($6, stock),
        low_stock_threshold = COALESCE($7, low_stock_threshold),
        category_id = $8,
        subcategory_id = $9,
        brand = COALESCE($10, brand),
        frame_material = COALESCE($11, frame_material),
        frame_shape = COALESCE($12, frame_shape),
        frame_color = COALESCE($13, frame_color),
        gender = COALESCE($14, gender),
        size = COALESCE($15, size),
        status = COALESCE($16, status),
        featured = COALESCE($17, featured),
        bestseller = COALESCE($18, bestseller),
        new_arrival = COALESCE($19, new_arrival),
        updated_at = NOW()
       WHERE id = $20
       RETURNING *`,
      [
        body.name ? body.name.trim() : null,
        body.description !== undefined ? body.description : null,
        body.short_description !== undefined ? body.short_description : null,
        body.price ? parseFloat(body.price) : null,
        body.compare_price !== undefined ? (body.compare_price ? parseFloat(body.compare_price) : null) : current.compare_price,
        body.stock !== undefined ? parseInt(body.stock) : null,
        body.low_stock_threshold !== undefined ? parseInt(body.low_stock_threshold) : null,
        body.category_id !== undefined ? (body.category_id ? parseInt(body.category_id) : null) : current.category_id,
        body.subcategory_id !== undefined ? (body.subcategory_id ? parseInt(body.subcategory_id) : null) : current.subcategory_id,
        body.brand || null,
        body.frame_material || null,
        body.frame_shape || null,
        body.frame_color || null,
        body.gender || null,
        body.size || null,
        body.status || null,
        body.featured !== undefined ? (body.featured === true || body.featured === 'true') : null,
        body.bestseller !== undefined ? (body.bestseller === true || body.bestseller === 'true') : null,
        body.new_arrival !== undefined ? (body.new_arrival === true || body.new_arrival === 'true') : null,
        id,
      ]
    );

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id (Admin only)
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products/:id/images (Admin only - Upload images)
 */
async function uploadProductImages(req, res, next) {
  try {
    const { id } = req.params;

    const prodCheck = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (prodCheck.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'No image files uploaded.' });
    }

    const uploadedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      let imageUrl = '';
      let publicId = '';

      try {
        // Upload to Cloudinary if configured, else store relative local path
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
          const cloudRes = await uploadImage(file.path, { folder: 'vision-eye-care/products' });
          imageUrl = cloudRes.secure_url;
          publicId = cloudRes.public_id;
          // Delete local temp file
          fs.unlinkSync(file.path);
        } else {
          imageUrl = `/uploads/${file.filename}`;
        }

        // Check if primary image already exists for product
        const existingImages = await query('SELECT COUNT(*) FROM product_images WHERE product_id = $1', [id]);
        const isPrimary = parseInt(existingImages.rows[0].count) === 0 && i === 0;

        const imgResult = await query(
          `INSERT INTO product_images (product_id, image_url, cloudinary_public_id, is_primary, sort_order)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [id, imageUrl, publicId || null, isPrimary, i]
        );

        uploadedImages.push(imgResult.rows[0]);
      } catch (err) {
        console.error('Image upload failed for file:', file.filename, err.message);
      }
    }

    res.status(200).json({
      status: 'success',
      message: `${uploadedImages.length} images uploaded successfully!`,
      data: uploadedImages,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id/images/:imageId (Admin only)
 */
async function deleteProductImage(req, res, next) {
  try {
    const { id, imageId } = req.params;

    const imgResult = await query('SELECT * FROM product_images WHERE id = $1 AND product_id = $2', [imageId, id]);
    if (imgResult.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Image not found.' });
    }

    const image = imgResult.rows[0];

    if (image.cloudinary_public_id) {
      try {
        await deleteImage(image.cloudinary_public_id);
      } catch (e) {
        console.warn('Cloudinary image deletion error:', e.message);
      }
    }

    await query('DELETE FROM product_images WHERE id = $1', [imageId]);

    res.status(200).json({
      status: 'success',
      message: 'Product image deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
};
