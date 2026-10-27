import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  compareProducts,
  createProduct,
  updateProduct,
  updateStock,
  updateStatus,
  getAdminProducts,
  resetDefaultProducts,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin-only management endpoints (defined before :slug to prevent parameter collision)
router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.post('/admin/reset-defaults', protect, adminOnly, resetDefaultProducts);
router.post('/', protect, adminOnly, createProduct);
router.patch('/:id', protect, adminOnly, updateProduct);
router.patch('/:id/stock', protect, adminOnly, updateStock);
router.patch('/:id/status', protect, adminOnly, updateStatus);

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/compare', compareProducts);
router.get('/:slug', getProductBySlug);

export default router;

