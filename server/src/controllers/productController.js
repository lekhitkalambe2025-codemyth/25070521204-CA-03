import Product from '../models/Product.js';
import { initialProducts } from '../scripts/seed.js';

/**
 * Get active products with filtering, searching, sorting, and pagination
 * GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      sort,
      minPrice,
      maxPrice,
      featured,
      page = 1,
      limit = 12,
      includeInactive,
    } = req.query;

    const query = {};

    // Standard customers only see active products unless includeInactive=true
    if (includeInactive === 'true' || includeInactive === true) {
      // do not filter by active, return all
    } else {
      query.active = true;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search query by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { flavor: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'name-asc') sortOption = { name: 1 };
    else if (sort === 'name-desc') sortOption = { name: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: pageNum,
      pages: Math.ceil(totalProducts / limitNum) || 1,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 * GET /api/products/featured
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ active: true, featured: true }).limit(6);
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by slug
 * GET /api/products/:slug
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with slug '${slug}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare up to 3 products
 * GET /api/products/compare?ids=id1,id2,id3
 */
export const compareProducts = async (req, res, next) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({
        success: false,
        error: 'Please provide comma-separated product IDs to compare',
      });
    }

    const idList = ids.split(',').map((id) => id.trim()).filter(Boolean);
    if (idList.length > 3) {
      return res.status(400).json({
        success: false,
        error: 'You can compare a maximum of 3 products at a time',
      });
    }

    const products = await Product.find({
      $or: [{ _id: { $in: idList } }, { slug: { $in: idList } }],
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product (Admin only)
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      price,
      compareAtPrice,
      image,
      images,
      flavor,
      packSize,
      stockQuantity,
      sku,
      featured,
      active,
      attributes,
      sampleNutrition,
    } = req.body;

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existingSlug = await Product.findOne({ slug: generatedSlug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        error: `Product with slug '${generatedSlug}' already exists`,
      });
    }

    const product = await Product.create({
      name,
      slug: generatedSlug,
      description,
      category,
      price,
      compareAtPrice,
      image: image || '/images/tatva-whey-isolate.png',
      images: images || [image || '/images/tatva-whey-isolate.png'],
      flavor,
      packSize,
      stockQuantity: stockQuantity ?? 50,
      sku: sku || `TATVA-${Date.now()}`,
      featured: Boolean(featured),
      active: active !== undefined ? Boolean(active) : true,
      attributes: attributes || {},
      sampleNutrition: sampleNutrition || undefined,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product details (Admin only)
 * PATCH /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    Object.assign(product, req.body);
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product stock quantity (Admin only)
 * PATCH /api/products/:id/stock
 */
export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    if (stockQuantity === undefined || Number(stockQuantity) < 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a non-negative stock quantity',
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { stockQuantity: Number(stockQuantity) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle product active status (Add / Remove from Store) (Admin only)
 * PATCH /api/products/:id/status
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    product.active = !product.active;
    await product.save();

    return res.status(200).json({
      success: true,
      message: product.active
        ? `"${product.name}" added back to the store successfully`
        : `"${product.name}" removed from the store (you can add it back anytime)`,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products for Admin table (including inactive/removed)
 * GET /api/products/admin/all
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restore default 6 core products with active status & images (Admin only)
 * POST /api/products/admin/reset-defaults
 */
export const resetDefaultProducts = async (req, res, next) => {
  try {
    for (const item of initialProducts) {
      await Product.findOneAndUpdate(
        { slug: item.slug },
        { $set: { ...item, active: true } },
        { upsert: true, new: true }
      );
    }

    const allProducts = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Default 6 core products successfully restored & set to In Store!',
      products: allProducts,
    });
  } catch (error) {
    next(error);
  }
};
