import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerDashboard.css";

/* ---------------- JWT PARSER ---------------- */
const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const userData = parseJwt(token);
    if (!userData || String(userData.role).toLowerCase() !== "seller") {
      alert("Access denied! Seller account required.");
      navigate("/homepage");
    }
  }, [navigate, token]);

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return [];
    }
  };

  /* ---------------- LOAD PRODUCTS ---------------- */
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/products/mine", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const json = await safeJson(res);
      setProducts(Array.isArray(json) ? json : json.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ---------------- LOAD ORDERS ---------------- */
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/orders/seller/my", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const json = await safeJson(res);
      setOrders(Array.isArray(json) ? json : json.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  /* ---------------- DELETE PRODUCT ---------------- */
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    await fetch(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    loadProducts();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="seller-dashboard">
      {/* ================= NAVBAR ================= */}
      <nav className="seller-navbar">
        <h1 className="seller-logo">🏪 LocalMart Seller</h1>

        <div className="seller-nav-actions">
          <button onClick={() => navigate("/")}>Home</button>

          <button
            className="btn btn-add"
            onClick={() => navigate("/add-product")}
          >
            + Add Product
          </button>

          <button className="btn btn-delete" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="seller-content">
        {/* -------- PRODUCTS -------- */}
        <section>
          <h2 className="section-title">📦 My Products</h2>

          {loadingProducts && <p>Loading products…</p>}
          {!loadingProducts && products.length === 0 && (
            <p>No products listed yet.</p>
          )}

          <div className="grid">
            {products.map((p) => (
              <div className="card" key={p.id}>
                <img
                  src={p.image_url || "/static/no-image.png"}
                  alt={p.name}
                />

                <h3>{p.name}</h3>
                <p className="desc">{p.description}</p>
                <p className="price">₹{p.price}</p>

                <div className="actions">
                  <button
                    className="btn btn-edit"
                    onClick={() =>
                      navigate(`/edit_products?id=${p.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-delete"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------- ORDERS -------- */}
        <section>
          <h2 className="section-title">🛍 My Orders</h2>

          {loadingOrders && <p>Loading orders…</p>}
          {!loadingOrders && orders.length === 0 && (
            <p>No recent orders.</p>
          )}

          <div className="grid">
            {orders
              .slice(-6)
              .reverse()
              .map((o) => (
                <div className="card" key={o.id}>
                  <h3 className="order-id">Order #{o.id}</h3>
                  <p>Product ID: {o.product_id}</p>
                  <p>Quantity: {o.quantity}</p>
                  <p>Total: ₹{o.total_price}</p>
                  <p className={`badge ${String(o.status).toLowerCase()}`}>
                    {o.status}
                  </p>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SellerDashboard;
