# Reddit-Style Community Portal

A full-stack Reddit-style community portal built with React, Node.js, and MongoDB. Users can register, login, create posts, vote on content, and view a feed ordered by popularity. Includes an admin dashboard for content moderation.

## Tech Stack

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Context API for state management

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) 
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/shravanipotluri/reddit-clone.git
cd reddit-clone
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/reddit-portal
JWT_SECRET=your-super-secret-jwt-key-here
PORT=7777
```

**Note:** Replace `your-super-secret-jwt-key-here` with a strong secret key for JWT tokens.

### 3. Set up the frontend

```bash
cd ../client
npm install
```

## Running the Application

### Start the backend server

```bash
cd server
npm start
```

The server will start on `http://localhost:7777`

### Start the frontend client

In a new terminal:

```bash
cd client
npm start
```

The client will start on `http://localhost:1234`

## Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database when it first connects

### Option 2: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the `MONGODB_URI` in your `.env` file with the Atlas connection string
