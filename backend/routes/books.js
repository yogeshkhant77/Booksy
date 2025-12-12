const express = require("express")
const { body } = require("express-validator")
const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require("../controllers/bookController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

const router = express.Router()

// Validation rules for book
const bookValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("genre").trim().notEmpty().withMessage("Genre is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("isbn").trim().notEmpty().withMessage("ISBN is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
]

// Public routes
router.get("/", getAllBooks)
router.get("/:id", getBook)

// Protected routes (require admin role)
router.post("/", auth, admin, bookValidation, createBook)
router.put("/:id", auth, admin, bookValidation, updateBook)
router.delete("/:id", auth, admin, deleteBook)

module.exports = router
