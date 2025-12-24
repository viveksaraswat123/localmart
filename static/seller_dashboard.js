function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login";
  return;
}

const userData = parseJwt(token);
if (!userData || String(userData.role).trim().toLowerCase() !== "seller") {
  alert("Access denied! Seller account required.");
  window.location.href = "/homepage";
  return;
}

async function safeJson(res){
  try{ return await res.json(); } catch{ return []; }
}

async function loadProducts() {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "<p>Loading products…</p>";

  try {
    const res = await fetch("/products/mine", {
      headers: { Authorization: "Bearer " + token }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const json = await safeJson(res);
    const products = Array.isArray(json) ? json : json.data || [];

    container.innerHTML = "";
    if (!products.length) {
      container.innerHTML = "<p>No products listed yet.</p>";
      return;
    }

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      const img = p.image_url || "/static/no-image.png";

      card.innerHTML = `
        <img src="${img}" class="w-full h-40 object-cover rounded-lg mb-3" />
        <h3 class="text-xl font-semibold">${escapeHtml(p.name)}</h3>
        <p class="text-sm mb-2">${escapeHtml(p.description)}</p>
        <p class="font-bold mb-3">₹${p.price ?? ''}</p>

        <div class="flex justify-between mt-3">
          <button onclick="editProduct('${p.id}')" class="btn btn-edit">Edit</button>
          <button onclick="deleteProduct('${p.id}')" class="btn btn-delete">Delete</button>
        </div>
      `;

      container.appendChild(card);
    });

  } catch {
    container.innerHTML = "<p>Failed to load products</p>";
  }
}

async function loadOrders() {
  const container = document.getElementById("orderList");
  if (!container) return;

  container.innerHTML = "<p>Loading orders…</p>";

  try {
    const res = await fetch("/orders/seller/my", {
      headers: { Authorization: "Bearer " + token }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const json = await safeJson(res);
    const orders = Array.isArray(json) ? json : json.data || [];

    container.innerHTML = "";
    if (!orders.length) {
      container.innerHTML = "<p>No recent orders.</p>";
      return;
    }

    orders.slice(-6).reverse().forEach(o => {
      const card = document.createElement("div");
      card.className = "card";

      const status = String(o.status || '').toLowerCase();

      card.innerHTML = `
        <h3 class="text-xl font-bold text-yellow-400">Order #${escapeHtml(o.id)}</h3>
        <p>Product ID: ${escapeHtml(o.product_id)}</p>
        <p>Quantity: ${escapeHtml(o.quantity)}</p>
        <p>Total: ₹${escapeHtml(o.total_price)}</p>
        <p>Status: <span class="badge ${status}">${escapeHtml(o.status)}</span></p>
      `;

      container.appendChild(card);
    });

  } catch {
    container.innerHTML = "<p>Failed to load orders</p>";
  }
}

function editProduct(id) {
  window.location.href = `/edit_products?id=${id}`;
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete?")) return;
  await fetch(`/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  loadProducts();
}

function escapeHtml(s){
  if(s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

// Init after DOM ready
document.addEventListener("DOMContentLoaded", ()=>{
  loadProducts();
  loadOrders();
});
