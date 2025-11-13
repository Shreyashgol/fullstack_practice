import { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";

export default function App() {
  const [view, setView] = useState("login"); // login | signup | users
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // If token exists, auto-switch to users view
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setView("users");
      fetchUsers();
    }
  }, []);

  // Reset form when switching views
  useEffect(() => {
    setForm({ name: "", email: "", password: "" });
    setError(null);
  }, [view]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/api/signup", form);
      localStorage.setItem("token", response.data.token);
      setView("users");
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email: form.email,
        password: form.password
      });
      localStorage.setItem("token", response.data.token);
      setView("users");
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Fetch users (protected)
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsers([]);
    setView("login");
  };


  return (
    <div className="container">
      <h1>Auth App</h1>
      {error && <p className="error">{error}</p>}

      {view === "signup" && (
        <form onSubmit={handleSignup}>
          <h2>Signup</h2>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">Signup</button>
          <p>
            Already have an account?{" "}
            <span className="link" onClick={() => setView("login")}>
              Login
            </span>
          </p>
        </form>
      )}

      {view === "login" && (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
          <p>
            Don’t have an account?{" "}
            <span className="link" onClick={() => setView("signup")}>
              Signup
            </span>
          </p>
        </form>
      )}

      {view === "users" && (
        <div>
          <h2>Users List</h2>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.name} — {u.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
