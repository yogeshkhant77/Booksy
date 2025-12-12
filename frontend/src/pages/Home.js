"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="fade-in">
      <div className="hero-section">
        <h1>Booksy</h1>
        <p>Your one-stop destination for managing books!</p>
        {user && (
          <p style={{ fontSize: "1.1rem", color: "var(--primary)", fontWeight: 600 }}>
            Hello, {user.name} 
          </p>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", color: "var(--text-primary)" }}>
          What would you like to do today?
        </h2>
        <div className="action-buttons">
          <Link to="/books" className="btn btn-primary">
             View All Books
          </Link>
          <Link to="/add-book" className="btn btn-success">
             Add New Book
          </Link>
          <Link to="/search-books" className="btn btn-secondary">
             Search Books
          </Link>
          <Link to="/browse-books" className="btn btn-outline">
             Browse Books
          </Link>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="icon">📖</div>
          <h3>Browse Books</h3>
          <p>Explore our extensive collection of books from various genres and authors.</p>
        </div>
        <div className="feature-card">
          <div className="icon">➕</div>
          <h3>Add Books</h3>
          <p>Easily add new books to your collection with detailed information.</p>
        </div>
        <div className="feature-card">
          <div className="icon">✏️</div>
          <h3>Edit Books</h3>
          <p>Update book information including title, author, price, and stock.</p>
        </div>
        <div className="feature-card">
          <div className="icon">🗑️</div>
          <h3>Manage Inventory</h3>
          <p>Remove books from your inventory when they're no longer available.</p>
        </div>
        <div className="feature-card">
          <div className="icon">🔍</div>
          <h3>Search & Filter</h3>
          <p>Quickly find books using our powerful search and filter options.</p>
        </div>
        <div className="feature-card">
          <div className="icon">🔐</div>
          <h3>Secure Access</h3>
          <p>Your data is protected with secure authentication and authorization.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
