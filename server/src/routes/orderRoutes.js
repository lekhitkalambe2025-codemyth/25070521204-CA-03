import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/admin/all', adminOnly, getAdminOrders);
router.patch('/admin/:id/status', adminOnly, updateOrderStatus);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

export default router;
