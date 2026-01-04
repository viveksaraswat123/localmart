import { useEffect } from "react";
import "./About.css";

const About = () => {
  /* ---------------- Fade-in on Scroll ---------------- */
  useEffect(() => {
    const sections = document.querySelectorAll(".about-page section");

    const reveal = () => {
      const triggerBottom = window.innerHeight * 0.85;
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top < triggerBottom) sec.classList.add("visible");
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <div className="about-page">
      <div className="container">
        <h1>About LocalMart</h1>

        <section>
          <h2>Our Mission</h2>
          <p>
            <span className="highlight">LocalMart</span> is built with a simple
            vision — to bridge the gap between local sellers, wholesalers, and
            buyers through a digital marketplace that empowers communities.
            We strive to make local shopping{" "}
            <strong>smart, fast, and sustainable</strong> by enabling small
            businesses to grow with technology.
          </p>
        </section>

        <section>
          <h2>How LocalMart Works</h2>
          <p>
            LocalMart connects{" "}
            <span className="highlight">
              sellers, vendors, professionals, and customers
            </span>{" "}
            on one easy-to-use platform:
          </p>
          <ul>
            <li>
              Sellers and vendors register stores and list products with images,
              prices, and expiry dates.
            </li>
            <li>
              Customers explore items, place orders, and receive home delivery
              from nearby stores.
            </li>
            <li>
              The system manages inventory, billing, and expiry tracking
              automatically.
            </li>
            <li>
              Professionals (plumbers, electricians, carpenters) can list
              services and accept nearby bookings.
            </li>
          </ul>
        </section>

        <section>
          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>Multi-User Login:</strong> Dedicated roles for sellers,
              customers, and vendors.
            </li>
            <li>
              <strong>Smart Recommendations:</strong> Trending and seasonal item
              suggestions.
            </li>
            <li>
              <strong>Product Expiry Alerts:</strong> Notifications before
              products expire.
            </li>
            <li>
              <strong>Integrated Billing:</strong> Automatic debit, credit, and
              stock handling.
            </li>
            <li>
              <strong>Vendor Connections:</strong> Easy reordering from trusted
              wholesalers.
            </li>
            <li>
              <strong>Service Providers Hub:</strong> Local professionals listed
              nearby.
            </li>
            <li>
              <strong>Delivery Management:</strong> Timely doorstep delivery.
            </li>
            <li>
              <strong>Interactive Dashboard:</strong> Clean UI for all user
              roles.
            </li>
            <li>
              <strong>Local Economy Focus:</strong> Promotes small local
              businesses.
            </li>
          </ul>
        </section>

        <section>
          <h2>Our Vision</h2>
          <p>
            We believe the future of commerce lies in empowering{" "}
            <span className="highlight">local communities</span>. LocalMart
            preserves the charm of local markets while providing the power of
            digital transformation.
          </p>
        </section>

        <div className="back-wrapper">
          <a href="/" className="back-btn">
            ← Back to Home
          </a>
        </div>

        
      </div>
    </div>
  );
};

export default About;
