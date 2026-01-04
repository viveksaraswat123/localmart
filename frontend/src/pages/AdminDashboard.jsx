import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    users: "…",
    sellers: "…",
    products: "…",
    orders: "…",
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* ---------------- Logout ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---------------- Load Dashboard ---------------- */
  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const authHeader = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const [usersRes, sellersRes, productsRes, ordersRes] =
          await Promise.all([
            fetch("/users/", { headers: authHeader }),
            fetch("/sellers/", { headers: authHeader }),
            fetch("/products/", { headers: authHeader }),
            fetch("/orders/", { headers: authHeader }),
          ]);

        if (usersRes.status === 401 || sellersRes.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const parse = async (r) => {
          try {
            return await r.json();
          } catch {
            return [];
          }
        };

        const users = await parse(usersRes);
        const sellers = await parse(sellersRes);
        const products = await parse(productsRes);
        const orders = await parse(ordersRes);

        setStats({
          users: users.length,
          sellers: sellers.length,
          products: products.length,
          orders: orders.length,
        });

        setRecentOrders(orders.slice(-6).reverse());
      } catch (err) {
        setRecentOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  /* ---------------- Active Sidebar Link ---------------- */
  const isActive = (path) => {
    const cur = location.pathname.replace(/\/+$/, "");
    const link = path.replace(/\/+$/, "");
    return cur === link || cur.startsWith(link);
  };

  return (
    <div className="admin-dashboard">
      {/* ================= TOP BAR ================= */}
      <header className="topbar">
        <button id="homepageBtn" onClick={() => navigate("/")}>
          Home
        </button>
        <button id="logoutBtn" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="layout">
        {/* ================= SIDEBAR ================= */}
        <aside className="sidebar">
          <nav className="menu">
            <a className={isActive("/admin") ? "active" : ""} href="/admin">
              Dashboard
            </a>
            <a
              className={isActive("/admin/users") ? "active" : ""}
              href="/admin/users"
            >
              Users
            </a>
            <a
              className={isActive("/admin/products") ? "active" : ""}
              href="/admin/products"
            >
              Products
            </a>
            <a
              className={isActive("/admin/orders") ? "active" : ""}
              href="/admin/orders"
            >
              Orders
            </a>
          </nav>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="content">
          {/* ===== Stats Cards ===== */}
          <div className="stats-grid">
            <div className="card">
              <h3>Total Users</h3>
              <p>{stats.users}</p>
            </div>
            <div className="card">
              <h3>Total Sellers</h3>
              <p>{stats.sellers}</p>
            </div>
            <div className="card">
              <h3>Total Products</h3>
              <p>{stats.products}</p>
            </div>
            <div className="card">
              <h3>Total Orders</h3>
              <p>{stats.orders}</p>
            </div>
          </div>

          {/* ===== Recent Orders ===== */}
          <section className="orders">
            <h2>Recent Orders</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loadingOrders && (
                  <tr>
                    <td colSpan="5">Loading recent orders…</td>
                  </tr>
                )}

                {!loadingOrders && recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="5">No recent orders</td>
                  </tr>
                )}

                {!loadingOrders &&
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.user}</td>
                      <td>{order.product}</td>
                      <td>{order.quantity}</td>
                      <td>
                        <span
                          className={`badge ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
