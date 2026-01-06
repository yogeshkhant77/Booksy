"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const BookActions = ({ book, isGoogleBook = false }) => {
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [dbBookId, setDbBookId] = useState(null);
  const [checking, setChecking] = useState(false);

  // For Google Books, we need to check if the book exists in our database first
  const bookId = book._id || book.id || dbBookId;

  useEffect(() => {
    if (user && isGoogleBook && book.isbn && !book._id) {
      checkIfBookExists();
    } else if (user && bookId) {
      checkLikedStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, book.isbn, isGoogleBook, book._id, dbBookId]);

  const checkIfBookExists = async () => {
    if (!book.isbn) return;

    setChecking(true);
    try {
      // Search for book by ISBN
      const response = await axios.get("/api/books");
      const books = response.data;
      const foundBook = books.find((b) => b.isbn === book.isbn);
      if (foundBook) {
        setDbBookId(foundBook._id);
        checkLikedStatus(foundBook._id);
      }
    } catch (error) {
      console.error("Error checking if book exists:", error);
    } finally {
      setChecking(false);
    }
  };

  const checkLikedStatus = async (id = null) => {
    const checkId = id || bookId;
    if (!user || !checkId) return;

    try {
      const response = await axios.get(`/api/users/check-liked/${checkId}`);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      // Book might not exist in our database yet (Google Books)
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like books");
      return;
    }

    const idToUse = dbBookId || bookId;
    if (!idToUse) {
      alert("This book needs to be imported to your collection first");
      return;
    }

    setLiking(true);
    try {
      if (isLiked) {
        await axios.delete(`/api/users/like/${idToUse}`);
        setIsLiked(false);
      } else {
        await axios.post(`/api/users/like/${idToUse}`);
        setIsLiked(true);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update like status";
      alert(message);
    } finally {
      setLiking(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    const idToUse = dbBookId || bookId;
    if (!idToUse) {
      alert("This book needs to be imported to your collection first");
      return;
    }

    // Get book details from database if we found it
    let bookToUse = book;
    if (dbBookId && !book.price) {
      try {
        const response = await axios.get(`/api/books/${dbBookId}`);
        bookToUse = response.data;
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    }

    // Check if book has price and stock
    if (bookToUse.price === undefined || bookToUse.price === null) {
      alert(
        "This book doesn't have a price set. Please import it first and set a price."
      );
      return;
    }

    if (bookToUse.stock === 0 || bookToUse.stock === undefined) {
      alert("This book is out of stock");
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart(idToUse, 1);
      if (result.success) {
        alert("Book added to cart!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (!user) {
    return null;
  }

  const idToUse = dbBookId || bookId;
  const inCart = idToUse ? isInCart(idToUse) : false;

  if (checking) {
    return null; // Don't show buttons while checking
  }

  return (
    <div
      className="book-actions"
      style={{
        marginTop: "10px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <div title="Like" className="heart-container">
        <input
          id={`heart-${idToUse}`}
          className="checkbox"
          type="checkbox"
          checked={isLiked}
          onChange={handleLike}
          disabled={liking || !idToUse}
          style={{ cursor: liking || !idToUse ? "not-allowed" : "pointer" }}
        />
        <div className="svg-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="svg-outline"
            viewBox="0 0 24 24"
          >
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="svg-filled"
            viewBox="0 0 24 24"
          >
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="100"
            width="100"
            className="svg-celebrate"
          >
            <polygon points="10,10 20,20" />
            <polygon points="10,50 20,50" />
            <polygon points="20,80 30,70" />
            <polygon points="90,10 80,20" />
            <polygon points="90,50 80,50" />
            <polygon points="80,80 70,70" />
          </svg>
        </div>
      </div>
      {idToUse && (
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || inCart}
          className="btn-swipe"
          title={inCart ? "Already in cart" : "Add to cart"}
        >
          {addingToCart ? "Adding..." : inCart ? " In Cart" : " Add to Cart"}
        </button>
      )}
    </div>
  );
};

export default BookActions;
