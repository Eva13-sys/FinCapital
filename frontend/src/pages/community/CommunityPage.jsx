import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, ThumbsUp, Share, Bookmark, Search, 
  Filter, TrendingUp, Users, Award, Calendar,
  Clock, ArrowUp, Plus, Send, MoreHorizontal,
  Eye, BarChart3, DollarSign, TrendingDown, Image,
  Bell, User, LogOut, Settings, Flag, Shield
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CommunityPage = () => {
  const { user } = useAuth(); // Get user from context
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filters, setFilters] = useState({
    tags: [],
    sortBy: 'newest',
    timeRange: 'all'
  });
  
  const queryClient = useQueryClient();
  const socketRef = useRef();
  const messagesEndRef = useRef();
  const fileInputRef = useRef();
  const chatContainerRef = useRef();

  // Connect to Socket.io
  useEffect(() => {
    if (!user) return; // Early return if no user, but hook is still called
    
    socketRef.current = io(API_BASE_URL);
    
    socketRef.current.emit('join', user.id);
    
    socketRef.current.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });
    
    socketRef.current.on('newMessage', (message) => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      scrollToBottom();
    });
    
    socketRef.current.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [user, queryClient]); // Add user to dependency array

  // Fetch posts from backend with filters - UPDATED TO V5 SYNTAX
  const { data: posts, isLoading } = useQuery({
    queryKey: ['communityPosts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.tags.length) params.append('tags', filters.tags.join(','));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.timeRange) params.append('timeRange', filters.timeRange);
      
      const response = await axios.get(`${API_BASE_URL}/api/posts?${params}`);
      return response.data;
    },
    enabled: !!user // Only run query if user exists
  });

  // Fetch chat messages - UPDATED TO V5 SYNTAX
  const { data: chatMessages } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/chat`);
      return response.data;
    },
    enabled: !!user // Only run query if user exists
  });

  // Fetch top traders - UPDATED TO V5 SYNTAX
  const { data: topTraders } = useQuery({
    queryKey: ['topTraders'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/users/top`);
      return response.data;
    },
    enabled: !!user // Only run query if user exists
  });

  // Fetch user profile - UPDATED TO V5 SYNTAX
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}`);
      return response.data;
    },
    enabled: !!user // Only run query if user exists
  });

  // Mutation for creating a new post - UPDATED TO V5 SYNTAX
  const createPostMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_BASE_URL}/api/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      setNewPost('');
      setSelectedImage(null);
      setImagePreview(null);
      setShowPostForm(false);
      
      // Notify followers
      socketRef.current.emit('newPost', { userId: user.id });
    }
  });

  // Mutation for liking a post - UPDATED TO V5 SYNTAX
  const likePostMutation = useMutation({
    mutationFn: (postId) => axios.post(`${API_BASE_URL}/api/posts/${postId}/like`),
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      
      // Send notification to post owner
      socketRef.current.emit('like', { 
        postId, 
        userId: user.id,
        userName: user.name 
      });
    }
  });

  // Mutation for reporting a post - UPDATED TO V5 SYNTAX
  const reportPostMutation = useMutation({
    mutationFn: ({ postId, reason }) => axios.post(`${API_BASE_URL}/api/posts/${postId}/report`, { reason }),
    onSuccess: () => {
      alert('Post reported to moderators. Thank you for keeping the community safe.');
    }
  });

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle post submission
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() || selectedImage) {
      const formData = new FormData();
      formData.append('content', newPost);
      formData.append('userId', user.id);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      createPostMutation.mutate(formData);
    }
  };

  // Handle sending chat message
  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      socketRef.current.emit('sendMessage', {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        message: chatMessage,
        timestamp: new Date()
      });
      setChatMessage('');
    }
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Handle like action
  const handleLike = (postId) => {
    likePostMutation.mutate(postId);
  };

  // Handle report action
  const handleReport = (postId) => {
    const reason = prompt("Please specify the reason for reporting this post:");
    if (reason) {
      reportPostMutation.mutate({ postId, reason });
    }
  };

  // Apply filter
  const applyFilter = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'tags') {
        const newTags = prev.tags.includes(value) 
          ? prev.tags.filter(tag => tag !== value)
          : [...prev.tags, value];
        return { ...prev, tags: newTags };
      }
      return { ...prev, [filterType]: value };
    });
  };

  // Safety check for user - moved after all hooks
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Loading...</div>
          <div className="text-gray-500">Getting user information...</div>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trading Community</h1>
          <p className="text-gray-600 mt-2">Connect, learn and grow with traders worldwide</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <button 
              className="p-2 text-gray-500 hover:text-indigo-600 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                <div className="p-3 border-b border-gray-200 font-medium">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                      <div key={index} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <Bell className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
            onClick={() => setShowPostForm(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Post
          </button>
          
          <div className="flex items-center">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-2 hidden md:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">@{user.username}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium flex items-center ${activeTab === 'feed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('feed')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Feed
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center ${activeTab === 'traders' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('traders')}
            >
              <Users className="w-4 h-4 mr-2" />
              Top Traders
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center ${activeTab === 'discover' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('discover')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Discover
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center ${activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Chat
            </button>
          </div>

          {/* Filters */}
          {activeTab === 'feed' && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-medium">Filter by:</span>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={filters.sortBy}
                  onChange={(e) => applyFilter('sortBy', e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={filters.timeRange}
                  onChange={(e) => applyFilter('timeRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                
                <div className="flex flex-wrap gap-2">
                  {['#Stocks', '#Crypto', '#Options', '#TechnicalAnalysis', '#FundamentalAnalysis'].map(tag => (
                    <button
                      key={tag}
                      className={`px-3 py-1 rounded-full text-sm ${filters.tags.includes(tag) ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
                      onClick={() => applyFilter('tags', tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Post Form */}
          {showPostForm && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Create a post</h3>
              <form onSubmit={handlePostSubmit}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your trade idea or market analysis..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                />
                
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="rounded-lg max-h-60 object-contain"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      <span className="sr-only">Remove image</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <button 
                      type="button" 
                      className="p-2 text-gray-500 hover:text-indigo-600"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Image className="w-5 h-5" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-indigo-600">
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-indigo-600">
                      <DollarSign className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={createPostMutation.isPending || (!newPost.trim() && !selectedImage)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createPostMutation.isPending ? 'Posting...' : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Feed */}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start">
                        <img 
                          src={post.userId.avatar} 
                          alt={post.userId.name}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-900">{post.userId.name}</h3>
                            {post.userId.verified && (
                              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Verified</span>
                            )}
                            <span className="ml-2 text-xs font-medium text-indigo-600">{post.userId.rank}</span>
                            <span className={`ml-2 text-xs font-medium ${post.userId.performance && post.userId.performance.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {post.userId.performance}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{post.userId.username} · {new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="relative">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden">
                            <button 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleReport(post._id)}
                            >
                              <Flag className="w-4 h-4 inline mr-2" />
                              Report
                            </button>
                            {user.role === 'moderator' || user.role === 'admin' ? (
                              <button className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left">
                                <Shield className="w-4 h-4 inline mr-2" />
                                Remove Post
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-gray-800">{post.content}</p>

                      {post.image && (
                        <div className="mt-4">
                          <img 
                            src={`${API_BASE_URL}${post.image}`} 
                            alt="Post attachment" 
                            className="rounded-lg max-h-96 object-contain"
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap mt-3">
                        {post.tags && post.tags.map((tag, index) => (
                          <span key={index} className="text-sm text-indigo-600 mr-2 mb-1">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                      <button 
                        className="flex items-center text-gray-500 hover:text-indigo-600"
                        onClick={() => handleLike(post._id)}
                      >
                        <ThumbsUp className="w-5 h-5 mr-1" />
                        <span>{post.likes ? post.likes.length : 0}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-indigo-600">
                        <MessageSquare className="w-5 h-5 mr-1" />
                        <span>{post.comments ? post.comments.length : 0}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-indigo-600">
                        <Share className="w-5 h-5 mr-1" />
                        <span>{post.shares || 0}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-indigo-600">
                        <Bookmark className="w-5 h-5 mr-1" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Be the first to share your trading ideas!</p>
                </div>
              )}
            </div>
          )}

          {/* Live Chat */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Community Chat</h3>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-600">{onlineUsers.length} online</span>
                </div>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="h-96 overflow-y-auto p-4 bg-gray-50"
              >
                {chatMessages && chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`flex mb-4 ${msg.userId === user.id ? 'justify-end' : ''}`}>
                      {msg.userId !== user.id && (
                        <img 
                          src={msg.userAvatar} 
                          alt={msg.userName}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                      )}
                      <div className={`max-w-xs lg:max-w-md ${msg.userId === user.id ? 'bg-indigo-100' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
                        {msg.userId !== user.id && (
                          <div className="font-medium text-sm text-gray-900">{msg.userName}</div>
                        )}
                        <div className="text-gray-800">{msg.message}</div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Profile Summary */}
          {userProfile && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center mb-4">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-14 h-14 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{userProfile.name}</h3>
                  <p className="text-sm text-gray-600">@{userProfile.username}</p>
                  <p className="text-xs font-medium text-indigo-600">{userProfile.rank}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{userProfile.postCount || 0}</div>
                  <div className="text-xs text-gray-600">Posts</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{userProfile.followerCount || 0}</div>
                  <div className="text-xs text-gray-600">Followers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">{userProfile.winRate || '0%'}</div>
                  <div className="text-xs text-gray-600">Win Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{userProfile.followingCount || 0}</div>
                  <div className="text-xs text-gray-600">Following</div>
                </div>
              </div>
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg">
                View Profile
              </button>
            </div>
          )}

          {/* Online Users */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online Now ({onlineUsers.length})
            </h3>
            <div className="space-y-3">
              {onlineUsers.map(onlineUser => (
                <div key={onlineUser.id} className="flex items-center">
                  <div className="relative">
                    <img 
                      src={onlineUser.avatar} 
                      alt={onlineUser.name}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm font-medium">{onlineUser.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Traders */}
          {topTraders && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Top Traders
              </h3>
              <div className="space-y-3">
                {topTraders.slice(0, 5).map((trader, index) => (
                  <div key={trader._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-500 w-6">#{index + 1}</div>
                      <img 
                        src={trader.avatar} 
                        alt={trader.name}
                        className="w-8 h-8 rounded-full object-cover mx-2"
                      />
                      <div>
                        <div className="text-sm font-medium">{trader.name}</div>
                        <div className="text-xs text-gray-500">{trader.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${trader.performance && trader.performance.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {trader.performance}
                      </div>
                      <div className="text-xs text-gray-500">{trader.followerCount || 0} followers</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {[
                { name: "Bitcoin Halving", posts: 243 },
                { name: "Fed Rate Decision", posts: 187 },
                { name: "Tesla Earnings", posts: 156 },
                { name: "Nifty 50 Analysis", posts: 132 },
                { name: "AI Stocks", posts: 98 }
              ].map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-sm font-medium">#{topic.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{topic.posts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Learning Resources</h3>
            <div className="space-y-3">
              <a href="#" className="block p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Beginner's Guide to Trading</h4>
                <p className="text-sm text-gray-600 mt-1">Learn the basics of stock market investing</p>
              </a>
              <a href="#" className="block p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Technical Analysis Masterclass</h4>
                <p className="text-sm text-gray-600 mt-1">Read charts like a pro trader</p>
              </a>
              <a href="#" className="block p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Risk Management Handbook</h4>
                <p className="text-sm text-gray-600 mt-1">Protect your capital with these strategies</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;