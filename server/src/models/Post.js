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

postSchema.virtual('score').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

postSchema.methods.hasUserVoted = function(userId) {
  if (this.upvotes.some(id => id.equals(userId))) return 'upvote';
  if (this.downvotes.some(id => id.equals(userId))) return 'downvote';
  return null;
};

postSchema.methods.addUpvote = function(userId) {
  const userUpvoted = this.upvotes.some(id => id.equals(userId));
  const userDownvoted = this.downvotes.some(id => id.equals(userId));
  
  if (userDownvoted) {
    this.downvotes = this.downvotes.filter(id => !id.equals(userId));
  } else if (userUpvoted) {
    this.upvotes = this.upvotes.filter(id => !id.equals(userId));
  } else {
    this.upvotes.push(userId);
  }
  
  return this.save();
};

postSchema.methods.addDownvote = function(userId) {
  const userUpvoted = this.upvotes.some(id => id.equals(userId));
  const userDownvoted = this.downvotes.some(id => id.equals(userId));
  
  if (userUpvoted) {
    this.upvotes = this.upvotes.filter(id => !id.equals(userId));
  } else if (userDownvoted) {
    this.downvotes = this.downvotes.filter(id => !id.equals(userId));
  } else {
    this.downvotes.push(userId);
  }
  
  return this.save();
};

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema); 