import User from '../models/User.js';
import Order from '../models/Order.js';

export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [customers, total] = await Promise.all([
      User.find({ role: 'customer' })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      User.countDocuments({ role: 'customer' }),
    ]);
    res.json({ customers, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, totalCustomers, pendingOrders, revenueAgg, recentOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.find().populate('customer', 'name email').sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      totalOrders,
      totalCustomers,
      pendingOrders,
      totalRevenue: revenueAgg[0]?.total ?? 0,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
