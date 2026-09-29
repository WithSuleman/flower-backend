import express from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', createOrder);

// GET /api/orders - Get all orders
router.get('/', getOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

export default router;
