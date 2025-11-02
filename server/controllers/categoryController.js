// categoryController.js - Controller for category operations

const Category = require('../models/Category');
const { categoryValidation } = require('../utils/validators');
const { validate } = require('../utils/validators');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = [
  validate(categoryValidation.create),
  async (req, res, next) => {
    try {
      const category = await Category.create(req.body);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: 'Category with this name already exists',
        });
      }
      next(error);
    }
  },
];

