# School-Management-API

A Node.js RESTful API for managing student records, built with Express and MongoDB.

---

## Setup & Run Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Silas-Nmenme/School-Management-API cd student-crud-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   mongo_URI=mongodb://localhost:27017/student-crud-api
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1h
   ```

4. **Start MongoDB**

   Make sure MongoDB is running locally or update `mongo_URI` in `.env` to your MongoDB connection string.

5. **Run the server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000` by default.

---

## Import & Execute the Postman Collection

1. **Import the Postman collection**
   - Open Postman.
   - Click "Import" and select the provided Postman collection file (`Student-API.postman_collection.json` if available).

2. **Set up environment variables in Postman**
   - Set `base_url` to `http://localhost:3000` (or your deployed URL).
   - For protected routes, log in or register to obtain a JWT token, then set it as a variable or in the `Authorization` header.

3. **Execute requests**
   - Use the collection to test endpoints such as registration, login, CRUD operations, search, pagination, and admin actions.

---

## 📚 API Endpoints Overview

post '/register', - registerStudent
post '/login', - loginStudent
post '/forget-password', - forgetPassword
post '/verify-otp', - verifyOtp
put '/reset-password/:studentId', - resetPassword
post '/logout',- logoutStudent
get '/student-count', - getStudentCount


**Admin Endpoints (require admin JWT):**
put '/edit-student/:id', - editStudent
delete '/delete-student/:id', - deleteStudent
get'/get-all-students', - getAllStudents

---

## 📝 Assumptions & Design Decisions

- **Authentication:** JWT-based authentication is used for all protected routes. Admin routes require a user with `isAdmin: true`.
- **Password Security:** Passwords are hashed using bcrypt before storage.
- **Role Management:** The `isAdmin` field on the student model determines admin privileges.
- **Pagination:** Supported via query parameters (`page`, `limit`) on student list endpoints.
- **Search:** Students can be searched by first or last name using a case-insensitive partial match.
- **Error Handling:** All endpoints return JSON error messages with appropriate HTTP status codes.
- **Sensitive Data:** Passwords and confirmation fields are never returned in API responses.
- **OTP Flow:** Password reset uses an OTP verification step for security.
- **Extensibility:** The API is modular, making it easy to add features like email notifications, file uploads, or additional roles.

---

## Notes

- Ensure MongoDB is running before starting the API.
- Use the correct JWT token for protected/admin routes.
- For any issues, check the server logs for detailed error messages.