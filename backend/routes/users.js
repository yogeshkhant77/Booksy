const express = require("express")
const {
  likeBook,
  unlikeBook,
  getLikedBooks,
  checkLiked,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
  clearCart,
} = require("../controllers/userController")
const auth = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(auth)

// Like routes
router.post("/like/:bookId", likeBook)
router.delete("/like/:bookId", unlikeBook)
router.get("/liked", getLikedBooks)
router.get("/check-liked/:bookId", checkLiked)

// Cart routes
router.post("/cart", addToCart)
router.get("/cart", getCart)
router.delete("/cart/:bookId", removeFromCart)
router.put("/cart/:bookId", updateCartQuantity)
router.delete("/cart", clearCart)

module.exports = router

