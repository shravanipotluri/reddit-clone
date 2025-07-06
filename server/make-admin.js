const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function makeUserAdmin(username) {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User with username "${username}" not found`);
      return;
    }

    // Make user admin
    user.isAdmin = true;
    await user.save();
    
    console.log(`User "${username}" is now an admin`);
    console.log('User details:', {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Get username from command line argument
const username = process.argv[2];

if (!username) {
  console.log('Usage: node make-admin.js <username>');
  console.log('Example: node make-admin.js john');
  process.exit(1);
}

makeUserAdmin(username); 