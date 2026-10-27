import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAdminReviews,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.patch('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/admin/all', protect, adminOnly, getAdminReviews);

export default router;
