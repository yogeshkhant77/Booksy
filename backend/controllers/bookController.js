const Book = require("../models/Book")
const { validationResult } = require("express-validator")

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })
    res.json(books)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get single book
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }
    res.json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Create book
const createBook = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, author, genre, price, stock, isbn, description } = req.body

    // Check if book with same ISBN exists
    const existingBook = await Book.findOne({ isbn })
    if (existingBook) {
      return res.status(400).json({ message: "Book with this ISBN already exists" })
    }

    const book = new Book({
      title,
      author,
      genre,
      price,
      stock,
      isbn,
      description,
    })

    await book.save()
    res.status(201).json({ message: "Book created successfully", book })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update book
const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, author, genre, price, stock, isbn, description } = req.body

    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if ISBN is being changed and if it conflicts with another book
    if (isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn })
      if (existingBook) {
        return res.status(400).json({ message: "Book with this ISBN already exists" })
      }
    }

    book.title = title
    book.author = author
    book.genre = genre
    book.price = price
    book.stock = stock
    book.isbn = isbn
    book.description = description

    await book.save()
    res.json({ message: "Book updated successfully", book })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    await Book.findByIdAndDelete(req.params.id)
    res.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
}
