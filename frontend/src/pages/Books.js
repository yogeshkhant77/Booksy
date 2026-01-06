"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BookActions from "../components/BookActions";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCollection, setAddingToCollection] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/api/books");
      setBooks(response.data);
    } catch (error) {
      setError("Failed to fetch books");
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`/api/books/${bookId}`);
        setBooks(books.filter((book) => book._id !== bookId));
      } catch (error) {
        setError("Failed to delete book");
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleAddToMyBooks = async (bookId) => {
    setAddingToCollection({ ...addingToCollection, [bookId]: true });
    try {
      await axios.post("/api/my-books", { bookId });
      alert("Book added to your collection!");
    } catch (error) {
      if (error.response?.status === 400) {
        alert(
          error.response.data.message || "Book is already in your collection"
        );
      } else {
        alert("Failed to add book to collection");
      }
      console.error("Error adding to collection:", error);
    } finally {
      setAddingToCollection({ ...addingToCollection, [bookId]: false });
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {user?.role === "admin" ? "All Books (Admin)" : "Available Books"}
        </h1>
        {user?.role === "admin" && (
          <Link to="/add-book" className="btn btn-success">
            Add New Book
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {books.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "var(--gray)" }}>
            No books found
          </h2>
          <p style={{ color: "var(--gray)", marginBottom: "1.5rem" }}>
            {user?.role === "admin"
              ? "Start building the collection by adding your first book!"
              : "No books available yet."}
          </p>
          {user?.role === "admin" && (
            <Link to="/add-book" className="btn btn-primary">
              Add Your First Book
            </Link>
          )}
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
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--gray)",
                    marginTop: "0.5rem",
                  }}
                >
                  {book.description.length > 100
                    ? `${book.description.substring(0, 100)}...`
                    : book.description}
                </p>
              )}

              <BookActions book={book} />

              {user?.role === "admin" ? (
                <div className="book-actions" style={{ marginTop: "10px" }}>
                  <Link
                    to={`/edit-book/${book._id}`}
                    className="btn-swipe"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bin-button"
                    title="Delete book"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 39 7"
                      className="bin-top"
                    >
                      <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
                      <line
                        strokeWidth="3"
                        stroke="white"
                        y2="1.5"
                        x2="26.0357"
                        y1="1.5"
                        x1="12"
                      ></line>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 33 39"
                      className="bin-bottom"
                    >
                      <mask fill="white" id="path-1-inside-1_8_19">
                        <path
                          d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                        ></path>
                      </mask>
                      <path
                        mask="url(#path-1-inside-1_8_19)"
                        fill="white"
                        d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                      ></path>
                      <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
                      <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 89 80"
                      className="garbage"
                    >
                      <path
                        fill="white"
                        d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                      ></path>
                    </svg>
                  </button>
                </div>
              ) : user ? (
                <div className="book-actions" style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => handleAddToMyBooks(book._id)}
                    disabled={addingToCollection[book._id]}
                    className="btn-swipe"
                  >
                    {addingToCollection[book._id]
                      ? "Adding..."
                      : " Add to My Books"}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
