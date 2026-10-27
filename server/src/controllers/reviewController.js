import Review from '../models/Review.js';
import Product from '../models/Product.js';

/**
 * Helper to recalculate and save average rating & review count for a product
 */
const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating =
    numReviews > 0
      ? Number(
          (
            reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
          ).toFixed(1)
        )
      : 0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

/**
 * Get all reviews for a product
 * GET /api/reviews/product/:productId
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product review
 * POST /api/reviews/product/:productId
 */
export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be an integer between 1 and 5',
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Review comment cannot be empty',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted a review for this product',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      userName: req.user.name,
      rating: Number(rating),
      title: (title || '').trim(),
      comment: comment.trim(),
    });

    await recalculateProductRating(productId);

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing review
 * PATCH /api/reviews/:id
 */
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this review',
      });
    }

    if (rating !== undefined) {
      if (Number(rating) < 1 || Number(rating) > 5) {
        return res.status(400).json({
          success: false,
          error: 'Rating must be between 1 and 5',
        });
      }
      review.rating = Number(rating);
    }

    if (title !== undefined) review.title = title.trim();
    if (comment !== undefined) review.comment = comment.trim();

    await review.save();
    await recalculateProductRating(review.product);

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a review
 * DELETE /api/reviews/:id
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review',
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(id);
    await recalculateProductRating(productId);

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reviews for moderation (Admin only)
 * GET /api/reviews/admin/all
 */
export const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name slug image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
