const axios = require("axios")

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1/volumes"

// Search books from Google Books API
const searchBooks = async (req, res) => {
  try {
    const { q, startIndex = 0, maxResults = 20 } = req.query

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" })
    }

    const response = await axios.get(GOOGLE_BOOKS_API_BASE, {
      params: {
        q: q.trim(),
        startIndex: parseInt(startIndex),
        maxResults: Math.min(parseInt(maxResults), 40), // Limit to 40 max
      },
    })

    // Transform Google Books data to a cleaner format
    const books = response.data.items?.map((item) => {
      const volumeInfo = item.volumeInfo || {}
      return {
        googleId: item.id,
        title: volumeInfo.title || "No title",
        authors: volumeInfo.authors || ["Unknown"],
        author: volumeInfo.authors?.join(", ") || "Unknown",
        description: volumeInfo.description || "No description available",
        publisher: volumeInfo.publisher || "Unknown",
        publishedDate: volumeInfo.publishedDate || "Unknown",
        pageCount: volumeInfo.pageCount || 0,
        categories: volumeInfo.categories || [],
        genre: volumeInfo.categories?.[0] || "General",
        language: volumeInfo.language || "en",
        isbn: volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier ||
              volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")?.identifier ||
              "",
        imageLinks: volumeInfo.imageLinks || {},
        thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || "",
        previewLink: volumeInfo.previewLink || "",
        infoLink: volumeInfo.infoLink || "",
        averageRating: volumeInfo.averageRating || 0,
        ratingsCount: volumeInfo.ratingsCount || 0,
      }
    }) || []

    res.json({
      totalItems: response.data.totalItems || 0,
      books,
    })
  } catch (error) {
    console.error("Google Books API error:", error)
    res.status(500).json({
      message: "Failed to search books",
      error: error.message,
    })
  }
}

// Get book details by Google Books ID
const getBookDetails = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: "Book ID is required" })
    }

    const response = await axios.get(`${GOOGLE_BOOKS_API_BASE}/${id}`)

    const volumeInfo = response.data.volumeInfo || {}
    const book = {
      googleId: response.data.id,
      title: volumeInfo.title || "No title",
      authors: volumeInfo.authors || ["Unknown"],
      author: volumeInfo.authors?.join(", ") || "Unknown",
      description: volumeInfo.description || "No description available",
      publisher: volumeInfo.publisher || "Unknown",
      publishedDate: volumeInfo.publishedDate || "Unknown",
      pageCount: volumeInfo.pageCount || 0,
      categories: volumeInfo.categories || [],
      genre: volumeInfo.categories?.[0] || "General",
      language: volumeInfo.language || "en",
      isbn: volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier ||
            volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")?.identifier ||
            "",
      imageLinks: volumeInfo.imageLinks || {},
      thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || "",
      previewLink: volumeInfo.previewLink || "",
      infoLink: volumeInfo.infoLink || "",
      averageRating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
    }

    res.json(book)
  } catch (error) {
    console.error("Google Books API error:", error)
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Book not found" })
    }
    res.status(500).json({
      message: "Failed to fetch book details",
      error: error.message,
    })
  }
}

// Get all books from Google Books API (popular/bestselling books)
const getAllBooks = async (req, res) => {
  try {
    const { startIndex = 0, maxResults = 40, subject } = req.query

    // Build query - use more reliable queries that work better with Google Books API
    let query
    if (subject) {
      query = `subject:${subject}`
    } else {
      // Use a query that's guaranteed to return results - search for books with recent publication dates
      // This will return a variety of books from Google Books
      query = "books" // Simple search term that returns many results
    }

    const response = await axios.get(GOOGLE_BOOKS_API_BASE, {
      params: {
        q: query,
        startIndex: parseInt(startIndex),
        maxResults: Math.min(parseInt(maxResults), 40),
        orderBy: "relevance", // Use relevance for better results
      },
      timeout: 10000, // 10 second timeout
    })

    // Check if response is valid
    if (!response.data) {
      return res.status(500).json({
        message: "Invalid response from Google Books API",
      })
    }

    // Transform Google Books data to a cleaner format
    const books = (response.data.items || []).map((item) => {
      const volumeInfo = item.volumeInfo || {}
      return {
        googleId: item.id,
        title: volumeInfo.title || "No title",
        authors: volumeInfo.authors || ["Unknown"],
        author: volumeInfo.authors?.join(", ") || "Unknown",
        description: volumeInfo.description || "No description available",
        publisher: volumeInfo.publisher || "Unknown",
        publishedDate: volumeInfo.publishedDate || "Unknown",
        pageCount: volumeInfo.pageCount || 0,
        categories: volumeInfo.categories || [],
        genre: volumeInfo.categories?.[0] || "General",
        language: volumeInfo.language || "en",
        isbn: volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier ||
              volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")?.identifier ||
              "",
        imageLinks: volumeInfo.imageLinks || {},
        thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || "",
        previewLink: volumeInfo.previewLink || "",
        infoLink: volumeInfo.infoLink || "",
        averageRating: volumeInfo.averageRating || 0,
        ratingsCount: volumeInfo.ratingsCount || 0,
      }
    })

    res.json({
      totalItems: response.data.totalItems || 0,
      books,
    })
  } catch (error) {
    console.error("Google Books API error:", error)
    
    // More detailed error logging
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    } else if (error.request) {
      console.error("Request made but no response received:", error.request)
    }
    
    res.status(500).json({
      message: "Failed to fetch books from Google Books API",
      error: error.response?.data?.error?.message || error.message || "Unknown error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

module.exports = {
  searchBooks,
  getBookDetails,
  getAllBooks,
}

