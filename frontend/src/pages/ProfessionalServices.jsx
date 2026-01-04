import { useEffect, useState, useRef } from "react";
import "./ProfessionalServices.css";

const servicesData = [
  {
    category: "electrician",
    icon: "fa-bolt",
    title: "Electrician",
    desc: "Expert in fixing wiring, fans, switches, and electrical installations.",
  },
  {
    category: "plumber",
    icon: "fa-faucet",
    title: "Plumber",
    desc: "Reliable plumbing repairs, leakage fixing, and installation services.",
  },
  {
    category: "carpenter",
    icon: "fa-hammer",
    title: "Carpenter",
    desc: "Furniture repair, custom wooden work, and fittings made easy.",
  },
  {
    category: "painter",
    icon: "fa-paint-roller",
    title: "Painter",
    desc: "Interior and exterior painting services at affordable rates.",
  },
  {
    category: "cleaning",
    icon: "fa-broom",
    title: "Home Cleaning",
    desc: "Professional home and office cleaning with top-quality hygiene.",
  },
];

const ProfessionalServices = () => {
  const [query, setQuery] = useState("");
  const sectionsRef = useRef([]);

  /* ---------------- Scroll Fade Animation ---------------- */
  useEffect(() => {
    const reveal = () => {
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        const top = section.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          section.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  /* ---------------- Filter Logic ---------------- */
  const filteredServices = servicesData.filter(
    (s) =>
      s.category.includes(query.toLowerCase()) ||
      s.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="services-page">
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
          <li id="login-btn">
            <a href="/login" className="login-btn">Login</a>
          </li>
        </ul>
      </nav>

      {/* ================= HERO ================= */}
      <section
        className="hero"
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <h1>
          Find Local <span>Professionals</span>
        </h1>
        <p>
          Hire trusted electricians, carpenters, plumbers, and more near you —
          quickly and easily.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for plumber, electrician, etc..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>Search</button>
        </div>
      </section>

      {/* ================= PROFESSIONALS ================= */}
      <section
        id="professionals"
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        {filteredServices.map((service) => (
          <div className="pro-card" key={service.category}>
            <i className={`fa-solid ${service.icon}`}></i>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            <button>Book Now</button>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <p className="no-results">No services found</p>
        )}
      </section>

      {/* ================= CTA ================= */}
      <section
        className="cta"
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <h2>Are You a Local Professional?</h2>
        <p>
          Join LocalMart and get work opportunities from customers near you!
        </p>
        <button
          onClick={() =>
            (window.location.href = "/register-professional")
          }
        >
          Register as a Service Provider
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        <p>© 2025 LocalMart | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default ProfessionalServices;
