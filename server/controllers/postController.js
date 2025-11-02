// postController.js - Controller for blog post operations

const Post = require('../models/Post');
const Category = require('../models/Category');
const { postValidation } = require('../utils/validators');
const { validate } = require('../utils/validators');

// @desc    Get all posts with pagination and filtering
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const isPublished = req.query.isPublished !== 'false';

    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }
    if (isPublished) {
      query.isPublished = true;
    }

    // Get posts with pagination
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by ID or slug
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    let post;
    
    // Check if it's an ObjectId or slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(req.params.id)
        .populate('author', 'name email')
        .populate('category', 'name slug')
        .populate('comments.user', 'name email');
    } else {
      post = await Post.findOne({ slug: req.params.id })
        .populate('author', 'name email')
        .populate('category', 'name slug')
        .populate('comments.user', 'name email');
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = [
  validate(postValidation.create),
  async (req, res, next) => {
    try {
      // Check if category exists
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }

      // Handle tags array from FormData
      let tags = [];
      if (req.body.tags) {
        if (Array.isArray(req.body.tags)) {
          tags = req.body.tags;
        } else if (typeof req.body.tags === 'string') {
          tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }

      const postData = {
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt || '',
        category: req.body.category,
        tags: tags,
        isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
        author: req.user._id,
      };

      // Handle file upload
      if (req.file) {
        postData.featuredImage = req.file.filename;
      }

      const post = await Post.create(postData);
      
      const populatedPost = await Post.findById(post._id)
        .populate('author', 'name email')
        .populate('category', 'name slug');

      res.status(201).json({
        success: true,
        data: populatedPost,
      });
    } catch (error) {
      next(error);
    }
  },
];

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = [
  validate(postValidation.update),
  async (req, res, next) => {
    try {
      let post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Check if user is author or admin
      if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this post',
        });
      }

      // Update category if provided
      if (req.body.category) {
        const category = await Category.findById(req.body.category);
        if (!category) {
          return res.status(404).json({
            success: false,
            error: 'Category not found',
          });
        }
      }

      // Handle tags array from FormData
      if (req.body.tags !== undefined) {
        if (Array.isArray(req.body.tags)) {
          req.body.tags = req.body.tags;
        } else if (typeof req.body.tags === 'string') {
          req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }

      // Handle boolean conversion for FormData
      if (req.body.isPublished !== undefined) {
        req.body.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
      }

      // Handle file upload
      if (req.file) {
        req.body.featuredImage = req.file.filename;
      }

      post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate('author', 'name email')
        .populate('category', 'name slug');

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },
];

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.addComment(req.user._id, content);

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .populate('comments.user', 'name email');

    res.status(201).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
exports.searchPosts = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
      ],
      isPublished: true,
    };

    const posts = await Post.find(searchQuery)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(searchQuery);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

