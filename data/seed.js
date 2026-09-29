import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { sampleProducts } from './seedData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌸 Connecting to MongoDB...');
    await connectDB();

    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});

    console.log('🌱 Seeding fresh flower products...');
    await Product.insertMany(sampleProducts);

    console.log('✨ Database successfully seeded with 16 fresh flower bouquets!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
