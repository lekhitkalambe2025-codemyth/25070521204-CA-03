import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

/**
 * Aggregated metrics for Admin Dashboard
 * GET /api/admin/dashboard
 */
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ active: true });
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: 10 },
    }).select('name slug stockQuantity price category');

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Calculate total sales from non-cancelled orders
    const salesAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$total' } } },
    ]);

    const totalRevenue =
      salesAggregation.length > 0 ? salesAggregation[0].totalSales : 0;

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      metrics: {
        totalProducts,
        activeProducts,
        lowStockCount: lowStockProducts.length,
        totalCustomers,
        totalOrders,
        totalReviews,
        totalRevenue,
      },
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};
