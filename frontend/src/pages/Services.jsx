import { useEffect, useRef } from "react";
import "./Services.css";

const Services = () => {
  const cardsRef = useRef([]);
  const heroRef = useRef(null);
  const backToTopRef = useRef(null);

  /* ---------------- REVEAL ANIMATIONS ---------------- */
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index || 0);
            setTimeout(() => {
              entry.target.classList.add("revealed");
            }, index * 120);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      card.dataset.index = i;
      card.style.opacity = 0;
      card.style.transform = "translateY(24px)";
      revealObserver.observe(card);
    });

    return () => revealObserver.disconnect();
  }, []);

  /* ---------------- SECTION FADE ---------------- */
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll("section").forEach((s) => {
      sectionObserver.observe(s);
    });

    return () => sectionObserver.disconnect();
  }, []);

  /* ---------------- NAV SCROLL + BACK TO TOP ---------------- */
  useEffect(() => {
    const onScroll = () => {
      const nav = document.querySelector("nav");
      if (window.scrollY > 48) nav?.classList.add("nav-scrolled");
      else nav?.classList.remove("nav-scrolled");

      if (backToTopRef.current) {
        backToTopRef.current.classList.toggle(
          "show",
          window.scrollY > 420
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- HERO PARALLAX ---------------- */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const heading = hero.querySelector("h1");

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      heading.style.transform = `translate(${x * 0.02}px, ${y * 0.02}px)`;
    };

    const onLeave = () => (heading.style.transform = "none");

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="services-page">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <h1>
          Powerful <span>Services</span> for Local Businesses
        </h1>
        <p>
          From digital storefronts to delivery and vendor networks — LocalMart
          provides end-to-end tools to help small shops grow and thrive.
        </p>
      </section>

      {/* SERVICES */}
      <section id="services">
        {[
          {
            icon: "fa-store",
            title: "Digital Storefront Creation",
            text:
              "Transform your physical shop into a fully functional online store.",
            extra:
              "Includes: Store customization, product catalog, secure payments.",
          },
          {
            icon: "fa-truck",
            title: "Integrated Delivery Network",
            text:
              "Deliver products faster with real-time tracking and logistics.",
            extra:
              "Features: Live tracking, verified agents, cost-effective routes.",
          },
          {
            icon: "fa-handshake",
            title: "Wholesaler & Vendor Marketplace",
            text:
              "Access a curated network of wholesalers and suppliers.",
            extra:
              "Benefits: Quality sourcing, competitive rates.",
          },
          {
            icon: "fa-screwdriver-wrench",
            title: "Professional On-Demand Services",
            text:
              "Book verified professionals instantly for home or business.",
            extra:
              "Includes: Verified experts, transparent pricing.",
          },
          {
            icon: "fa-bullhorn",
            title: "Smart Promotions & Reach",
            text:
              "Promote your store with AI-powered visibility tools.",
            extra:
              "Tools: Smart ads, seasonal boosts.",
          },
          {
            icon: "fa-chart-line",
            title: "Business Insights & Analytics",
            text:
              "Track sales, inventory, and customer behavior.",
            extra:
              "Insights: Sales trends, top products.",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="service-card"
            ref={(el) => (cardsRef.current[i] = el)}
            tabIndex={0}
          >
            <i className={`fa-solid ${s.icon}`} />
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <p>
              <strong>{s.extra}</strong>
            </p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Grow Your Business with LocalMart</h2>
        <p>
          Join thousands of local shops using our platform to increase sales
          and reach new customers.
        </p>
        <button onClick={() => (window.location.href = "/register")}>
          Start Your Digital Journey
        </button>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2025 LocalMart — Empowering Local Commerce</p>
      </footer>

      {/* BACK TO TOP */}
      <button
        ref={backToTopRef}
        className="back-to-top"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      >
        ▲
      </button>
    </div>
  );
};

export default Services;
