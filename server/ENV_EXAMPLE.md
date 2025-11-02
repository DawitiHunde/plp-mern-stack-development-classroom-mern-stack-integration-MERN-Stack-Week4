# Server Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/mern-blog
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mern-blog
MONGODB_URI=mongodb://localhost:27017/mern-blog

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# JWT Secret (change this to a random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Max file size for uploads (in bytes, default: 5MB)
MAX_FILE_SIZE=5242880
```

