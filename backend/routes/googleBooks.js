const express = require("express")
const { searchBooks, getBookDetails, getAllBooks } = require("../controllers/googleBooksController")

const router = express.Router()

// Get all books from Google Books API (popular/bestselling)
router.get("/", getAllBooks)

// Search books from Google Books API
router.get("/search", searchBooks)

// Get book details by Google Books ID
router.get("/details/:id", getBookDetails)

module.exports = router

