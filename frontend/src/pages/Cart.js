"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    loading,
  } = useCart();
  const { user } = useAuth();
  const [updating, setUpdating] = useState({});
  const [removing, setRemoving] = useState({});

  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating({ ...updating, [bookId]: true });
    try {
      await updateQuantity(bookId, newQuantity);
    } catch (error) {
      alert("Failed to update quantity");
    } finally {
      setUpdating({ ...updating, [bookId]: false });
    }
  };

  const handleRemove = async (bookId) => {
    if (
      !window.confirm("Are you sure you want to remove this item from cart?")
    ) {
      return;
    }

    setRemoving({ ...removing, [bookId]: true });
    try {
      await removeFromCart(bookId);
    } catch (error) {
      alert("Failed to remove item");
    } finally {
      setRemoving({ ...removing, [bookId]: false });
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      await clearCart();
    } catch (error) {
      alert("Failed to clear cart");
    }
  };

  if (!user) {
    return (
      <div className="fade-in">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>
            Please login to view your cart
          </h2>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          🛒 Shopping Cart
        </h1>
        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="bin-button"
            title="Clear entire cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 39 7"
              className="bin-top"
            >
              <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
              <line
                strokeWidth="3"
                stroke="white"
                y2="1.5"
                x2="26.0357"
                y1="1.5"
                x1="12"
              ></line>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 33 39"
              className="bin-bottom"
            >
              <mask fill="white" id="path-1-inside-1_8_19">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path
                mask="url(#path-1-inside-1_8_19)"
                fill="white"
                d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
              ></path>
              <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
              <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 89 80"
              className="garbage"
            >
              <path
                fill="white"
                d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
              ></path>
            </svg>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "var(--gray)" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "var(--gray)", marginBottom: "1.5rem" }}>
            Start adding books to your cart!
          </p>
          <Link to="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          <div
            className="book-grid"
            style={{ gridTemplateColumns: "1fr", gap: "1.5rem" }}
          >
            {cart.map((item) => {
              const book = item.book;
              if (!book) return null;

              return (
                <div
                  key={item.book._id || item.book}
                  className="book-card"
                  style={{ display: "flex", gap: "1.5rem" }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{book.title}</h3>
                    <p>
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p>
                      <strong>Genre:</strong> {book.genre}
                    </p>
                    <p>
                      <strong>Price:</strong> $
                      {book.price?.toFixed(2) || "0.00"}
                    </p>
                    {book.description && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--gray)",
                          marginTop: "0.5rem",
                        }}
                      >
                        {book.description.length > 150
                          ? `${book.description.substring(0, 150)}...`
                          : book.description}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      alignItems: "flex-end",
                      minWidth: "200px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Quantity:</label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleQuantityChange(book._id, item.quantity - 1)
                          }
                          disabled={updating[book._id] || item.quantity <= 1}
                          className="btn btn-secondary"
                          style={{
                            padding: "0.25rem 0.5rem",
                            minWidth: "auto",
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            minWidth: "30px",
                            textAlign: "center",
                            fontWeight: 600,
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(book._id, item.quantity + 1)
                          }
                          disabled={
                            updating[book._id] ||
                            item.quantity >= (book.stock || 0)
                          }
                          className="btn btn-secondary"
                          style={{
                            padding: "0.25rem 0.5rem",
                            minWidth: "auto",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                        }}
                      >
                        ${((book.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      <p style={{ fontSize: "0.9rem", color: "var(--gray)" }}>
                        ${book.price?.toFixed(2) || "0.00"} each
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(book._id)}
                      disabled={removing[book._id]}
                      className="bin-button"
                      title="Remove from cart"
                      style={{ width: "auto" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 39 7"
                        className="bin-top"
                      >
                        <line
                          strokeWidth="4"
                          stroke="white"
                          y2="5"
                          x2="39"
                          y1="5"
                        ></line>
                        <line
                          strokeWidth="3"
                          stroke="white"
                          y2="1.5"
                          x2="26.0357"
                          y1="1.5"
                          x1="12"
                        ></line>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 33 39"
                        className="bin-bottom"
                      >
                        <mask fill="white" id="path-1-inside-1_8_19">
                          <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                        </mask>
                        <path
                          mask="url(#path-1-inside-1_8_19)"
                          fill="white"
                          d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                        ></path>
                        <path
                          strokeWidth="4"
                          stroke="white"
                          d="M12 6L12 29"
                        ></path>
                        <path
                          strokeWidth="4"
                          stroke="white"
                          d="M21 6V29"
                        ></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 89 80"
                        className="garbage"
                      >
                        <path
                          fill="white"
                          d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ marginTop: "2rem", padding: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                Total Items:
              </h2>
              <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>
                Total Price:
              </h2>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <Link to="/books" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <button
                className="btn btn-primary"
                style={{ fontSize: "1.1rem", padding: "0.75rem 2rem" }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
