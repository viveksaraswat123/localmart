import { useEffect, useState } from "react";
import "./homepage.css";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  /* ---------------- SCROLL REVEAL ---------------- */
  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll("section").forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          sec.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/products/");
        if (!res.ok) return;

        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    loadProducts();
  }, []);

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/users/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.ok && res.json())
      .then((user) => {
        if (user?.role) setUserRole(user.role);
      })
      .catch(() => localStorage.removeItem("token"));
  }, []);

  return (
    <div className="homepage">
      {/* HERO */}
      <section className="hero">
        <h1>Empowering Local Business. Connecting Communities.</h1>
        <p>
          LocalMart brings your neighbourhood online, buy essentials, post
          pre-owned items, and hire trusted local professionals — all from one
          platform.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("products")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Explore Now
        </button>
      </section>

      {/* PRODUCTS */}
      <section id="products">
        <h2>Our Popular Categories</h2>

        <div className="products-grid">
          <div className="product-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="Groceries"
            />
            <h3>Groceries</h3>
            <p>Buy daily essentials from nearby stores with just a click.</p>
          </div>

          <div className="product-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
              alt="Services"
            />
            <h3>Professional Services</h3>
            <p>Hire trusted carpenters, electricians, or plumbers instantly.</p>
          </div>

          <div className="product-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1042/1042339.png"
              alt="Old Items"
            />
            <h3>Old Items</h3>
            <p>Post and sell pre-owned items easily in your locality.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <h2>About LocalMart</h2>
        <p>
          LocalMart is built to empower small shopkeepers and connect
          communities. We make buying, selling, and hiring local services
          simple, fast, and secure.
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <h2>Contact Us</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for contacting LocalMart!");
            e.target.reset();
          }}
        >
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="4" required />
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Homepage;
