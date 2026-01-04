import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">LocalMart</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products_page/">Products</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/about_us">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {!user && (
          <li className="login-btn">
            <Link to="/login">Login</Link>
          </li>
        )}

        {user && (
          <>
            <li><Link to="/profile">Profile</Link></li>

            {user.role === "admin" && (
              <li><Link to="/admin/dashboard">Admin</Link></li>
            )}

            <li>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
