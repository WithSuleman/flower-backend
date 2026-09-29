import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter flower bouquet name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter flower bouquet description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter price'],
      min: [0, 'Price must be positive'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['Roses', 'Tulips', 'Sunflowers', 'Mixed Flowers', 'Lavender', 'Daisies'],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 25,
    },
    stock: {
      type: Number,
      required: [true, 'Please enter stock quantity'],
      default: 20,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
