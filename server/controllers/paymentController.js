import md5 from 'md5';
import Order from '../models/Order.js';

const generateHash = (merchantId, orderId, amount, currency, secret) => {
  const secretHash = md5(secret).toUpperCase();
  const hashStr = `${merchantId}${orderId}${amount}${currency}${secretHash}`;
  console.log('Hash input:', hashStr);
  return md5(hashStr).toUpperCase();
};

export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('customer', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const secret     = process.env.PAYHERE_SECRET;

    // Amount must be X.XX format — no comma separators
    const amount   = parseFloat(order.totalAmount).toFixed(2);
    const currency = 'LKR';
    const hash     = generateHash(merchantId, orderId, amount, currency, secret);

    console.log('Merchant ID:', merchantId);
    console.log('Order ID:', orderId);
    console.log('Amount:', amount);
    console.log('Hash:', hash);

    const [firstName, ...rest] = (order.customer.name || 'Customer').split(' ');

    const payhereParams = {
      sandbox:     true,
      merchant_id: merchantId,
      return_url:  `${process.env.CLIENT_URL}/order-confirmation/${orderId}`,
      cancel_url:  `${process.env.CLIENT_URL}/menu`,
      notify_url:  process.env.PAYHERE_NOTIFY_URL,
      order_id:    orderId,
      items:       order.items.map((i) => i.name).join(', '),
      amount,
      currency,
      hash,
      first_name:  firstName,
      last_name:   rest.join(' ') || 'N/A',
      email:       order.customer.email,
      phone:       order.customer.phone || '0771234567',
      address:     order.deliveryAddress,
      city:        'Colombo',
      country:     'Sri Lanka',
    };

    res.json({ payhereParams });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const payhereNotify = async (req, res) => {
  try {
    const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

    const secretHash = md5(process.env.PAYHERE_SECRET).toUpperCase();
    const expected   = md5(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${secretHash}`).toUpperCase();

    if (md5sig !== expected) return res.status(400).send('Invalid signature');

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).send('Order not found');

    if (status_code === '2') {
      order.paymentStatus   = 'paid';
      order.status          = 'confirmed';
      order.payherePaymentId = payment_id;
    } else if (['-1', '-2', '-3'].includes(status_code)) {
      order.paymentStatus = 'failed';
    }

    await order.save();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const getPaymentSummary = async (req, res) => {
  try {
    const [paid, unpaid, failed, revenueAgg] = await Promise.all([
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.countDocuments({ paymentStatus: 'unpaid' }),
      Order.countDocuments({ paymentStatus: 'failed' }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);
    res.json({ paid, unpaid, failed, totalRevenue: revenueAgg[0]?.total ?? 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// export const simulatePayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     if (order.customer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     order.paymentStatus    = 'paid';
//     order.status           = 'confirmed';
//     order.payherePaymentId = `SIM-${Date.now()}`;
//     await order.save();
//     res.json({ message: 'Payment simulated successfully', order });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
