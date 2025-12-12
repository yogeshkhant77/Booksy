"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const Users = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers()
      fetchStats()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/admin/users")
      setUsers(response.data)
    } catch (error) {
      setError("Failed to fetch users")
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/admin/users/stats")
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="fade-in">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Access Denied</h2>
          <p style={{ color: "var(--gray)" }}>You need admin privileges to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          👥 Users Management
        </h1>
      </div>

      {stats && (
        <div className="card" style={{ marginBottom: "2rem", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", color: "var(--primary)", margin: 0 }}>{stats.totalUsers}</h3>
            <p style={{ color: "var(--gray)", margin: 0 }}>Total Users</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", color: "var(--success)", margin: 0 }}>{stats.totalAdmins}</h3>
            <p style={{ color: "var(--gray)", margin: 0 }}>Admins</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", color: "var(--primary)", margin: 0 }}>{stats.totalRegularUsers}</h3>
            <p style={{ color: "var(--gray)", margin: 0 }}>Regular Users</p>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {users.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "var(--gray)" }}>No users found</h2>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Role</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Liked Books</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Cart Items</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id || u.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem" }}>{u.name}</td>
                    <td style={{ padding: "1rem" }}>{u.email}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        className={`btn ${u.role === "admin" ? "btn-success" : "btn-secondary"}`}
                        style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}
                      >
                        {u.role === "admin" ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>{u.likedBooks?.length || 0}</td>
                    <td style={{ padding: "1rem" }}>
                      {u.cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--gray)", fontSize: "0.9rem" }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

