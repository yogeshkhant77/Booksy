"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import BookActions from "../components/BookActions"

const MyBooks = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchMyBooks()
    }
  }, [user])

  const fetchMyBooks = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/my-books")
      setBooks(response.data)
    } catch (error) {
      setError("Failed to fetch your books")
      console.error("Error fetching my books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (bookId) => {
    if (window.confirm("Are you sure you want to remove this book from your collection?")) {
      try {
        await axios.delete(`/api/my-books/${bookId}`)
        setBooks(books.filter((book) => book._id !== bookId))
      } catch (error) {
        setError("Failed to remove book")
        console.error("Error removing book:", error)
      }
    }
  }

  if (!user) {
    return (
      <div className="fade-in">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Please login to view your books</h2>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          📚 My Book Collection
        </h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {books.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "var(--gray)" }}>Your collection is empty</h2>
          <p style={{ color: "var(--gray)", marginBottom: "1.5rem" }}>
            Start building your collection by importing books from Google Books or adding available books!
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <a href="/browse-books" className="btn btn-primary">
              Browse Books
            </a>
            <a href="/search-books" className="btn btn-primary">
              Search Books
            </a>
          </div>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Price:</strong> ${book.price}
              </p>
              <p>
                <strong>Stock:</strong> {book.stock}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              {book.description && (
                <p style={{ fontSize: "14px", color: "var(--gray)", marginTop: "0.5rem" }}>
                  {book.description.length > 100 ? `${book.description.substring(0, 100)}...` : book.description}
                </p>
              )}

              <BookActions book={book} />

              <div className="book-actions" style={{ marginTop: "10px" }}>
                <button onClick={() => handleRemove(book._id)} className="btn btn-danger">
                  🗑️ Remove from Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBooks

