import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  food:     { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customer:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:           [orderItemSchema],
    totalAmount:     { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid','paid','refunded','failed'],
      default: 'unpaid',
    },
    payhereOrderId:   { type: String },
    payherePaymentId: { type: String },
    notes:            { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
