const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  link: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Link must be a valid URL'
    }
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for score (upvotes - downvotes)
postSchema.virtual('score').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Method to check if user has voted
postSchema.methods.hasUserVoted = function(userId) {
  if (this.upvotes.some(id => id.equals(userId))) return 'upvote';
  if (this.downvotes.some(id => id.equals(userId))) return 'downvote';
  return null;
};

// Method to add upvote
postSchema.methods.addUpvote = function(userId) {
  // Check if user has already voted
  const userUpvoted = this.upvotes.some(id => id.equals(userId));
  const userDownvoted = this.downvotes.some(id => id.equals(userId));
  
  if (userDownvoted) {
    // If user downvoted, remove the downvote (increase score by 1)
    this.downvotes = this.downvotes.filter(id => !id.equals(userId));
  } else if (userUpvoted) {
    // If user upvoted, remove the upvote (decrease score by 1)
    this.upvotes = this.upvotes.filter(id => !id.equals(userId));
  } else {
    // If user hasn't voted, add an upvote (increase score by 1)
    this.upvotes.push(userId);
  }
  
  return this.save();
};

// Method to add downvote
postSchema.methods.addDownvote = function(userId) {
  // Check if user has already voted
  const userUpvoted = this.upvotes.some(id => id.equals(userId));
  const userDownvoted = this.downvotes.some(id => id.equals(userId));
  
  if (userUpvoted) {
    // If user upvoted, remove the upvote (decrease score by 1)
    this.upvotes = this.upvotes.filter(id => !id.equals(userId));
  } else if (userDownvoted) {
    // If user downvoted, remove the downvote (increase score by 1)
    this.downvotes = this.downvotes.filter(id => !id.equals(userId));
  } else {
    // If user hasn't voted, add a downvote (decrease score by 1)
    this.downvotes.push(userId);
  }
  
  return this.save();
};

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema); 