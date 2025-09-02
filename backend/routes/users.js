// backend/routes/users.js
import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { auth } from './auth.js';

const router = express.Router();

// Get user profile - CHANGE THIS LINE
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name username avatar')
      .populate('following', 'name username avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts
    const posts = await Post.find({ userId: user._id })
      .populate('userId', 'name username avatar verified rank performance')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      recentPosts: posts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top traders
router.get('/top/traders', async (req, res) => {
  try {
    const topTraders = await User.find({ 
      postCount: { $gt: 0 },
      verified: true 
    })
    .select('-password')
    .sort({ 
      'tradeStats.profitableTrades': -1, 
      postCount: -1, 
      followerCount: -1 
    })
    .limit(10);

    res.json(topTraders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow user - CHANGE THIS LINE TOO
router.post('/follow/:id', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    if (req.user.following.includes(userToFollow._id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Update both users
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: userToFollow._id },
      $inc: { followingCount: 1 }
    });

    await User.findByIdAndUpdate(userToFollow._id, {
      $push: { followers: req.user._id },
      $inc: { followerCount: 1 }
    });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow user - AND THIS LINE
router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update both users
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userToUnfollow._id },
      $inc: { followingCount: -1 }
    });

    await User.findByIdAndUpdate(userToUnfollow._id, {
      $pull: { followers: req.user._id },
      $inc: { followerCount: -1 }
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, rank } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, rank },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;