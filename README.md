# 📚 Quizify - Interactive Quiz Platform

Quizify is a modern, full-stack web application that provides an interactive quiz-taking experience with comprehensive admin management capabilities. Built with React and Node.js, it offers a seamless platform for creating, managing, and taking quizzes with real-time performance tracking.

## 🚀 Project Overview

This application serves as a complete quiz management system where administrators can create and manage quizzes, monitor user registrations, track quiz attempts, and analyze performance metrics. Regular users can browse available quizzes, take them, and view their attempt history.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **React Router v6** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Elegant toast notifications
- **Lucide React** - Beautiful and consistent icon library
- **CSS3** - Custom styling with CSS Grid and Flexbox
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast and minimal web application framework
- **JWT (JSON Web Tokens)** - Secure authentication system
- **bcryptjs** - Password hashing and encryption
- **express-validator** - Input validation and sanitization
- **CORS** - Cross-Origin Resource Sharing support
- **File-based Storage** - JSON files for data persistence

### Development Tools
- **nodemon** - Development server with auto-restart
- **npm** - Package management
- **Git** - Version control

## 🌟 Key Features

### For Regular Users
- 🔐 **User Authentication** - Secure registration and login system
- 📋 **Quiz Browsing** - View available quizzes with search and filter options
- 🎯 **Interactive Quiz Taking** - Timed quizzes with multiple-choice questions
- 📊 **Performance Tracking** - View personal quiz attempt history and scores
- 📱 **Responsive Design** - Works seamlessly on all device sizes

### For Administrators
- 🛡️ **Admin Dashboard** - Comprehensive overview of platform statistics
- ➕ **Quiz Management** - Create, edit, and delete quizzes
- 👥 **User Management** - Monitor user registrations and account details
- 📈 **Attempt Monitoring** - Track all quiz attempts with detailed analytics
- 📊 **Performance Analytics** - View average scores and user engagement metrics
- 🎨 **Rich Quiz Editor** - Create quizzes with multiple questions and answers

## 🏗️ Project Structure

```
quiz-bits/
├── client/                     # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── AdminRoute.js   # Admin-only route protection
│   │   │   ├── Button.js       # Custom button component
│   │   │   ├── Card.js         # Card component for layouts
│   │   │   ├── Input.js        # Form input component
│   │   │   ├── Navbar.js       # Navigation component
│   │   │   └── ProtectedRoute.js # Authentication route guard
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global authentication state
│   │   ├── pages/              # Application pages
│   │   │   ├── AdminAttempts.js     # Admin quiz attempts view
│   │   │   ├── AdminDashboard.js    # Admin main dashboard
│   │   │   ├── AdminUsers.js        # Admin user management
│   │   │   ├── CreateQuiz.js        # Quiz creation form
│   │   │   ├── EditQuiz.js          # Quiz editing interface
│   │   │   ├── Home.js              # Landing page
│   │   │   ├── Login.js             # User login form
│   │   │   ├── MyAttempts.js        # User attempt history
│   │   │   ├── QuizList.js          # Available quizzes listing
│   │   │   ├── QuizTake.js          # Quiz taking interface
│   │   │   └── Register.js          # User registration form
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── App.js              # Main application component
│   │   └── index.js            # Application entry point
│   └── package.json
│
└── server/                     # Node.js backend application
    └── server/
        ├── controllers/        # Request handlers
        │   ├── authController.js    # Authentication logic
        │   └── quizController.js    # Quiz management logic
        ├── data/               # JSON file storage
        │   ├── attempts.json   # Quiz attempt records
        │   ├── quizzes.json    # Quiz definitions
        │   └── users.json      # User accounts
        ├── middleware/         # Express middleware
        │   ├── auth.js         # JWT authentication
        │   └── roles.js        # Role-based access control
        ├── models/             # Data models
        │   ├── Attempt.js      # Quiz attempt model
        │   ├── Quiz.js         # Quiz data model
        │   └── User.js         # User account model
        ├── routes/             # API route definitions
        │   ├── auth.js         # Authentication routes
        │   └── quizzes.js      # Quiz-related routes
        ├── app.js              # Express application setup
        ├── config.js           # Application configuration
        └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd quiz-bits
```

