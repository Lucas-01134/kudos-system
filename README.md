# Kudos Application

A full-stack web application for recognizing and celebrating team achievements with a Kudos (praise/recognition) system.

## Features

- **User Authentication**: Secure JWT-based authentication
- **Send Kudos**: Recognize colleagues with messages and categories
- **View Feed**: Browse public kudos from across the organization
- **Like & React**: Engage with kudos through likes
- **Profile Management**: View stats and manage your profile
- **Categories**: Organize kudos by type (leadership, teamwork, innovation, support, excellence)
- **Privacy Control**: Make kudos public or private

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for frontend integration

### Frontend
- **React 18** with **Vite**
- **React Router** for navigation
- **Axios** for API requests
- **Tailwind CSS** for styling
- **Context API** for state management

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .github/
│   └── copilot-instructions.md
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or cloud like MongoDB Atlas)
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kudos
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Running Both Servers

### Option 1: In Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using VS Code Tasks
Press `Ctrl+Shift+B` to open VS Code tasks and select the appropriate task.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get logged-in user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/:id` - Get user by ID

### Kudos
- `POST /api/kudos/send` - Send kudos (protected)
- `GET /api/kudos/received` - Get received kudos (protected)
- `GET /api/kudos/sent` - Get sent kudos (protected)
- `GET /api/kudos/feed` - Get public kudos feed
- `POST /api/kudos/:id/like` - Like a kudos (protected)
- `DELETE /api/kudos/:id` - Delete kudos (protected)
- `GET /api/kudos/stats/:id` - Get kudos statistics

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kudos
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend
Create `.env.local` if needed for API configuration (Vite proxies to backend by default)

## Development

### Building for Production

**Backend:**
```bash
cd backend
npm start  # No build needed for Node.js
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Code Style

The project follows standard JavaScript conventions. Consider adding ESLint and Prettier for consistency.

## Database Schema

### User
- `username` (String, unique)
- `email` (String, unique)
- `password` (String, hashed)
- `firstName`, `lastName` (String)
- `profileImage` (URL)
- `bio` (String)
- `createdAt`, `updatedAt` (Date)

### Kudos
- `from` (ObjectId → User)
- `to` (ObjectId → User)
- `message` (String)
- `category` (String: leadership, teamwork, innovation, support, excellence, other)
- `isPublic` (Boolean)
- `likes` (Array of ObjectIds)
- `createdAt`, `updatedAt` (Date)

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in Authorization header for protected routes
5. Token verified by auth middleware on backend

## Future Enhancements

- Real-time notifications with Socket.io
- Email notifications
- Search and filtering
- User following/subscriptions
- Kudos trending/analytics
- Monthly recognition highlights
- Team/department leaderboards
- Kudos templates
- Integration with Slack or Teams

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
