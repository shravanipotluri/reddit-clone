const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

const validatePostData = async (req, res, next) => {
  const { content, link } = req.body;
  
  if (!content && !link) {
    return res.status(400).json({
      success: false,
      message: 'Either content or link is required'
    });
  }
  
  if (content && content.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Content must be less than 1000 characters'
    });
  }
  
  if (content) {
    try {
      const trimmedContent = content.trim();
      const existingPost = await Post.findOne({
        content: { $regex: new RegExp(`^${trimmedContent}$`, 'i') },
        isActive: true
      });
      
      if (existingPost) {
        return res.status(409).json({
          success: false,
          message: 'A post with this content already exists'
        });
      }
    } catch (error) {
      console.error('Duplicate check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking for duplicate content'
      });
    }
  }
  
  if (link) {
    try {
      const trimmedLink = link.trim();
      const existingPost = await Post.findOne({
        link: { $regex: new RegExp(`^${trimmedLink}$`, 'i') },
        isActive: true
      });
      
      if (existingPost) {
        return res.status(409).json({
          success: false,
          message: 'A post with this link already exists'
        });
      }
    } catch (error) {
      console.error('Duplicate link check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking for duplicate link'
      });
    }
  }
  
  next();
};

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ isActive: true })
      .populate('author', 'username displayName')
      .sort({ createdAt: -1 })
      .lean();
    
    const postsWithScore = posts.map(post => ({
      ...post,
      score: post.upvotes.length - post.downvotes.length
    }));
    
    postsWithScore.sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      data: postsWithScore
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
});

router.post('/', authenticateToken, validatePostData, async (req, res) => {
  try {
    const { content, link } = req.body;
    const userId = req.user._id;
    
    const newPost = new Post({
      author: userId,
      content: content || '',
      link: link || ''
    });
    
    const savedPost = await newPost.save();
    
    const populatedPost = await Post.findById(savedPost._id)
      .populate('author', 'username displayName')
      .lean();
    
    const score = populatedPost.upvotes.length - populatedPost.downvotes.length;
    const postWithScore = { ...populatedPost, score };
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: postWithScore
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

router.post('/:id/upvote', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    if (!post.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Post is not active'
      });
    }
    
    await post.addUpvote(userId);
    
    const updatedPost = await Post.findById(postId)
      .populate('author', 'username displayName')
      .lean();
    
    const score = updatedPost.upvotes.length - updatedPost.downvotes.length;
    const postWithScore = { ...updatedPost, score };
    
    res.status(200).json({
      success: true,
      message: 'Post upvoted successfully',
      data: postWithScore
    });
  } catch (error) {
    console.error('Upvote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error upvoting post',
      error: error.message
    });
  }
});

router.post('/:id/downvote', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    if (!post.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Post is not active'
      });
    }
    
    await post.addDownvote(userId);
    
    const updatedPost = await Post.findById(postId)
      .populate('author', 'username displayName')
      .lean();
    
    const score = updatedPost.upvotes.length - updatedPost.downvotes.length;
    const postWithScore = { ...updatedPost, score };
    
    res.status(200).json({
      success: true,
      message: 'Post downvoted successfully',
      data: postWithScore
    });
  } catch (error) {
    console.error('Downvote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downvoting post',
      error: error.message
    });
  }
});



router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    post.isActive = false;
    await post.save();
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
});

router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username displayName')
      .sort({ createdAt: -1 })
      .lean();
    
    const postsWithScore = posts.map(post => ({
      ...post,
      score: post.upvotes.length - post.downvotes.length
    }));
    
    res.status(200).json({
      success: true,
      data: postsWithScore
    });
  } catch (error) {
    console.error('Admin get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
});

module.exports = router; 