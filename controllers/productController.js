import Product from '../models/Product.js';
import { sampleProducts } from '../data/seedData.js';

// @desc    Get all flower products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Check if MongoDB is connected and has products
    const count = await Product.countDocuments().catch(() => 0);
    if (count > 0) {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return res.status(200).json(products);
    }

    // If database is empty or not yet connected, return curated sample flowers
    return res.status(200).json(
      sampleProducts.map((p, idx) => ({
        _id: `flower-00${idx + 1}`,
        createdAt: new Date().toISOString(),
        ...p,
      }))
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Unable to fetch flower products', error: error.message });
  }
};

// @desc    Get single flower product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try finding by MongoDB ObjectId if valid format
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findById(id);
      if (product) return res.status(200).json(product);
    }

    // Try finding by custom id or in sample flowers
    const sample = sampleProducts.find(
      (p, idx) => `flower-00${idx + 1}` === id || p.name.toLowerCase() === id.toLowerCase()
    );

    if (sample) {
      return res.status(200).json({
        _id: id,
        createdAt: new Date().toISOString(),
        ...sample,
      });
    }

    return res.status(404).json({ message: 'Flower bouquet not found' });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.status(500).json({ message: 'Server error retrieving flower product', error: error.message });
  }
};
