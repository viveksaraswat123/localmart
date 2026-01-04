import { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: "Vivek Saraswat",
    email: "vivek@example.com",
    address: "Ghaziabad, India",
  });

  const [editProfile, setEditProfile] = useState(profile);

  /* ---------------- Modal Handlers ---------------- */
  const openModal = () => {
    setEditProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveProfile = () => {
    setProfile(editProfile);
    setIsModalOpen(false);

    // Optional backend call
    // fetch('/update_profile', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(editProfile)
    // });
  };

  return (
    <div className="profile-page">
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
          <li><a href="/login" className="login-btn">Login</a></li>
        </ul>
      </nav>

      {/* ================= PROFILE ================= */}
      <div className="profile-container">
        <div className="profile-header">
          <img
            src="/static/images/default-profile.png"
            alt="Profile"
            className="profile-pic"
          />

          <div>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <p>{profile.address}</p>
            <button className="edit-btn" onClick={openModal}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="profile-stats">
          <div>
            <h3>25</h3>
            <p>Orders</p>
          </div>
          <div>
            <h3>12</h3>
            <p>Products Listed</p>
          </div>
          <div>
            <h3>4.8⭐</h3>
            <p>Seller Rating</p>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>

          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </div>

        {/* ================= TAB CONTENT ================= */}
        {activeTab === "overview" && (
          <div className="tab-content active">
            <p>
              Welcome to your LocalMart profile dashboard! Manage your account,
              view recent activity, and track your business growth 🚀.
            </p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="tab-content active">
            <p>Your recent orders will appear here.</p>
          </div>
        )}

        {activeTab === "products" && (
          <div className="tab-content active">
            <p>Your listed products will appear here.</p>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Profile</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={editProfile.name}
              onChange={(e) =>
                setEditProfile({ ...editProfile, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              value={editProfile.email}
              onChange={(e) =>
                setEditProfile({ ...editProfile, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Address"
              value={editProfile.address}
              onChange={(e) =>
                setEditProfile({ ...editProfile, address: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveProfile}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="profile-footer">
        © 2026 LocalMart | Crafted with 💛 by Team LocalMart
      </footer>
    </div>
  );
};

export default Profile;
