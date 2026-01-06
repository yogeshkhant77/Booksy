"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BookActions from "../components/BookActions";

const SearchBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const response = await axios.get("/api/google-books/search", {
        params: {
          q: searchQuery,
          maxResults: 20,
        },
      });
      setSearchResults(response.data.books || []);
      setTotalItems(response.data.totalItems || 0);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to search books");
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (book) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!book.isbn) {
      alert("This book doesn't have an ISBN number. Please add it manually.");
      return;
    }

    setImporting({ ...importing, [book.googleId]: true });

    try {
      if (user.role === "admin") {
        // Admin: Add to main books collection
        const bookData = {
          title: book.title,
          author: book.author,
          genre: book.genre || "General",
          price: 0,
          stock: 0,
          isbn: book.isbn,
          description: book.description || "No description available",
        };

        await axios.post("/api/books", bookData);
        alert("Book added to collection successfully!");
        navigate("/books");
      } else {
        // User: Add to personal collection (book must exist in main collection first)
        // First, check if book exists in main collection by ISBN
        const allBooksResponse = await axios.get("/api/books");
        const existingBook = allBooksResponse.data.find(
          (b) => b.isbn === book.isbn
        );

        if (!existingBook) {
          alert(
            "This book is not available in the main collection. Only admin can add new books."
          );
          return;
        }

        // Add to user's personal collection
        await axios.post("/api/my-books", { bookId: existingBook._id });
        alert("Book added to your collection successfully!");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message || "Book already exists");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to perform this action");
      } else {
        alert("Failed to import book. Please try again.");
      }
      console.error("Error importing book:", error);
    } finally {
      setImporting({ ...importing, [book.googleId]: false });
    }
  };

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
            fontWeight: 800,
            marginBottom: "1rem",
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          🔍 Search Google Books
        </h1>
        <form onSubmit={handleSearch}>
          <div className="search-form-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books (title, author, ISBN, etc.)"
              className="form-group input search-input"
              style={{
                padding: "12px 16px",
                fontSize: "16px",
                border: "2px solid var(--gray-light)",
                borderRadius: "8px",
              }}
            />
            <button type="submit" disabled={loading} className="button">
              <span className="button-content">
                {loading ? "Searching..." : "🔍 Search"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {totalItems > 0 && (
        <div
          className="card"
          style={{ marginBottom: "2rem", textAlign: "center" }}
        >
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--gray)",
              fontWeight: 600,
            }}
          >
            Found {totalItems.toLocaleString()} result
            {totalItems !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="book-grid">
          {searchResults.map((book) => (
            <div key={book.googleId} className="book-card">
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                    marginBottom: "10px",
                  }}
                />
              )}
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              {book.publishedDate && (
                <p>
                  <strong>Published:</strong> {book.publishedDate}
                </p>
              )}
              {book.genre && book.genre !== "General" && (
                <p>
                  <strong>Genre:</strong> {book.genre}
                </p>
              )}
              {book.isbn && (
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
              )}
              {book.pageCount > 0 && (
                <p>
                  <strong>Pages:</strong> {book.pageCount}
                </p>
              )}
              {book.averageRating > 0 && (
                <p>
                  <strong>Rating:</strong> {book.averageRating.toFixed(1)} / 5.0
                  ({book.ratingsCount} ratings)
                </p>
              )}
              {book.description && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    maxHeight: "100px",
                    overflow: "hidden",
                  }}
                >
                  {book.description.substring(0, 150)}...
                </p>
              )}

              <div
                className="book-actions"
                style={{ marginTop: "10px", display: "flex", gap: "10px" }}
              >
                {user && (
                  <button
                    onClick={() => handleImport(book)}
                    disabled={importing[book.googleId] || !book.isbn}
                    className="btn-swipe"
                  >
                    {importing[book.googleId]
                      ? "Importing..."
                      : user.role === "admin"
                      ? "Add to Collection"
                      : "Add to My Books"}
                  </button>
                )}
                {book.previewLink && (
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Preview
                  </a>
                )}
              </div>
              {/* BookActions will only work for imported books (with _id) */}
              {user && <BookActions book={book} isGoogleBook={true} />}
              {!book.isbn && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#ff6b6b",
                    marginTop: "5px",
                  }}
                >
                  ⚠️ No ISBN - cannot import automatically
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {searchResults.length === 0 && !loading && searchQuery && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "var(--gray)" }}>
            No books found
          </h2>
          <p style={{ color: "var(--gray)" }}>
            Try a different search query or browse our collection.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
