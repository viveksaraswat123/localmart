import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later you can connect backend here
    // const formData = new FormData(e.target);

    alert("Registration submitted (connect backend next)");
  };

  return (
    <div className="register-page">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo">
          <a href="/">LocalMart</a>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/products_page/">Products</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/about_us">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
          <li>
            <a href="/login" className="login-btn">
              Login
            </a>
          </li>
        </ul>
      </nav>

      {/* ================= REGISTER CARD ================= */}
      <div className="overlay">
        <div className="card">
          <button className="close-btn" onClick={goHome}>
            ✕
          </button>

          <h1>Create Account</h1>
          <p>Join LocalMart and start your journey</p>

          <form id="registerForm" onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />

            <select required defaultValue="">
              <option value="" disabled>
                Select Role
              </option>
              <option>Customer</option>
              <option>Seller</option>
              <option>Admin</option>
            </select>

            <button type="submit" className="primary-btn">
              Register
            </button>
          </form>

          <p className="switch">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
