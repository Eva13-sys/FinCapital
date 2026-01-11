// backend/routes/posts.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import verifyFirebaseToken from "../middleware/firebaseAuth.js";
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/posts';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Get all posts with filters
router.get('/', async (req, res) => {
  try {
    const { tags, sortBy, timeRange, page = 1, limit = 10 } = req.query;
    let query = {};
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    // Filter by time range
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0);
      }
      
      query.createdAt = { $gte: startDate };
    }
    
    // Determine sort order
    let sortOptions = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { likes: -1 };
        break;
      case 'trending':
        // Simple trending algorithm based on likes and recency
        sortOptions = { 
          $expr: { 
            $divide: [
              { $size: "$likes" },
              { $subtract: [new Date(), "$createdAt"] }
            ]
          } 
        };
        break;
      default: // 'newest'
        sortOptions = { createdAt: -1 };
    }
    
    const posts = await Post.find(query)
      .populate('userId', 'name username avatar verified rank performance')
      .populate('comments.userId', 'name username avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
router.post('/', verifyFirebaseToken, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    
    // Extract hashtags from content
    const tags = content.match(/#\w+/g) || [];
    
    const post = new Post({
      content,
      userId: req.user._id,
      tags: tags.map(tag => tag.substring(1).toLowerCase()), // Remove the # symbol and convert to lowercase
      image: req.file ? `/uploads/posts/${req.file.filename}` : ''
    });
    
    await post.save();
    
    // Increment user's post count
    await User.findByIdAndUpdate(req.user._id, { $inc: { postCount: 1 } });
    
    // Populate user data before sending response
    await post.populate('userId', 'name username avatar verified rank performance');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a post
router.post('/:id/like', verifyFirebaseToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user already liked the post
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ error: 'Post already liked' });
    }
    
    post.likes.push(req.user._id);
    await post.save();
    
    // Create notification if the post owner is not the liker
    if (post.userId._id.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        userId: post.userId._id,
        type: 'like',
        sourceUserId: req.user._id,
        sourceUserName: req.user.name,
        postId: post._id,
        message: `${req.user.name} liked your post`
      });
      await notification.save();
      
      // Emit notification via Socket.io if needed
    }
    
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlike a post
router.post('/:id/unlike', verifyFirebaseToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.likes.pull(req.user._id);
    await post.save();
    
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to post
router.post('/:id/comment', verifyFirebaseToken, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id).populate('userId');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.comments.push({
      userId: req.user._id,
      content
    });
    
    await post.save();
    
    // Create notification if the post owner is not the commenter
    if (post.userId._id.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        userId: post.userId._id,
        type: 'comment',
        sourceUserId: req.user._id,
        sourceUserName: req.user.name,
        postId: post._id,
        message: `${req.user.name} commented on your post`
      });
      await notification.save();
    }
    
    // Populate the new comment's user data
    await post.populate('comments.userId', 'name username avatar');
    
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report a post
router.post('/:id/report', verifyFirebaseToken, async (req, res) => {
  try {
    const { reason, details } = req.body;
    const post = await Post.findById(req.params.id).populate('userId');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user already reported the post
    const existingReport = post.reports.find(report => 
      report.userId.toString() === req.user._id.toString()
    );
    
    if (existingReport) {
      return res.status(400).json({ error: 'Post already reported' });
    }
    
    post.reports.push({
      userId: req.user._id,
      reason,
      details
    });
    
    await post.save();
    
    // Notify moderators about the report
    const moderators = await User.find({ role: { $in: ['moderator', 'admin'] } });
    
    for (const moderator of moderators) {
      const notification = new Notification({
        userId: moderator._id,
        type: 'report',
        sourceUserId: req.user._id,
        sourceUserName: req.user.name,
        postId: post._id,
        message: `${req.user.name} reported a post by ${post.userId.name}: ${reason}`
      });
      await notification.save();
    }
    
    res.json({ message: 'Post reported successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post (moderators and admins only)
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user has permission to delete
    if (req.user.role !== 'admin' && req.user.role !== 'moderator' && 
        post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    // Delete post image if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    // Decrement user's post count
    await User.findByIdAndUpdate(post.userId, { $inc: { postCount: -1 } });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;