import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Food from '../models/Food.js';

export const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { items, deliveryAddress, notes } = req.body;

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) return res.status(404).json({ message: `Food ${item.foodId} not found` });
      if (!food.available) return res.status(400).json({ message: `${food.name} is unavailable` });
      resolvedItems.push({ food: food._id, name: food.name, price: food.price, quantity: item.quantity });
      totalAmount += food.price * item.quantity;
    }

    const order = await Order.create({ customer: req.user._id, items: resolvedItems, totalAmount, deliveryAddress, notes });
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.food', 'name image')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.food');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.food', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('customer', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
