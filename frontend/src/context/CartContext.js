"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart([])
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await axios.get("/api/users/cart")
      setCart(response.data.cart || [])
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (bookId, quantity = 1) => {
    if (!user) {
      return { success: false, message: "Please login to add items to cart" }
    }

    try {
      const response = await axios.post("/api/users/cart", { bookId, quantity })
      setCart(response.data.cart || [])
      return { success: true, message: "Book added to cart" }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to cart"
      return { success: false, message }
    }
  }

  const removeFromCart = async (bookId) => {
    if (!user) return { success: false, message: "Please login" }

    try {
      const response = await axios.delete(`/api/users/cart/${bookId}`)
      setCart(response.data.cart || [])
      return { success: true, message: "Book removed from cart" }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove from cart"
      return { success: false, message }
    }
  }

  const updateQuantity = async (bookId, quantity) => {
    if (!user) return { success: false, message: "Please login" }

    try {
      const response = await axios.put(`/api/users/cart/${bookId}`, { quantity })
      setCart(response.data.cart || [])
      return { success: true, message: "Cart updated" }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update cart"
      return { success: false, message }
    }
  }

  const clearCart = async () => {
    if (!user) return { success: false, message: "Please login" }

    try {
      await axios.delete("/api/users/cart")
      setCart([])
      return { success: true, message: "Cart cleared" }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to clear cart"
      return { success: false, message }
    }
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (item.book && item.book.price) {
        return total + item.book.price * item.quantity
      }
      return total
    }, 0)
  }

  const isInCart = (bookId) => {
    return cart.some((item) => item.book?._id === bookId || item.book?.toString() === bookId)
  }

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

