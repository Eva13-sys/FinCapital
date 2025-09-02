// backend/routes/notifications.js
import express from 'express';
import Notification from '../models/Notification.js';
import { auth } from './auth.js';

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('sourceUserId', 'name username avatar')
      .populate('postId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);
    
    const total = await Notification.countDocuments({ userId: req.user._id });
    
    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount: await Notification.countDocuments({ 
        userId: req.user._id, 
        read: false 
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notifications as read
router.patch('/read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );
    
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark single notification as read
router.patch('/read/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;