2. **Install Backend Dependencies**
```bash
cd server/server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../../client
npm install
```

4. **Start the Backend Server**
```bash
cd ../server/server
npm run dev
```
The backend server will start on `http://localhost:4000`

5. **Start the Frontend Development Server**
```bash
cd ../../client
npm start
```
The frontend application will open at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
The application uses default configurations but can be customized:

- **Backend Port**: 4000 (configurable in `server/server/config.js`)
- **Frontend Port**: 3000 (default React development server)
- **JWT Secret**: Configured in `server/server/config.js`
- **API Base URL**: Configurable in frontend via `REACT_APP_API_URL`

### Default Admin Account
A default admin account is available for testing:
- **Email**: `admin@quizify.com`
- **Password**: `admin123`
- **Role**: Administrator

## 📊 Data Storage

The application uses file-based JSON storage for simplicity and ease of setup:

- **`users.json`** - Stores user accounts with hashed passwords
- **`quizzes.json`** - Contains quiz definitions with questions and answers
- **`attempts.json`** - Records all quiz attempts with scores and timestamps

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/admin/users` - Get all users (admin only)

### Quizzes
- `GET /api/quizzes` - Get available quizzes (public)
- `GET /api/quizzes/admin/all` - Get all quizzes (admin only)
- `GET /api/quizzes/admin/attempts` - Get all attempts (admin only)
- `GET /api/quizzes/:id` - Get quiz for taking
- `POST /api/quizzes` - Create new quiz (admin only)
- `PUT /api/quizzes/:id` - Update quiz (admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (admin only)
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt
- `GET /api/quizzes/me/attempts` - Get user's attempts
- `GET /api/quizzes/:id/attempts` - Get quiz attempts (admin only)

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Role-based Access Control** - Admin and user role separation
- **Input Validation** - express-validator for request validation
- **Route Protection** - Protected and admin-only routes
- **CORS Configuration** - Cross-origin resource sharing setup

## 🎨 UI/UX Features

- **Modern Design** - Clean and intuitive interface
- **Responsive Layout** - Mobile-first responsive design
- **Interactive Components** - Hover effects and smooth transitions
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Skeleton loaders for better UX
- **Error Handling** - Graceful error display and recovery
- **Accessibility** - Keyboard navigation and screen reader support

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 **Mobile devices** (320px and up)
- 💻 **Tablets** (768px and up)
- 🖥️ **Desktop** (1024px and up)
- 📺 **Large screens** (1440px and up)

## 🧪 Testing the Application

### For Regular Users:
1. Visit `http://localhost:3000`
2. Register a new account or login
3. Browse available quizzes
4. Take a quiz and view results
5. Check your attempt history

### For Administrators:
1. Login with admin credentials
2. Access the Admin Dashboard
3. Create and manage quizzes
4. Monitor user registrations
5. View quiz attempt analytics

## 🔄 Development Workflow

### Backend Development
```bash
cd server/server
npm run dev  # Starts nodemon for auto-restart
```

### Frontend Development
```bash
cd client
npm start  # Starts React development server
```

## 📈 Future Enhancements

- 🗄️ **Database Integration** - Migrate from JSON files to MongoDB/PostgreSQL
- 📊 **Advanced Analytics** - Detailed performance charts and insights
- 🎵 **Media Support** - Image and audio questions
- ⏱️ **Timer Features** - Per-question and overall quiz timers
- 🏆 **Gamification** - Badges, leaderboards, and achievements
- 📧 **Email Notifications** - Quiz completion and result emails
- 📱 **Mobile App** - React Native mobile application
- 🌐 **Multi-language** - Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Utkarsh**
- GitHub: [Your GitHub Profile]
- Email: fanaticvrun09@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust backend framework
- Lucide React for beautiful icons
- All open-source contributors who made this project possible

---

⭐ **Star this repository if you found it helpful!**