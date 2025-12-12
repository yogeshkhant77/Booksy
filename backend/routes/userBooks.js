const express = require("express")
const {
  getMyBooks,
  addToMyBooks,
  removeFromMyBooks,
  checkInMyBooks,
} = require("../controllers/userBookController")
const auth = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(auth)

// Get user's book collection
router.get("/", getMyBooks)

// Add book to user's collection
router.post("/", addToMyBooks)

// Check if book is in collection
router.get("/check/:bookId", checkInMyBooks)

// Remove book from user's collection
router.delete("/:bookId", removeFromMyBooks)

module.exports = router

