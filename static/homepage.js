
window.addEventListener('scroll', () => {
  document.querySelectorAll('section').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      sec.classList.add('visible');
    }
  });
});




// async function loadProducts() {
//   const container = document.getElementById("product-container");
//   const loadingText = document.getElementById("loading");

//   try {
//     const response = await fetch("/products/");

//     if (!response.ok) throw new Error("Failed to fetch products");

//     const products = await response.json();
//     loadingText.style.display = "none";

//     if (products.length === 0) {
//       container.innerHTML = `<p class="col-span-3 text-gray-400">No products found.</p>`;
//       return;
//     }

//     products.forEach(prod => {
//       const card = document.createElement("div");
//       card.className = "bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition";

//       // Format expiry date (optional)
//       const expiry = new Date(prod.expiry_date).toLocaleDateString();

//       card.innerHTML = `
//         <div class="text-left">
//           <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="${prod.name}" class="w-20 mx-auto mb-4">
//           <h3 class="text-xl font-semibold mb-2 text-yellow-400">${prod.name}</h3>
//           <p class="text-gray-300 mb-2">${prod.description || "No description available."}</p>

//           <div class="mt-3">
//             <p class="text-gray-400"><strong>Price:</strong> ₹${prod.price}</p>
//             <p class="text-gray-400"><strong>Quantity:</strong> ${prod.quantity}</p>
//             <p class="text-gray-400"><strong>Expiry:</strong> ${expiry}</p>
//           </div>

//           <div class="mt-4 border-t border-gray-700 pt-3">
//             <p class="text-sm text-gray-500">Sold by: 
//               <span class="text-yellow-400 font-semibold">${prod.seller?.shop_name || "Unknown Shop"}</span>
//             </p>
//             <p class="text-sm text-gray-500">${prod.seller?.email || ""}</p>
//           </div>
//         </div>
//       `;

//       container.appendChild(card);
//     });
//   } catch (error) {
//     console.error(error);
//     loadingText.innerText = "Error loading products. Please try again.";
//   }
// }

// document.addEventListener("DOMContentLoaded", loadProducts);


// static/homepage.js
async function loadProducts() {
    try {
        const response = await fetch("http://127.0.0.1:8000/products/");
        if (!response.ok) throw new Error("Failed to fetch products");
        const products = await response.json();
        const container = document.querySelector(".products-container");
        container.innerHTML = "";

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Price:</strong> ₹${product.price}</p>
                <p><strong>Seller:</strong> ${product.seller.shop_name}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadProducts);
