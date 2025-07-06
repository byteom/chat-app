# Chat App Backend

A robust Node.js backend for a real-time chat application with user authentication, friend management, and Stream Chat integration.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Profile creation, onboarding, and user recommendations
- **Friend System**: Send/accept friend requests, manage friend lists
- **Real-time Chat**: Stream Chat integration for instant messaging
- **Security**: HTTP-only cookies, password hashing, input validation
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Stream Chat account and API credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET_KEY=your-super-secret-jwt-key
   STREAM_API_KEY=your-stream-api-key
   STREAM_API_SECRET=your-stream-api-secret
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── lib/           # Utility functions
│   └── server.js      # Main server file
├── notes/             # Documentation and flowcharts
└── package.json
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | No |
| POST | `/onboarding` | Complete user profile | Yes |
| GET | `/me` | Get current user info | Yes |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get recommended users | Yes |
| GET | `/friends` | Get user's friends | Yes |
| POST | `/friend-request/:id` | Send friend request | Yes |
| PUT | `/friend-request/:id/accept` | Accept friend request | Yes |
| GET | `/friend-request/` | Get incoming requests | Yes |
| GET | `/outgoing-friend-request` | Get outgoing requests | Yes |

### Chat Routes (`/api/chat`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/token` | Get Stream Chat token | Yes |

## 📊 Database Models

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, min 6 chars),
  bio: String (default: ""),
  profilePicture: String (default: ""),
  nativeLanguage: String (default: ""),
  learningLanguage: String (default: ""),
  location: String (default: ""),
  isOnboarding: Boolean (default: false),
  friends: [ObjectId] (ref: User),
  timestamps: true
}
```

### FriendRequest Model
```javascript
{
  sender: ObjectId (ref: User, required),
  recipient: ObjectId (ref: User, required),
  status: String (enum: ["pending", "accepted"], default: "pending"),
  timestamps: true
}
```

## 🔐 Authentication Flow

1. **Signup**: User provides email, password, fullName
   - Password is hashed using bcrypt
   - User is created in MongoDB
   - User is created in Stream Chat
   - JWT token is generated and set in HTTP-only cookie

2. **Login**: User provides email and password
   - Password is verified against hashed password
   - JWT token is generated and set in HTTP-only cookie

3. **Protected Routes**: All protected routes use `protectRoute` middleware
   - Extracts JWT from cookies
   - Verifies token validity
   - Attaches user object to request

## 🤝 Friend System Flow

1. **Send Request**: User sends friend request to another user
   - Validates recipient exists
   - Checks if already friends
   - Creates FriendRequest document

2. **Accept Request**: Recipient accepts friend request
   - Updates request status to "accepted"
   - Adds both users to each other's friends array

3. **Get Recommendations**: Returns users who are not friends and are onboarded

## 💬 Stream Chat Integration

- **User Creation**: New users are automatically created in Stream Chat
- **Token Generation**: Authenticated users can get Stream Chat tokens
- **Real-time Messaging**: Frontend uses Stream Chat SDK for instant messaging

## 🔧 Dependencies

### Core Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cookie-parser`: Cookie parsing middleware
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

### Development Dependencies
- `nodemon`: Auto-restart server during development

### External Services
- `stream-chat`: Stream Chat SDK for real-time messaging

## 🚨 Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Invalid input data, missing fields
- **401 Unauthorized**: Invalid or missing authentication token
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## 🔍 Debugging

The application includes extensive debug logging:

- Authentication token verification
- Stream Chat API calls
- User onboarding process
- Database operations

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET_KEY` | JWT signing secret | Yes |
| `STREAM_API_KEY` | Stream Chat API key | Yes |
| `STREAM_API_SECRET` | Stream Chat API secret | Yes |
| `NODE_ENV` | Environment mode | No (default: development) |

## 🧪 Testing

To run tests (when implemented):
```bash
npm test
```

## 📚 Documentation

Additional documentation and flowcharts are available in the `notes/` directory:

- `login.txt`: Login flow diagram
- `signup.txt`: Signup flow diagram  
- `stream.txt`: Stream Chat integration details
- `project-tree.txt`: Complete project structure tree map

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the `notes/` directory for detailed flowcharts
- Review the API documentation above
- Check the debug logs for troubleshooting 