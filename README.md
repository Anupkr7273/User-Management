# User-Management
A simple User Management System built with the MERN stack. This project provides basic authentication and user management functionalities, making it a solid foundation for role-based or admin-driven applications.

Features
User Authentication
User registration with validation
Secure login with JWT-based authentication
Password hashing using bcrypt
User Management
View all users (Admin only)
Edit user details
Delete users
Role assignment (e.g., user, admin)
Security
Protected routes with middleware
JWT-based session handling
Password encryption

Tech Stack
Frontend: React, Tailwind CSS, Axios
Backend: Node.js, Express.js
Database: MongoDB Atlas
Authentication: JSON Web Token (JWT), bcrypt

Installation

Clone the repository:

git clone https://github.com/Anupkr7273/User-Management.git
cd User-Management


Install dependencies for both frontend and backend:

cd backend
npm install
cd ../frontend
npm install


Create a .env file in the backend with the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Start the backend server:
cd backend
npm run dev


Start the frontend server:
cd frontend
npm run dev


Open the application in your browser at:

http://localhost:5173
