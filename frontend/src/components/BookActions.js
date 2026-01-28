"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const BookActions = ({ book, isGoogleBook = false }) => {
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
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

  const handleLike = () => {
    if (!user) {
      alert("Please login to like books");
      return;
    }

    const idToUse = dbBookId || bookId;
    if (!idToUse) {
      alert("This book needs to be imported to your collection first");
      return;
    }

    // Optimistic update - update UI immediately
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // Make the API call in the background
    if (newLikedState) {
      axios.post(`/api/users/like/${idToUse}`).catch((error) => {
        // Revert on error
        setIsLiked(false);
        const message = error.response?.data?.message || "Failed to like book";
        alert(message);
      });
    } else {
      axios.delete(`/api/users/like/${idToUse}`).catch((error) => {
        // Revert on error
        setIsLiked(true);
        const message =
          error.response?.data?.message || "Failed to unlike book";
        alert(message);
      });
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
        "This book doesn't have a price set. Please import it first and set a price.",
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
    <div className="book-actions-wrapper">
      <button
        onClick={handleLike}
        disabled={!idToUse}
        className={`btn-like ${isLiked ? "liked" : ""}`}
        title={isLiked ? "Unlike" : "Like"}
      >
        <span className="heart-icon">♥</span>
        {isLiked ? "Liked" : "Like"}
      </button>
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
