"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BookActions from "../components/BookActions";

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [subject, setSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const popularSubjects = [
    "Fiction",
    "Nonfiction",
    "Mystery",
    "Science Fiction",
    "Romance",
    "Thriller",
    "Biography",
    "History",
    "Self-Help",
    "Business",
  ];

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/google-books", {
        params: {
          subject: subject || undefined,
          startIndex: currentPage * 20,
          maxResults: 20,
        },
      });
      setBooks(response.data.books || []);
      setTotalItems(response.data.totalItems || 0);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch books. Please check your internet connection and try again.";
      setError(errorMessage);
      console.error("Error fetching books:", error);
      console.error("Full error response:", error.response?.data);
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

  const handleSubjectChange = (newSubject) => {
    setSubject(newSubject);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * 20 < totalItems) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && books.length === 0) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "1.5rem",
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Browse All Books
        </h1>

        {/* Subject Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            style={{
              marginBottom: "0.5rem",
              display: "block",
              fontWeight: 600,
            }}
          >
            Filter by Subject:
          </label>
          <select
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="form-group input"
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "2px solid var(--gray-light)",
              maxWidth: "300px",
            }}
          >
            <option value="">All Subjects</option>
            {popularSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
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
            Showing {currentPage * 20 + 1} -{" "}
            {Math.min((currentPage + 1) * 20, totalItems).toLocaleString()} of{" "}
            {totalItems.toLocaleString()} books
            {subject && ` in "${subject}"`}
          </p>
        </div>
      )}

      {books.length > 0 ? (
        <>
          <div className="book-grid">
            {books.map((book) => (
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
                    <strong>Rating:</strong> ⭐ {book.averageRating.toFixed(1)}{" "}
                    / 5.0 ({book.ratingsCount} ratings)
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
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
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

          {/* Pagination */}
          <div
            className="card"
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0 || loading}
                className="btn btn-primary"
              >
                ⬅️ Previous
              </button>
              <span
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  color: "var(--dark)",
                }}
              >
                Page {currentPage + 1} of {Math.ceil(totalItems / 20)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={(currentPage + 1) * 20 >= totalItems || loading}
                className="btn btn-primary"
              >
                Next ➡️
              </button>
            </div>
          </div>
        </>
      ) : (
        !loading && (
          <div
            className="card"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <h2 style={{ marginBottom: "1rem", color: "var(--gray)" }}>
              No books found
            </h2>
            <p style={{ color: "var(--gray)" }}>
              Try selecting a different subject or check back later.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default BrowseBooks;
