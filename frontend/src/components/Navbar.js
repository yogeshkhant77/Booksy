"use client";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/home" className="navbar-brand">
            BookSy
          </Link>
          <div className="navbar-right">
            <input
              type="checkbox"
              id="checkbox"
              checked={mobileMenuOpen}
              onChange={(e) => setMobileMenuOpen(e.target.checked)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            />
            <label htmlFor="checkbox" className="toggle" aria-hidden="true">
              <div className="bars" id="bar1"></div>
              <div className="bars" id="bar2"></div>
              <div className="bars" id="bar3"></div>
            </label>

            <div className={`navbar-menu ${mobileMenuOpen ? "is-open" : ""}`}>
              <ul className="navbar-nav">
                <li>
                  <Link
                    to="/home"
                    onClick={closeMobileMenu}
                    className="navbar-link"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/books"
                    onClick={closeMobileMenu}
                    className="navbar-link"
                  >
                    Books
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search-books"
                    onClick={closeMobileMenu}
                    className="navbar-link"
                  >
                    Search Books
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse-books"
                    onClick={closeMobileMenu}
                    className="navbar-link"
                  >
                    Browse All Books
                  </Link>
                </li>
                {user ? (
                  <>
                    {user.role === "admin" ? (
                      <>
                        <li>
                          <Link
                            to="/add-book"
                            onClick={closeMobileMenu}
                            className="navbar-link"
                          >
                            Add Book
                          </Link>
                        </li>
                        <li
                          ref={dropdownRef}
                          style={{ position: "relative", width: "100%" }}
                        >
                          <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="navbar-dropdown-toggle"
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--text-primary)",
                              cursor: "pointer",
                              padding: "0.5rem 1rem",
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                          >
                            More ▼
                          </button>
                          {dropdownOpen && (
                            <div
                              className="navbar-dropdown"
                              style={{
                                position: "static",
                                background: "var(--card-bg)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "8px",
                                boxShadow: "var(--shadow-lg)",
                                minWidth: "150px",
                                marginTop: "0.5rem",
                                zIndex: 1000,
                                display: "flex",
                                flexDirection: "column",
                                gap: "0",
                              }}
                            >
                              <Link
                                to="/users"
                                onClick={() => {
                                  setDropdownOpen(false);
                                  closeMobileMenu();
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "0.75rem 1rem",
                                  color: "var(--text-primary)",
                                  textDecoration: "none",
                                  borderBottom: "1px solid var(--border-color)",
                                  transition: "background 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.background =
                                    "var(--primary-light)")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.background = "transparent")
                                }
                                onTouchStart={(e) =>
                                  (e.currentTarget.style.background =
                                    "var(--primary-light)")
                                }
                                onTouchEnd={(e) =>
                                  (e.currentTarget.style.background =
                                    "transparent")
                                }
                              >
                                👥 Users
                              </Link>
                              <Link
                                to="/cart"
                                onClick={() => {
                                  setDropdownOpen(false);
                                  closeMobileMenu();
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "0.75rem 1rem",
                                  color: "var(--text-primary)",
                                  textDecoration: "none",
                                  position: "relative",
                                  transition: "background 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.background =
                                    "var(--primary-light)")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.background = "transparent")
                                }
                                onTouchStart={(e) =>
                                  (e.currentTarget.style.background =
                                    "var(--primary-light)")
                                }
                                onTouchEnd={(e) =>
                                  (e.currentTarget.style.background =
                                    "transparent")
                                }
                              >
                                🛒 Cart
                                {getCartItemCount() > 0 && (
                                  <span
                                    style={{
                                      position: "absolute",
                                      right: "1rem",
                                      background: "var(--primary)",
                                      color: "white",
                                      borderRadius: "50%",
                                      width: "20px",
                                      height: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {getCartItemCount()}
                                  </span>
                                )}
                              </Link>
                            </div>
                          )}
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            to="/my-books"
                            onClick={closeMobileMenu}
                            className="navbar-link"
                          >
                            My Books
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/cart"
                            className="cart-link navbar-link"
                            style={{ position: "relative" }}
                            onClick={closeMobileMenu}
                          >
                            🛒 Cart
                            {getCartItemCount() > 0 && (
                              <span
                                className="cart-badge"
                                style={{
                                  position: "absolute",
                                  top: "-8px",
                                  right: "-8px",
                                  background: "var(--primary)",
                                  color: "white",
                                  borderRadius: "50%",
                                  width: "20px",
                                  height: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                {getCartItemCount()}
                              </span>
                            )}
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <span
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        {user.name}
                      </span>
                      {user.role === "admin" && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            background:
                              "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            fontWeight: 600,
                          }}
                        >
                          (Admin)
                        </span>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="btn btn-primary"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="navbar-link"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="navbar-link"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <label className="switch theme-switch" aria-label="Toggle theme">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
