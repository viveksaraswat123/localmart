import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- LOGIN HANDLER ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        setLoading(false);
        return;
      }

      // Save JWT
      localStorage.setItem("token", data.access_token);

      // Decode role from JWT
      const payload = JSON.parse(
        atob(data.access_token.split(".")[1])
      );
      const role = payload?.role;

      alert("Login successful!");

      // Redirect by role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav>
        <div className="text-2xl text-yellow-400">
          <a href="/">LocalMart</a>
        </div>

        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/products_page/">Products</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/about_us">About Us</a></li>
          <li><a href="/contact">Contact</a></li>

          <li id="login-btn">
            <a href="/login">Login</a>
          </li>
        </ul>
      </nav>

      {/* LOGIN FORM */}
      <div className="container">
        <div className="form-box">
          <h1>Welcome Back</h1>
          <p>Login to your LocalMart account</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="switch">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
