import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

/**
 * Place a new simulated order
 * POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        error: 'Complete shipping address is required',
      });
    }

    const validPaymentMethods = [
      'Simulated Cash on Delivery',
      'Simulated Online Payment',
    ];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error:
          'Payment method must be either "Simulated Cash on Delivery" or "Simulated Online Payment"',
      });
    }

    // 1. Fetch real product prices from database & check stock
    let subtotal = 0;
    const verifiedItems = [];
    const stockUpdates = [];

    for (const item of items) {
      const productId = item.product?._id || item.product || item.productId;
      const requestedQty = parseInt(item.quantity, 10);

      if (!productId || isNaN(requestedQty) || requestedQty <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product or quantity in order payload',
        });
      }

      const product = await Product.findById(productId);
      if (!product || !product.active) {
        return res.status(400).json({
          success: false,
          error: `Product "${item.name || productId}" is no longer available`,
        });
      }

      if (product.stockQuantity < requestedQty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${requestedQty}`,
        });
      }

      const itemSubtotal = product.price * requestedQty;
      subtotal += itemSubtotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: requestedQty,
        subtotal: itemSubtotal,
        image: product.image,
      });

      stockUpdates.push({
        product,
        newStock: product.stockQuantity - requestedQty,
      });
    }

    // 2. Safe compensation / stock reduction
    for (const update of stockUpdates) {
      update.product.stockQuantity = update.newStock;
      await update.product.save();
    }

    // 3. Calculate delivery charge and final total
    const deliveryFee = subtotal >= 999 ? 0 : 99;
    const total = subtotal + deliveryFee;

    // 4. Generate unique order number
    const orderNumber = `TATVA-ORD-${Date.now().toString().slice(-8)}-${Math.floor(
      Math.random() * 900 + 100
    )}`;

    const paymentStatus =
      paymentMethod === 'Simulated Online Payment'
        ? 'Simulated - Completed'
        : 'Simulated - COD';

    // 5. Create order document
    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      items: verifiedItems,
      shippingAddress,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Confirmed',
    });

    // 6. Clear user cart after successful order creation
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully (Simulated Transaction)',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders placed by the authenticated customer
 * GET /api/orders/my
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single order details
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Check ownership unless admin
    if (
      !order.user._id.equals(req.user._id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this order',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel customer order (if Pending or Confirmed) and restore stock
 * POST /api/orders/:id/cancel
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    if (
      !order.user.equals(req.user._id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order',
      });
    }

    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        error: `Order cannot be cancelled in status: ${order.orderStatus}`,
      });
    }

    order.orderStatus = 'Cancelled';
    order.paymentStatus = 'Simulated - Cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.orderStatus = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (Admin only)
 * PATCH /api/orders/admin/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // If changing to Cancelled from non-cancelled, restore stock
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: item.quantity },
        });
      }
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Simulated - Completed';
    }
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
