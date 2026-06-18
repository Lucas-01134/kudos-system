# Setup Guide

This guide will help you set up and run the Kudos application on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18.0.0 or higher)
   - Download from https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB** (Choose one option)
   - **Option A:** Local MongoDB
     - Download from https://www.mongodb.com/try/download/community
     - Start the MongoDB service
   - **Option B:** MongoDB Atlas (Cloud)
     - Create an account at https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get your connection string

3. **Git** (Optional but recommended)
   - Download from https://git-scm.com/

## Installation Steps

### Step 1: Clone or Extract the Project

If using Git:
```bash
git clone <repository-url>
cd Forage\ AI\ act1\ task\ 2
```

Or simply extract the project folder.

### Step 2: Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your MongoDB connection:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kudos
   JWT_SECRET=your_super_secret_key_12345
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kudos?retryWrites=true&w=majority
   ```

5. Verify MongoDB is running:
   - Local: `mongod` should be running
   - Atlas: Connection should be accessible

### Step 3: Frontend Setup

1. In a new terminal, navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Option A: Using Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
Server running on http://localhost:5000
MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Option B: Using VS Code Tasks

1. Open the project in VS Code
2. Press `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac)
3. Select "Start Backend Server" task
4. Press `Ctrl+Shift+B` again in a new terminal
5. Select "Start Frontend Development Server" task

## Accessing the Application

1. Open your browser
2. Navigate to: `http://localhost:5173`
3. Create an account and start sending kudos!

## Testing the API

You can test the API using:
- **Postman** (https://www.postman.com/)
- **Thunder Client** (VS Code Extension)
- **REST Client** (VS Code Extension)

Example requests:

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Send Kudos:**
```
POST http://localhost:5000/api/kudos/send
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "to": "recipient_user_id",
  "message": "Great job on the project!",
  "category": "excellence",
  "isPublic": true
}
```

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in PATH
- Solution: Reinstall Node.js and restart your terminal

### "MongoDB connection failed"
- MongoDB is not running
- Solution: 
  - Local: Run `mongod` in a separate terminal
  - Atlas: Check your connection string and firewall settings

### "Port 5000 already in use"
- Another application is using port 5000
- Solution: Change PORT in backend/.env to a different port (e.g., 5001)

### "Frontend won't load"
- Check that both backend and frontend servers are running
- Check browser console for errors
- Clear browser cache and refresh

### "Can't send kudos after login"
- Ensure user ID is valid
- Try using another registered user's ID
- Check browser console for API errors

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Debugging**: Check browser DevTools Network tab for API requests
3. **Database**: Use MongoDB Compass to visualize your database
4. **Logs**: Backend logs appear in the terminal where you ran `npm start`

## Next Steps

1. Create a few test user accounts
2. Send kudos between users
3. Explore the feed and profile pages
4. Try different kudos categories
5. Like and comment on kudos (if implemented)

## Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

This creates an optimized build in `frontend/dist/`

**Backend:**
No build step needed. Deploy the `backend` folder as-is with Node.js.

## Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the README.md file
3. Check browser console and server logs
4. Ensure all prerequisites are installed

Happy coding! 🎉
