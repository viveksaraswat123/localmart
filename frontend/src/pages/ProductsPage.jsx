import { useEffect, useMemo, useState } from "react";
import "./ProductsPage.css"; // if you have page-specific css

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);

  /* ---------------- Get Role From JWT ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      const role = (decoded.role || "").toLowerCase();
      setUserRole(role);
    } catch (e) {
      console.error("JWT read error:", e);
    }
  }, []);

  /* ---------------- Load Products ---------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/products/");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

    loadProducts();
  }, []);

  /* ---------------- Filtered Products ---------------- */
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }, [searchTerm, allProducts]);

  return (
    <div className="products-page px-6 py-10">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <input
          id="searchBar"
          type="text"
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Seller-only Add Product */}
        {userRole === "seller" && (
          <a
            href="/add-product"
            className="ml-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg transition"
          >
            Add Product
          </a>
        )}
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div
        id="productGrid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProducts.length === 0 && (
          <p className="text-gray-400 text-center col-span-full">
            No products found.
          </p>
        )}

        {filteredProducts.map((p) => {
          const imageUrl = p.image_url
            ? `http://127.0.0.1:8000${p.image_url}`
            : "/static/no-image.png";

          return (
            <div
              key={p.id}
              className="bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col justify-between transition transform hover:scale-105 hover:shadow-yellow-400/20"
            >
              <div>
                <img
                  src={imageUrl}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />

                <h2 className="text-lg font-semibold text-yellow-400">
                  {p.name}
                </h2>

                <p className="text-gray-400 text-sm mb-2 min-h-[40px]">
                  {p.description}
                </p>
              </div>

              <div className="mt-auto">
                <p className="text-yellow-300 font-bold mb-3">
                  ₹{p.price}
                </p>

                <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition">
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
