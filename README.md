# BookStore Full-Stack Application

A complete full-stack book management application built with React, Node.js, Express, and MongoDB.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### 📚 Book Management
- Add new books with complete details
- View all books in a responsive grid
- Edit existing book information
- Delete books from inventory
- Search and filter capabilities

### 🎨 User Interface
- Responsive design for all devices
- Clean and intuitive navigation
- Form validation and error handling
- Loading states and user feedback

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd bookstore-fullstack
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install root dependencies (for concurrent running)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

### 3. Environment Setup
Create a `.env` file in the `backend` directory:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=30d
\`\`\`

### 4. Database Setup
Make sure MongoDB is running on your system:
- **Local MongoDB**: Start the MongoDB service
- **MongoDB Atlas**: Use your connection string in MONGODB_URI

### 5. Run the Application

#### Option 1: Run Both Servers Concurrently
\`\`\`bash
# From the root directory
npm run dev
\`\`\`

#### Option 2: Run Servers Separately
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Books (Protected routes require JWT token)
- `GET /api/books` - Get all books (public)
- `GET /api/books/:id` - Get single book (public)
- `POST /api/books` - Create new book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

## Database Schema

### Users Collection
\`\`\`javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Books Collection
\`\`\`javascript
{
  title: String (required),
  author: String (required),
  genre: String (required),
  price: Number (required),
  stock: Number (required),
  isbn: String (required, unique),
  description: String (required),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Project Structure

\`\`\`
bookstore-fullstack/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── bookController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Book.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── books.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Books.js
│   │   │   ├── AddBook.js
│   │   │   └── EditBook.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
\`\`\`

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **View Books**: Browse all books in the collection (available to all users)
3. **Add Books**: Authenticated users can add new books with complete details
4. **Edit Books**: Update existing book information
5. **Delete Books**: Remove books from the inventory
6. **Responsive Design**: Use on desktop, tablet, or mobile devices

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
