import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    description:     { type: String, trim: true },
    price:           { type: Number, required: true, min: 0 },
    category:        { type: String, required: true, enum: ['Pizza','Burger','Cake','Sushi','Salad','Drinks','Dessert','Other'] },
    image:           { type: String, default: '' },
    available:       { type: Boolean, default: true },
    preparationTime: { type: Number, default: 20 },
  },
  { timestamps: true }
);

const Food = mongoose.model('Food', foodSchema);
export default Food;
