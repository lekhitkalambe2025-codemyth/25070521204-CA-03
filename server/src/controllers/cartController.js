import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Format cart document with populated products, calculated subtotal and stock validations
 */
const formatCartResponse = async (cart) => {
  await cart.populate('items.product');

  let subtotal = 0;
  const validItems = [];
  const stockWarnings = [];

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.active) {
      stockWarnings.push(`An item in your cart is no longer available and was removed.`);
      continue;
    }

    let qty = item.quantity;
    if (qty > product.stockQuantity) {
      qty = Math.max(1, product.stockQuantity);
      stockWarnings.push(
        `Quantity for ${product.name} adjusted to ${qty} based on available stock.`
      );
    }

    const itemSubtotal = product.price * qty;
    subtotal += itemSubtotal;

    validItems.push({
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.image,
        category: product.category,
        stockQuantity: product.stockQuantity,
      },
      quantity: qty,
      subtotal: itemSubtotal,
    });
  }

  // If items changed, update the cart document
  if (validItems.length !== cart.items.length) {
    cart.items = validItems.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
    }));
    await cart.save();
  }

  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + deliveryFee;

  return {
    _id: cart._id,
    user: cart.user,
    items: validItems,
    subtotal,
    deliveryFee,
    total,
    stockWarnings,
  };
};

/**
 * Get customer cart
 * GET /api/cart
 */
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const formatted = await formatCartResponse(cart);
    return res.status(200).json({
      success: true,
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart or increment quantity
 * POST /api/cart/items
 */
export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const product = await Product.findById(productId);

    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or inactive',
      });
    }

    if (product.stockQuantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'This product is currently out of stock',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qty;
      if (newQty > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          error: `Cannot add more than available stock (${product.stockQuantity})`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      if (qty > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          error: `Cannot add more than available stock (${product.stockQuantity})`,
        });
      }
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const formatted = await formatCartResponse(cart);

    return res.status(200).json({
      success: true,
      message: `${product.name} added to cart`,
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update quantity of a cart item
 * PATCH /api/cart/items/:productId
 */
export const updateItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
    }

    const newQty = parseInt(quantity, 10);

    if (newQty <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      if (newQty > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.stockQuantity} items in stock`,
        });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = newQty;
      }
    }

    await cart.save();
    const formatted = await formatCartResponse(cart);

    return res.status(200).json({
      success: true,
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove an item from the cart
 * DELETE /api/cart/items/:productId
 */
export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const formatted = await formatCartResponse(cart);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all items from cart
 * DELETE /api/cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: {
        user: req.user._id,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
