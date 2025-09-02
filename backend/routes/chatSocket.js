// backend/socket/chatSocket.js
import OnlineUser from '../models/OnlineUser';
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';

export default (io) => {
  const onlineUsers = new Map();
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // User joins
    socket.on('join', async (userId) => {
      onlineUsers.set(socket.id, userId);
      
      // Add to database
      await OnlineUser.findOneAndUpdate(
        { userId },
        { socketId: socket.id, lastSeen: new Date() },
        { upsert: true, new: true }
      );
      
      updateOnlineUsers();
    });
    
    // Send message
    socket.on('sendMessage', async (data) => {
      try {
        // Save message to database
        const ChatMessage = require('../models/ChatMessage');
        const message = new ChatMessage(data);
        await message.save();
        
        // Broadcast to all users
        io.emit('newMessage', message);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Typing indicator
    socket.on('typing', (data) => {
      socket.broadcast.emit('userTyping', {
        userId: data.userId,
        userName: data.userName
      });
    });
    
    // Stop typing indicator
    socket.on('stopTyping', (data) => {
      socket.broadcast.emit('userStopTyping', {
        userId: data.userId
      });
    });
    
    // Disconnect
    socket.on('disconnect', async () => {
      const userId = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);
      
      // Remove from database
      await OnlineUser.findOneAndDelete({ socketId: socket.id });
      
      updateOnlineUsers();
      console.log('User disconnected:', socket.id);
    });
    
    // Update online users list
    async function updateOnlineUsers() {
      try {
        const User = require('../models/User');
        const onlineUserIds = Array.from(onlineUsers.values());
        
        const users = await User.find({ _id: { $in: onlineUserIds } })
          .select('_id name username avatar');
        
        io.emit('onlineUsers', users);
      } catch (error) {
        console.error('Error updating online users:', error);
      }
    }
  });
};