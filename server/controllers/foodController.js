import { validationResult } from 'express-validator';
import Food from '../models/Food.js';

export const getAllFoods = async (req, res) => {
  try {
    const { category, available } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';
    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json({ foods });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json({ food });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createFood = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ food });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json({ food });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
