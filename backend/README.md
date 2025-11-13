# Node.js Backend – JWT Auth API

This is the **backend** for the authentication system built with **Express.js** and **MySQL**.

## Features

✅ **User Registration** (`POST /api/signup`)  
✅ **User Login** (`POST /api/login`)  
✅ **Protected Routes** (`GET /api/users`)  
✅ **JWT Authentication**  
✅ **Password Hashing** with bcrypt  
✅ **MySQL Integration** with Prisma ORM  

## API Endpoints

### Public Routes
- `POST /api/signup` - Register a new user
- `POST /api/login` - Login user
- `GET /api/health` - Health check

### Protected Routes
- `GET /api/users` - Get all users (requires JWT token)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file with:
```
PORT=3001
JWT_SECRET=mysecretkey_fullstack_practice_2024
DATABASE_URL="mysql://root:@localhost:3306/fullstack_practice"
```

### 3. Setup MySQL Database
Make sure MySQL is running and create the database:
```bash
# Start MySQL (macOS with Homebrew)
brew services start mysql

# Or start MySQL server directly
sudo /usr/local/mysql/support-files/mysql.server start

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fullstack_practice;"

# If you have a password for root user, update the DATABASE_URL:
# DATABASE_URL="mysql://root:your_password@localhost:3306/fullstack_practice"
```

### 4. Generate Prisma Client and Create Tables
```bash
# Generate Prisma client
npx prisma generate

# Push database schema (creates tables)
npx prisma db push

# Optional: View your database in Prisma Studio
npx prisma studio
```

### 5. Start the Server
```bash
npm start
# or
npm run dev
```

The server will run on `http://localhost:3001`

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma    # Prisma database schema
├── lib/
│   └── prisma.js        # Prisma client configuration
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── index.js             # Main server file
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## Authentication Flow

1. **Signup**: User provides name, email, password → Server hashes password → Creates user → Returns JWT token
2. **Login**: User provides email, password → Server validates → Returns JWT token
3. **Protected Access**: Client sends JWT token in Authorization header → Server validates → Grants access

## Testing the API

You can test the endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Signup
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get users (with token)
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
