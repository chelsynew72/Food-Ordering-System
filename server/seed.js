import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Food from './models/Food.js';

const foods = [
  { name: 'Margherita Pizza',    description: 'Classic tomato, mozzarella and fresh basil',        price: 1200, category: 'Pizza',   image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', preparationTime: 20 },
  { name: 'Pepperoni Pizza',     description: 'Loaded with pepperoni and extra mozzarella',         price: 1450, category: 'Pizza',   image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', preparationTime: 22 },
  { name: 'Classic Burger',      description: 'Beef patty, lettuce, tomato, cheese and pickles',    price: 850,  category: 'Burger',  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', preparationTime: 15 },
  { name: 'BBQ Bacon Burger',    description: 'Smoked bacon, BBQ sauce, caramelised onions',        price: 1050, category: 'Burger',  image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', preparationTime: 18 },
  { name: 'Chocolate Cake',      description: 'Rich triple-layer chocolate cake with ganache',       price: 650,  category: 'Cake',    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', preparationTime: 5  },
  { name: 'Strawberry Cheesecake', description: 'Creamy NY cheesecake with fresh strawberries',    price: 700,  category: 'Cake',    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', preparationTime: 5  },
  { name: 'Caesar Salad',        description: 'Romaine, croutons, parmesan, Caesar dressing',       price: 750,  category: 'Salad',   image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', preparationTime: 10 },
  { name: 'Salmon Sushi Roll',   description: 'Fresh salmon, avocado, cucumber roll (8 pcs)',       price: 1800, category: 'Sushi',   image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', preparationTime: 15 },
  { name: 'Mango Smoothie',      description: 'Fresh mango blended with yogurt and honey',          price: 450,  category: 'Drinks',  image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', preparationTime: 5  },
  { name: 'Chocolate Brownie',   description: 'Warm fudgy brownie served with vanilla ice cream',   price: 550,  category: 'Dessert', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', preparationTime: 5  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([User.deleteMany({}), Food.deleteMany({})]);

    const [adminHash, customerHash] = await Promise.all([
      bcrypt.hash('admin123', 12),
      bcrypt.hash('customer123', 12),
    ]);

    await Promise.all([
      User.create({ name: 'Admin User',    email: 'admin@foodapp.com',    password: adminHash,    role: 'admin',    phone: '0771234567' }),
      User.create({ name: 'John Customer', email: 'customer@foodapp.com', password: customerHash, role: 'customer', phone: '0779876543', address: '123 Main Street, Colombo' }),
      Food.insertMany(foods),
    ]);

    console.log('✅ Seed complete!');
    console.log('Admin:    admin@foodapp.com    / admin123');
    console.log('Customer: customer@foodapp.com / customer123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
