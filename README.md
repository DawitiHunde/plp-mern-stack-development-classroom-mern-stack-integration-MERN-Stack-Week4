# MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js that demonstrates seamless integration between front-end and back-end components.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features Overview](#features-overview)
- [Screenshots](#screenshots)

## ✨ Features

### Core Features
- ✅ Full CRUD operations for blog posts
- ✅ User authentication (register, login, protected routes)
- ✅ Category management
- ✅ Image uploads for featured images
- ✅ Comments system for blog posts
- ✅ Pagination for post listings
- ✅ Search functionality
- ✅ Category filtering
- ✅ Responsive UI design

### Advanced Features
- ✅ JWT-based authentication
- ✅ Protected routes with authorization
- ✅ Optimistic UI updates
- ✅ Loading and error states
- ✅ Image preview before upload
- ✅ Post view count tracking
- ✅ Slug-based URLs
- ✅ Tag system for posts

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Joi** - Input validation
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling

## 📁 Project Structure

```
mern-blog/
├── client/                     # React front-end
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── PostView.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/            # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useApi.js
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express.js back-end
│   ├── config/                  # Configuration files
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── postController.js
│   │   ├── categoryController.js
│   │   └── authController.js
│   ├── models/                 # Mongoose models
│   │   ├── Post.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── routes/                 # API routes
│   │   ├── posts.js
│   │   ├── categories.js
│   │   └── auth.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js            # JWT authentication
│   │   └── upload.js          # File upload handling
│   ├── utils/                  # Utility functions
│   │   └── validators.js      # Joi validation schemas
│   ├── uploads/               # Uploaded files directory
│   ├── server.js              # Main server file
│   └── package.json
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd plp-mern-stack-development-classroom-mern-stack-integration-MERN-Stack-Week4
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Configuration

### Server Configuration

1. Navigate to the `server` directory
2. Create a `.env` file (copy from `.env.example` if available):
   ```env
   MONGODB_URI=mongodb://localhost:27017/mern-blog
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MAX_FILE_SIZE=5242880
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-blog
   ```

### Client Configuration

1. Navigate to the `client` directory
2. Create a `.env` file (copy from `.env.example` if available):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## ▶️ Running the Application

### Start MongoDB

**Local MongoDB:**
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod --config /usr/local/etc/mongod.conf
```

**MongoDB Atlas:**
- No local setup needed, use your connection string in `.env`

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### Start the Frontend Development Server

Open a new terminal:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Post Endpoints

#### Get All Posts
```http
GET /api/posts?page=1&limit=10&category=<categoryId>
```

#### Get Single Post
```http
GET /api/posts/:id
```

#### Create Post (Protected)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "Post Title"
content: "Post content..."
excerpt: "Brief description"
category: "<categoryId>"
tags: "javascript,react,mongodb"
isPublished: true
featuredImage: <file>
```

#### Update Post (Protected)
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Post (Protected)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

#### Search Posts
```http
GET /api/posts/search?q=search+query&page=1&limit=10
```

#### Add Comment (Protected)
```http
POST /api/posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!"
}
```

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
```

#### Create Category (Protected - Admin)
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Technology",
  "description": "Tech-related posts"
}
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... }  // for paginated endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🎯 Features Overview

### 1. User Authentication
- User registration with email and password
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (admin/user)

### 2. Blog Post Management
- Create, read, update, and delete posts
- Rich content editor
- Featured image upload
- Post publishing status
- Tag system
- Excerpt/summary field

### 3. Category Management
- Create and manage categories
- Filter posts by category
- Category-based navigation

### 4. Comments System
- Add comments to posts
- View all comments
- Comment timestamps
- User attribution

### 5. Search & Filter
- Full-text search across titles and content
- Category filtering
- Pagination for large result sets

### 6. User Interface
- Responsive design
- Loading states
- Error handling
- Optimistic UI updates
- Image preview
- Clean, modern design

## 📸 Screenshots

*Add screenshots of your application here:*
- Home page with post listings
- Single post view
- Create/Edit post form
- Login/Register pages
- Search results

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation with Joi
- File upload validation (images only)
- Protected routes
- Authorization checks (users can only edit/delete their own posts)

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Create new post
- [ ] Edit existing post
- [ ] Delete post
- [ ] View post details
- [ ] Add comment
- [ ] Search posts
- [ ] Filter by category
- [ ] Pagination
- [ ] Image upload
- [ ] Protected routes

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify network access for Atlas connections

### Port Already in Use
- Change the port in `.env` files
- Ensure no other application is using ports 3000 or 5000

### Image Upload Issues
- Check `server/uploads` directory exists
- Verify file size limits
- Ensure file type is an image

## 📝 Notes

- The `server/uploads` directory will be created automatically on first upload
- Default file upload limit is 5MB (configurable in `.env`)
- JWT tokens expire after 30 days
- Posts are sorted by creation date (newest first)

## 🤝 Contributing

This is a learning project. Feel free to fork and enhance it!

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- MongoDB for database
- Express.js team for the framework
- React team for the UI library
- All open-source contributors

---

**Happy Coding! 🚀**
