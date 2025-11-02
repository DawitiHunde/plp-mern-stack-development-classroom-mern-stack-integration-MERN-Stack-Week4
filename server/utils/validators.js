// validators.js - Input validation using Joi

const Joi = require('joi');

// Post validation schemas
const postValidation = {
  create: Joi.object({
    title: Joi.string().required().max(100).messages({
      'string.empty': 'Title is required',
      'string.max': 'Title cannot be more than 100 characters',
    }),
    content: Joi.string().required().messages({
      'string.empty': 'Content is required',
    }),
    excerpt: Joi.string().max(200).allow('', null).messages({
      'string.max': 'Excerpt cannot be more than 200 characters',
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Category is required',
    }),
    tags: Joi.array().items(Joi.string()).default([]),
    isPublished: Joi.boolean().default(false),
  }),

  update: Joi.object({
    title: Joi.string().max(100).messages({
      'string.max': 'Title cannot be more than 100 characters',
    }),
    content: Joi.string(),
    excerpt: Joi.string().max(200).allow('', null).messages({
      'string.max': 'Excerpt cannot be more than 200 characters',
    }),
    category: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean(),
  }),
};

// Category validation schemas
const categoryValidation = {
  create: Joi.object({
    name: Joi.string().required().max(50).messages({
      'string.empty': 'Category name is required',
      'string.max': 'Category name cannot be more than 50 characters',
    }),
    description: Joi.string().max(200).allow('', null).messages({
      'string.max': 'Description cannot be more than 200 characters',
    }),
  }),
};

// Auth validation schemas
const authValidation = {
  register: Joi.object({
    name: Joi.string().required().max(50).messages({
      'string.empty': 'Name is required',
      'string.max': 'Name cannot be more than 50 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  }),
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        error: errors,
      });
    }
    next();
  };
};

module.exports = {
  postValidation,
  categoryValidation,
  authValidation,
  validate,
};

