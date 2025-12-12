const UserBook = require("../models/UserBook")
const Book = require("../models/Book")

// Get user's personal book collection
const getMyBooks = async (req, res) => {
  try {
    const userId = req.user._id

    const userBooks = await UserBook.find({ user: userId }).populate("book")
    const books = userBooks.map((ub) => ub.book)

    res.json(books)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Add book to user's collection (import from available books)
const addToMyBooks = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.body

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" })
    }

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if book is already in user's collection
    const existingUserBook = await UserBook.findOne({ user: userId, book: bookId })
    if (existingUserBook) {
      return res.status(400).json({ message: "Book is already in your collection" })
    }

    // Add book to user's collection
    const userBook = new UserBook({
      user: userId,
      book: bookId,
    })

    await userBook.save()
    await userBook.populate("book")

    res.status(201).json({ message: "Book added to your collection", book: userBook.book })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Book is already in your collection" })
    }
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Remove book from user's collection
const removeFromMyBooks = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.params

    const userBook = await UserBook.findOneAndDelete({ user: userId, book: bookId })

    if (!userBook) {
      return res.status(404).json({ message: "Book not found in your collection" })
    }

    res.json({ message: "Book removed from your collection" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Check if book is in user's collection
const checkInMyBooks = async (req, res) => {
  try {
    const userId = req.user._id
    const { bookId } = req.params

    const userBook = await UserBook.findOne({ user: userId, book: bookId })

    res.json({ inCollection: !!userBook })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getMyBooks,
  addToMyBooks,
  removeFromMyBooks,
  checkInMyBooks,
}

