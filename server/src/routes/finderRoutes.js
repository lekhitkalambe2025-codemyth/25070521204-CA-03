import express from 'express';
import { findSmartProducts } from '../controllers/finderController.js';

const router = express.Router();

router.get('/', findSmartProducts);

export default router;
