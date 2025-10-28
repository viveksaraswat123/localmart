document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const searchBar = document.getElementById("searchBar");
  let allProducts = []; // store all fetched products

  // Load products from API
  async function loadProducts() {
    try {
      const res = await fetch("http://127.0.0.1:8000/products/");
      allProducts = await res.json();
      displayProducts(allProducts);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  }

  // Display products dynamically
  function displayProducts(products) {
    grid.innerHTML = "";

    if (!products.length) {
      grid.innerHTML = `<p class="text-gray-400 text-center w-full">No products found.</p>`;
      return;
    }

    products.forEach((p) => {
      const card = document.createElement("div");
      card.className =
        "bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col justify-between transition transform hover:scale-105 hover:shadow-yellow-400/20";

      const imageUrl = p.image_url
        ? `http://127.0.0.1:8000${p.image_url}`
        : "/static/no-image.png";

      card.innerHTML = `
        <div>
          <img src="${imageUrl}" alt="${p.name}"
            class="w-full h-48 object-cover rounded-xl mb-3" />
          <h2 class="text-lg font-semibold text-yellow-400">${p.name}</h2>
          <p class="text-gray-400 text-sm mb-2 min-h-[40px]">${p.description}</p>
        </div>
        <div class="mt-auto">
          <p class="text-yellow-300 font-bold mb-3">₹${p.price}</p>
          <button class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition">
            Buy Now
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Filter products by search input
  searchBar.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
    displayProducts(filtered);
  });

  // Initial load
  loadProducts();
});
