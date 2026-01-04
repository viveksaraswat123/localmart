import { useEffect } from "react";
import "./Contact.css";

const Contact = () => {
  /* ---------------- Fade-in on Scroll ---------------- */
  useEffect(() => {
    const sections = document.querySelectorAll(".contact-page section");

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

  /* ---------------- Form Submit ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting LocalMart! We’ll get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>

        <p className="intro">
          Have questions, feedback, or partnership inquiries?
          <br />
          We'd love to hear from you. Our team at{" "}
          <span className="brand">LocalMart</span> is always ready to help.
        </p>

        {/* CONTACT FORM */}
        <section>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="5" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </section>

        {/* CONTACT INFO */}
        <section className="info">
          <h2>Get in Touch</h2>
          <p>
            📍 <strong>Address:</strong> LocalMart HQ, Ghaziabad, India
            <br />
            📞 <strong>Phone:</strong> +91 98765 43210
            <br />
            📧 <strong>Email:</strong> support@localmart.in
          </p>
        </section>

        {/* BACK BUTTON */}
        <div className="back-wrapper">
          <a href="/" className="back-btn">
            ← Back to Home
          </a>
        </div>

        {/* FOOTER */}
        <footer>
          © 2025 LocalMart | Empowering Local Businesses, Digitally.
        </footer>
      </div>
    </div>
  );
};

export default Contact;
