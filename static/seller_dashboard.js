// ---------------- AUTH CHECK ------------------

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const token = localStorage.getItem("token");

// Not logged in?
if (!token) window.location.href = "/login";

// Check role
const userData = parseJwt(token);
if (!userData || userData.role !== "seller") {
  alert("Access denied! Seller account required.");
  window.location.href = "/homepage";
}

// ---------------- LOAD PRODUCTS ------------------

async function loadProducts() {
  const res = await fetch("/products/mine", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const container = document.getElementById("productList");
  container.innerHTML = "";

  data.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const img = p.image_url
      ? `http://127.0.0.1:8000${p.image_url}`
      : "/static/no-image.png";

    card.innerHTML = `
      <img src="${img}" class="w-full h-40 object-cover rounded-lg mb-3" />
      <h3 class="text-xl font-semibold text-yellow-400">${p.name}</h3>
      <p class="text-gray-400 text-sm mb-2">${p.description}</p>
      <p class="font-bold text-yellow-300 mb-3">₹${p.price}</p>

      <div class="flex justify-between mt-3">
        <button onclick="editProduct(${p.id})"
          class="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600">Edit</button>

        <button onclick="deleteProduct(${p.id})"
          class="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function editProduct(id) {
  window.location.href = `/edit_products?id=${id}`;
}

// Delete product
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  await fetch(`/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadProducts();
}

// ---------------- LOAD ORDERS ------------------

async function loadOrders() {
  const res = await fetch("/orders/seller/my", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const container = document.getElementById("orderList");
  container.innerHTML = "";

  data.forEach(o => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3 class="text-xl font-bold text-yellow-400">Order #${o.id}</h3>
      <p class="text-gray-300 mt-1">Product ID: ${o.product_id}</p>
      <p class="text-gray-300">Quantity: ${o.quantity}</p>
      <p class="text-gray-300">Total: ₹${o.total_price}</p>
      <p class="text-gray-400 text-sm mt-2">Status: <b class="text-yellow-300">${o.status}</b></p>
    `;

    container.appendChild(card);
  });
}

// ---------------- LOGOUT ------------------

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

// ---------------- INIT ------------------

loadProducts();
loadOrders();
