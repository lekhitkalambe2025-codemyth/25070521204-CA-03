import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

/**
 * Get customer wishlist
 * GET /api/wishlist
 */
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Filter out inactive products if any
    const activeProducts = (wishlist.products || []).filter(
      (p) => p && p.active
    );

    return res.status(200).json({
      success: true,
      count: activeProducts.length,
      wishlist: activeProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product to wishlist
 * POST /api/wishlist/:productId
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or inactive',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const exists = wishlist.products.some(
      (p) => p.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate('products');

    return res.status(200).json({
      success: true,
      message: `${product.name} saved to your wishlist`,
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove product from wishlist
 * DELETE /api/wishlist/:productId
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: [],
      });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('products');

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};
