"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

const BookActions = ({ book, isGoogleBook = false }) => {
  const { user } = useAuth()
  const { addToCart, isInCart } = useCart()
  const [isLiked, setIsLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [dbBookId, setDbBookId] = useState(null)
  const [checking, setChecking] = useState(false)

  // For Google Books, we need to check if the book exists in our database first
  const bookId = book._id || book.id || dbBookId

  useEffect(() => {
    if (user && isGoogleBook && book.isbn && !book._id) {
      checkIfBookExists()
    } else if (user && bookId) {
      checkLikedStatus()
    }
  }, [user, book.isbn, isGoogleBook])

  const checkIfBookExists = async () => {
    if (!book.isbn) return

    setChecking(true)
    try {
      // Search for book by ISBN
      const response = await axios.get("/api/books")
      const books = response.data
      const foundBook = books.find((b) => b.isbn === book.isbn)
      if (foundBook) {
        setDbBookId(foundBook._id)
        checkLikedStatus(foundBook._id)
      }
    } catch (error) {
      console.error("Error checking if book exists:", error)
    } finally {
      setChecking(false)
    }
  }

  const checkLikedStatus = async (id = null) => {
    const checkId = id || bookId
    if (!user || !checkId) return

    try {
      const response = await axios.get(`/api/users/check-liked/${checkId}`)
      setIsLiked(response.data.isLiked)
    } catch (error) {
      // Book might not exist in our database yet (Google Books)
      setIsLiked(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like books")
      return
    }

    const idToUse = dbBookId || bookId
    if (!idToUse) {
      alert("This book needs to be imported to your collection first")
      return
    }

    setLiking(true)
    try {
      if (isLiked) {
        await axios.delete(`/api/users/like/${idToUse}`)
        setIsLiked(false)
      } else {
        await axios.post(`/api/users/like/${idToUse}`)
        setIsLiked(true)
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update like status"
      alert(message)
    } finally {
      setLiking(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart")
      return
    }

    const idToUse = dbBookId || bookId
    if (!idToUse) {
      alert("This book needs to be imported to your collection first")
      return
    }

    // Get book details from database if we found it
    let bookToUse = book
    if (dbBookId && !book.price) {
      try {
        const response = await axios.get(`/api/books/${dbBookId}`)
        bookToUse = response.data
      } catch (error) {
        console.error("Error fetching book details:", error)
      }
    }

    // Check if book has price and stock
    if (bookToUse.price === undefined || bookToUse.price === null) {
      alert("This book doesn't have a price set. Please import it first and set a price.")
      return
    }

    if (bookToUse.stock === 0 || bookToUse.stock === undefined) {
      alert("This book is out of stock")
      return
    }

    setAddingToCart(true)
    try {
      const result = await addToCart(idToUse, 1)
      if (result.success) {
        alert("Book added to cart!")
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  if (!user) {
    return null
  }

  const idToUse = dbBookId || bookId
  const inCart = idToUse ? isInCart(idToUse) : false

  if (checking) {
    return null // Don't show buttons while checking
  }

  return (
    <div className="book-actions" style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <button
        onClick={handleLike}
        disabled={liking || !idToUse}
        className={`btn ${isLiked ? "btn-primary" : "btn-secondary"}`}
        style={{ minWidth: "100px" }}
      >
        {liking ? "..." : isLiked ? "❤️ Liked" : "🤍 Like"}
      </button>
      {idToUse && (
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || inCart}
          className={`btn ${inCart ? "btn-success" : "btn-primary"}`}
          style={{ minWidth: "120px" }}
        >
          {addingToCart ? "Adding..." : inCart ? "✅ In Cart" : "🛒 Add to Cart"}
        </button>
      )}
    </div>
  )
}

export default BookActions

