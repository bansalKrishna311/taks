# TaskManager - Full Stack Task Management Application

A modern, responsive task management application built with React.js frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

### Frontend Features
- **User Authentication**: Secure registration and login system
- **Task Management**: Create, read, update, and delete tasks
- **Real-time Search**: Search tasks by title with instant results
- **Status Filtering**: Filter tasks by status (Todo, In Progress, Done)
- **Task Statistics**: Dashboard with task count statistics
- **Responsive Design**: Mobile-friendly interface
- **Due Date Tracking**: Set and track task due dates with overdue indicators
- **Status Updates**: Quick status change buttons on task cards

### Backend Features
- **RESTful API**: Clean API endpoints for all operations
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Input validation using express-validator
- **Error Handling**: Comprehensive error handling middleware
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing with bcrypt

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router Dom** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation middleware
- **CORS** - Cross-origin resource sharing

## 📦 Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taks
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tasksdb
JWT_SECRET=your_super_secure_jwt_secret_key_here
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file:
```env
VITE_API_BASE=http://localhost:3000/api/v1
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections.

### 5. Start the Application
```bash
# Start backend server (in backend directory)
cd backend
npm run dev

# Start frontend development server (in project root)
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile

### Tasks
- `GET /api/v1/tasks` - Get all tasks (with optional search and status filter)
- `GET /api/v1/tasks/:id` - Get single task
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

## 📱 Usage

### 1. Registration/Login
- Create a new account with name, email, and password
- Login with your credentials
- JWT token is automatically managed for authenticated requests

### 2. Dashboard
- View task statistics and overview
- Create new tasks using the task form
- Filter tasks by status or search by title
- View all tasks in a responsive grid layout

### 3. Task Management
- **Create**: Click "New Task" and fill in the details
- **Update Status**: Use the status buttons on task cards
- **Delete**: Click the delete button on any task card
- **Search**: Use the search bar to find specific tasks
- **Filter**: Use status filter buttons to view tasks by status

## 🎨 Key Components

### Frontend Components
- **App.jsx**: Main application component with routing
- **Dashboard.jsx**: Main dashboard with task overview and management
- **Login.jsx** & **Register.jsx**: Authentication pages
- **TaskCard.jsx**: Individual task display component
- **TaskForm.jsx**: Task creation form
- **Nav.jsx**: Navigation header component

### Backend Structure
- **models/**: MongoDB schemas for User and Task
- **routes/**: API route handlers for auth, users, and tasks
- **middlewares/**: Authentication and error handling middleware
- **index.js**: Main server file with Express app setup

## 🔒 Security Features
- Password hashing using bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Error handling without sensitive data exposure

## 📊 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  bio: String (optional),
  timestamps: true
}
```

### Task Schema
```javascript
{
  title: String (required),
  description: String (optional),
  status: Enum ['todo', 'in-progress', 'done'],
  dueDate: Date (optional),
  owner: ObjectId (ref: User),
  timestamps: true
}
```

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set up environment variables on your hosting service
2. Deploy the backend code
3. Update the frontend API base URL to point to your deployed backend

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Created as a full-stack web development assignment demonstrating modern web development practices and technologies.
