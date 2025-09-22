# Student Management System

A full-stack student management application with a Node.js/Express backend API and a modern HTML/CSS/JavaScript frontend.

---

## 🚀 Features

### Backend (Node.js/Express API)
- **Student Registration & Authentication** - JWT-based login system
- **Password Management** - Forgot password with OTP verification
- **Admin Panel** - Full CRUD operations for student management
- **Role-based Access Control** - Admin and student roles
- **Secure API** - Protected routes with authentication middleware

### Frontend (HTML/CSS/JavaScript)
- **Modern UI** - Beautiful, responsive design with Bootstrap 5
- **Smooth Animations** - CSS animations and transitions
- **Interactive Dashboard** - Real-time statistics and data visualization
- **Mobile Responsive** - Works perfectly on all devices
- **Real-time Updates** - Live data synchronization

---

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for cloning the repository)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/student-management-system.git
cd student-management-system
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/student-management-system
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=1h
```

### 3. Start MongoDB
Make sure MongoDB is running on your system, or use MongoDB Atlas:
```bash
# Local MongoDB
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your Atlas connection string
```

### 4. Start the Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:3000`

### 5. Frontend Setup
The frontend files are already included in the project:
- `index.html` - Main HTML file
- `styles.css` - Custom CSS with animations
- `script.js` - JavaScript functionality

Simply open `index.html` in your web browser, or serve it using a local server:
```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js http-server (install globally: npm install -g http-server)
http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

---

## 🎯 API Endpoints

### Public Endpoints
- `POST /api/students/register` - Register new student
- `POST /api/students/login` - Login student
- `POST /api/students/forget-password` - Request password reset
- `POST /api/students/verify-otp` - Verify OTP
- `PUT /api/students/reset-password/:studentId` - Reset password
- `GET /api/students/student-count` - Get total student count

### Protected Endpoints (require JWT token)
- `POST /api/students/logout` - Logout student
- `PATCH /api/students/make-admin/:studentId` - Make student admin

### Admin Endpoints (require admin JWT token)
- `POST /api/admin/add-student` - Add new student
- `PUT /api/admin/edit-student/:id` - Edit student
- `DELETE /api/admin/delete-student/:id` - Delete student
- `GET /api/admin/get-all-students` - Get all students

---

## 🎨 Frontend Features

### Pages & Sections
- **Home** - Landing page with feature overview
- **Registration** - Student registration form
- **Login** - Authentication with JWT
- **Forgot Password** - Password recovery flow
- **OTP Verification** - Two-factor authentication
- **Profile** - User profile management
- **Admin Panel** - Complete student management dashboard

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Theme switching capability
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time input validation
- **Modal Windows** - Elegant modal dialogs
- **Smooth Scrolling** - Enhanced navigation experience

### Animations & Effects
- **CSS Animations** - Fade, slide, and bounce effects
- **Hover Effects** - Interactive button and card animations
- **Loading Spinners** - Professional loading indicators
- **Success/Error States** - Visual feedback for user actions
- **Glass Morphism** - Modern glass-like UI effects

---

## 🔧 Configuration

### Environment Variables
```env
PORT=3000                           # Server port
MONGO_URI=mongodb://localhost:27017/student-management-system  # Database URI
JWT_SECRET=your_jwt_secret_key      # JWT signing secret
JWT_EXPIRATION=1h                   # JWT expiration time
```

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (backend)
- `http://localhost:8000` (frontend development server)
- `http://127.0.0.1:8000` (alternative frontend server)

---

## 🧪 Testing the Application

### 1. Start the Backend
```bash
npm run dev
```

### 2. Start the Frontend
```bash
# Option 1: Direct file opening
# Open index.html in your browser

# Option 2: Local server
python -m http.server 8000
# or
http-server -p 8000
```

### 3. Test Flow
1. **Register** a new student account
2. **Login** with your credentials
3. **Explore** the dashboard and features
4. **Test Admin Features** (if you have admin access)
5. **Try Password Reset** functionality

---

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check if MongoDB is running
- Verify `.env` file configuration
- Check for port conflicts

**Frontend not loading:**
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify all files are in the same directory

**API calls failing:**
- Check if backend server is running
- Verify API endpoints in browser console
- Check JWT token validity for protected routes

**Database connection issues:**
- Verify MongoDB connection string
- Check MongoDB server status
- Ensure network connectivity

---

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Bootstrap** for the responsive UI framework
- **Font Awesome** for beautiful icons
- **Animate.css** for smooth animations
- **Express.js** for the backend framework
- **MongoDB** for the database

---

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review browser console for error messages

---

**Happy Learning! 🎓**
