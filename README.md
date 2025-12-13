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

<img width="1918" height="865" alt="Image" src="https://github.com/user-attachments/assets/62355d64-ac0d-4ee3-b674-6058e9324e0a" />
<img width="1897" height="862" alt="Image" src="https://github.com/user-attachments/assets/9349c98a-4ca8-4fa5-96a8-8bcbb4d99613" />
<img width="1891" height="866" alt="Image" src="https://github.com/user-attachments/assets/ac49726c-e6ad-43d7-8b52-018597a999f6" />
<img width="1903" height="864" alt="Image" src="https://github.com/user-attachments/assets/81ba4fdf-1ec6-4029-965c-8e61efdf7d98" />
<img width="1886" height="863" alt="Image" src="https://github.com/user-attachments/assets/ff01222c-2f4c-4a2f-9d33-3c407a8fa19b" />
<img width="1890" height="871" alt="Image" src="https://github.com/user-attachments/assets/92b299e2-4981-4713-81fb-312556d38377" />
<img width="1889" height="857" alt="Image" src="https://github.com/user-attachments/assets/71cd0dac-df17-442f-9b61-bb7fe746d568" />
<img width="1883" height="865" alt="Image" src="https://github.com/user-attachments/assets/64bc28c2-5c48-49c7-b69f-2f09c8a790a2" />
<img width="1885" height="859" alt="Image" src="https://github.com/user-attachments/assets/ed44682c-0e5d-43f7-8bc4-e9fd780f2a93" />
<img width="1881" height="857" alt="Image" src="https://github.com/user-attachments/assets/bb7b2ade-8f9a-4b77-994a-44acfc43412d" />
<img width="1897" height="872" alt="Image" src="https://github.com/user-attachments/assets/97e0b791-6ebd-41e3-9f4a-f2480657d761" />
<img width="1899" height="858" alt="Image" src="https://github.com/user-attachments/assets/283d8226-6fbe-4a6d-af47-b4dfd5a0134d" />
<img width="1901" height="863" alt="Image" src="https://github.com/user-attachments/assets/f88db0a6-7e39-489b-964b-7318f573b406" />
