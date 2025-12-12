const User = require("../models/User")
const Book = require("../models/Book")

// Like a book
const likeBook = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if book is already liked
    if (user.likedBooks.includes(bookId)) {
      return res.status(400).json({ message: "Book is already liked" })
    }

    user.likedBooks.push(bookId)
    await user.save()

    res.json({ message: "Book liked successfully", likedBooks: user.likedBooks })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Unlike a book
const unlikeBook = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.likedBooks = user.likedBooks.filter((id) => id.toString() !== bookId)
    await user.save()

    res.json({ message: "Book unliked successfully", likedBooks: user.likedBooks })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get user's liked books
const getLikedBooks = async (req, res) => {
  try {
    const userId = req.user._id

    const user = await User.findById(userId).populate("likedBooks")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ likedBooks: user.likedBooks })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Check if book is liked
const checkLiked = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isLiked = user.likedBooks.some((id) => id.toString() === bookId)
    res.json({ isLiked })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Add book to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.body
    const { quantity } = req.body

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if book is already in cart
    const cartItemIndex = user.cart.findIndex((item) => item.book.toString() === bookId)

    if (cartItemIndex > -1) {
      // Update quantity
      const newQuantity = quantity || user.cart[cartItemIndex].quantity + 1
      if (newQuantity > book.stock) {
        return res.status(400).json({ message: "Insufficient stock" })
      }
      user.cart[cartItemIndex].quantity = newQuantity
    } else {
      // Add new item to cart
      const qty = quantity || 1
      if (qty > book.stock) {
        return res.status(400).json({ message: "Insufficient stock" })
      }
      user.cart.push({ book: bookId, quantity: qty })
    }

    await user.save()
    await user.populate("cart.book")

    res.json({ message: "Book added to cart successfully", cart: user.cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Remove book from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.cart = user.cart.filter((item) => item.book.toString() !== bookId)
    await user.save()
    await user.populate("cart.book")

    res.json({ message: "Book removed from cart successfully", cart: user.cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const cartItem = user.cart.find((item) => item.book.toString() === bookId)
    if (!cartItem) {
      return res.status(404).json({ message: "Book not found in cart" })
    }

    const book = await Book.findById(bookId)
    if (quantity > book.stock) {
      return res.status(400).json({ message: "Insufficient stock" })
    }

    cartItem.quantity = quantity
    await user.save()
    await user.populate("cart.book")

    res.json({ message: "Cart updated successfully", cart: user.cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id

    const user = await User.findById(userId).populate("cart.book")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ cart: user.cart })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.cart = []
    await user.save()

    res.json({ message: "Cart cleared successfully", cart: [] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  likeBook,
  unlikeBook,
  getLikedBooks,
  checkLiked,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
  clearCart,
}

