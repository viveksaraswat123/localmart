// Scroll animation
window.addEventListener('scroll', () => {
  document.querySelectorAll('section').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      sec.classList.add('visible');
    }
  });
});


// Load products from backend
async function loadProducts() {
    try {
        const response = await fetch("/products/");
        if (!response.ok) throw new Error("Failed to fetch products");

        const products = await response.json();
        const container = document.querySelector(".products-container");

        if (!container) return;
        container.innerHTML = "";

        products.forEach(product => {
            const sellerName = product.seller?.shop_name || "Unknown Seller";

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Price:</strong> ₹${product.price}</p>
                <p><strong>Seller:</strong> ${sellerName}</p>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading products:", err);
    }
}


// Load user (JWT)
async function loadUser() {
    const token = localStorage.getItem("token");

    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const profileBtn = document.getElementById("profile-btn");
    const adminBtn = document.getElementById("admin-btn");

    if (!token) return;

    const response = await fetch("/users/me", {
        headers: { "Authorization": "Bearer " + token }
    });

    if (!response.ok) {
        localStorage.removeItem("token");
        return;
    }

    const user = await response.json();

    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (profileBtn) profileBtn.style.display = "block";

    if (user.role === "admin" && adminBtn) {
        adminBtn.style.display = "block";
    }

    console.log("Logged in as:", user);
}


// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}


// Run both functions
window.addEventListener("DOMContentLoaded", () => {
    loadUser();
    loadProducts();
});
