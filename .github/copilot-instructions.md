# Kudos Application - Development Guidelines

## Project Overview
A full-stack web application featuring a Kudos (praise/recognition) system built with React, Express, and MongoDB. This application allows teams to recognize and celebrate each other's achievements with a user-friendly praise/recognition platform.

## Tech Stack
- **Frontend**: React 18 with Vite, Tailwind CSS, React Router
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs password hashing
- **API Communication**: Axios with interceptors

## Key Features
- ✅ User authentication and profiles with JWT
- ✅ Send kudos to other users with categories
- ✅ View received and sent kudos
- ✅ Public kudos feed/timeline
- ✅ Like/engage with kudos
- ✅ Profile management with stats
- ✅ Kudos categories (leadership, teamwork, innovation, support, excellence)
- ✅ Privacy control (public/private kudos)
- ✅ Real-time notifications (future enhancement)

## Project Structure
```
Kudos Application/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Route logic (auth, kudos)
│   ├── middleware/          # Authentication middleware
│   ├── models/              # MongoDB schemas (User, Kudos)
│   ├── routes/              # API routes
│   ├── server.js            # Express app entry point
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment variables template
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (Home, Feed, Profile, etc.)
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── utils/           # Utility functions (API client)
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles with Tailwind
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── package.json         # Frontend dependencies
│   └── .gitignore
├── .vscode/
│   └── tasks.json           # VS Code development tasks
├── .github/
│   ├── copilot-instructions.md  # This file
│   └── SETUP.md             # Detailed setup guide
├── .gitignore              # Root git ignore
├── README.md               # Project documentation
├── setup.sh                # Setup script for Unix/Linux/Mac
└── setup.bat               # Setup script for Windows
```

## Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
bash setup.sh
```

### Option 2: Manual Setup

**Prerequisites:**
- Node.js v18+ (https://nodejs.org/)
- MongoDB local or cloud (https://www.mongodb.com/)

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm start
```

**Frontend Setup (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

## Running the Application

### Backend (Port 5000)
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

### Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

### Using VS Code Tasks
1. Press `Ctrl+Shift+B`
2. Select "Start Backend Server" and "Start Frontend Development Server"

## Environment Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kudos
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

### MongoDB Connection Strings
- **Local**: `mongodb://localhost:27017/kudos`
- **Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/kudos`

## Development Notes
- Backend uses port 5000
- Frontend uses port 5173 (Vite default)
- Frontend proxies API calls to backend
- MongoDB connection configured via .env
- CORS enabled for frontend-backend communication
- Passwords hashed with bcryptjs
- JWT tokens expire in 7 days

## API Endpoints Summary
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/kudos/send` - Send kudos (protected)
- `GET /api/kudos/received` - Get received kudos (protected)
- `GET /api/kudos/feed` - Get public feed
- `POST /api/kudos/:id/like` - Like kudos (protected)
- `DELETE /api/kudos/:id` - Delete kudos (protected)

## Database Models

**User Schema:**
- username, email, password (hashed)
- firstName, lastName, bio
- profileImage, createdAt, updatedAt

**Kudos Schema:**
- from/to (User references)
- message, category
- isPublic, likes array
- createdAt, updatedAt

## Debugging Tips
- Check browser DevTools Network tab for API errors
- View server logs in terminal where `npm start` is running
- Use MongoDB Compass to inspect database
- Check .env file is properly configured
- Ensure both servers are running before testing

## Common Issues & Solutions

**"npm: command not found"**
- Install Node.js from https://nodejs.org/

**"MongoDB connection failed"**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**"Port already in use"**
- Change PORT in backend/.env

**"CORS errors"**
- Ensure backend server is running
- Check frontend proxy configuration

## Production Deployment

**Frontend:**
```bash
npm run build  # Creates dist/ folder
```

**Backend:**
- Deploy Node.js app with PM2 or similar
- Use environment variables for secrets
- Enable HTTPS in production

## Additional Resources
- [Detailed Setup Guide](.github/SETUP.md)
- [Main README](../README.md)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## Git Workflow
```bash
# Clone project
git clone <repo>

# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature"

# Push and create PR
git push origin feature/feature-name
```

## Future Enhancements
- Real-time notifications (Socket.io)
- Email notifications
- Advanced search and filters
- User following system
- Trending kudos
- Monthly leaderboards
- Slack/Teams integration
- Kudos templates

## Support
For detailed setup instructions, see [SETUP.md](.github/SETUP.md)
For additional features and API docs, see [README.md](../README.md)
