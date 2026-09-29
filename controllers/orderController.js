import Order from '../models/Order.js';

// In-memory fallback storage when running without active MongoDB URI
const fallbackOrders = [];

// @desc    Create new flower order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      postalCode,
      giftNote,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!customerName || !email || !address) {
      return res.status(400).json({ message: 'Please provide all required delivery details' });
    }

    // Try saving to MongoDB if connected
    try {
      const order = new Order({
        customerName,
        email,
        phone,
        address,
        city,
        postalCode,
        giftNote,
        items,
        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee) || 0,
        totalAmount: Number(totalAmount),
        status: 'Pending',
      });

      const savedOrder = await order.save();
      return res.status(201).json(savedOrder);
    } catch (dbErr) {
      console.warn('MongoDB save failed, falling back to local order store:', dbErr.message);

      const localOrder = {
        _id: 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        customerName,
        email,
        phone,
        address,
        city,
        postalCode,
        giftNote: giftNote || '',
        items,
        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee) || 0,
        totalAmount: Number(totalAmount),
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      fallbackOrders.unshift(localOrder);
      return res.status(201).json(localOrder);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Unable to process flower order', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getOrders = async (req, res) => {
  try {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      if (orders && orders.length > 0) {
        return res.status(200).json(orders);
      }
    } catch {
      // fallback
    }

    return res.status(200).json(fallbackOrders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Unable to fetch orders', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      const order = await Order.findById(id);
      if (order) return res.status(200).json(order);
    }

    const localFound = fallbackOrders.find((o) => o._id === id);
    if (localFound) return res.status(200).json(localFound);

    return res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Error retrieving order', error: error.message });
  }
};
