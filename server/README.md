# Reddit-like User API

A comprehensive user management API built with Node.js, Express, and MongoDB, featuring Reddit-like functionality including user profiles and authentication.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👤 **User Registration & Login** - Complete user account management

- 📝 **Profile Management** - Update profile, bio, avatar, and banner
- 🔒 **Password Security** - Bcrypt password hashing
- 👥 **Social Features** - Follow/unfollow users
- 🛡️ **Admin Controls** - Admin-only routes and user management

- ✅ **Input Validation** - Comprehensive data validation
- 🚀 **Performance Optimized** - Database indexes and efficient queries

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Custom middleware with regex patterns
- **CORS**: Cross-origin resource sharing enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=7777
   MONGODB_URI=mongodb://localhost:27017/reddit-clone
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

#### `POST /api/users/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "displayName": "John Doe",
  "bio": "Hello, I'm John!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "displayName": "John Doe",
      "bio": "Hello, I'm John!",

      "isVerified": false,
      "isAdmin": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "accountAge": 0
    },
    "token": "jwt_token_here"
  }
}
```

#### `POST /api/users/login`
Login with username/email and password.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:** Same as register endpoint.

### User Profile

#### `GET /api/users/me` (Protected)
Get current user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### `PUT /api/users/profile` (Protected)
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "displayName": "Updated Name",
  "bio": "Updated bio",
  "avatar": "https://example.com/avatar.jpg",
  "banner": "https://example.com/banner.jpg"
}
```

#### `PUT /api/users/password` (Protected)
Change user password.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Public Profiles

#### `GET /api/users/profile/:username`
Get public profile by username.

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "john_doe",
    "displayName": "John Doe",
    "bio": "Hello, I'm John!",
    "avatar": "https://example.com/avatar.jpg",
    "banner": "https://example.com/banner.jpg",

    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "accountAge": 30
  }
}
```



### Admin Routes

#### `GET /api/users/admin/all` (Admin Only)
Get all users with pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 10)

### Utility

#### `GET /api/users/health`
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "User API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## User Schema

The User model includes the following fields:

### Basic Information
- `username` (required, unique): 3-20 characters, alphanumeric + underscore/hyphen
- `email` (required, unique): Valid email format
- `password` (required): Minimum 6 characters, hashed with bcrypt
- `displayName`: Optional display name
- `bio`: User biography (max 500 characters)
- `avatar`: Profile picture URL
- `banner`: Banner image URL



### Account Status
- `isVerified`: Verified account status
- `isAdmin`: Admin privileges
- `isActive`: Account active status
- `isSuspended`: Suspension status
- `suspensionReason`: Reason for suspension
- `suspensionExpiresAt`: Suspension expiration date

### Social Features
- `followers`: Array of user IDs following this user
- `following`: Array of user IDs this user follows

### Timestamps
- `createdAt`: Account creation date
- `updatedAt`: Last update date
- `lastActive`: Last activity timestamp
- `lastLogin`: Last login timestamp

## Testing

Run the test suite to verify API functionality:

```bash
# Install axios for testing
npm install axios

# Run tests
node test-api.js
```

The test suite includes:
- User registration
- User login
- Profile updates
- Password changes
- Public profile access
- Top users listing
- Health check

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created (registration)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid credentials/token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate username/email)
- `500`: Internal Server Error

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication with 7-day expiration
- **Input Validation**: Comprehensive validation for all user inputs
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Ready for implementation
- **SQL Injection Protection**: MongoDB with Mongoose ODM

## Database Indexes

The following indexes are created for optimal performance:
- `username`: For fast username lookups
- `email`: For fast email lookups
- `createdAt`: For chronological sorting


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the ISC License. 