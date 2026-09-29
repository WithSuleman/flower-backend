import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// GET /api/products - Get all flower products
router.get('/', getProducts);

// GET /api/products/:id - Get single product details
router.get('/:id', getProductById);

export default router;
