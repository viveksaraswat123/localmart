const API_URL = "http://127.0.0.0.1:8000/products/";

document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const token = localStorage.getItem("token");

    if (!token) {
        alert("⚠ Login first as SELLER to add products!");
        window.location.href = "/login";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const sellerId = payload.sub;  // extracted seller ID

    const formData = new FormData(form);
    formData.append("seller_id", sellerId);  // auto-set seller
    // Grocery expiry logic already handled by backend

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        const result = await response.json();
        const msg = document.getElementById("message");

        if (response.ok) {
            msg.style.color = "limegreen";
            msg.textContent = "Product published successfully!";
            form.reset();
        } else {
            msg.style.color = "red";
            msg.textContent = "Failed: " + (result.detail || "Unknown error");
        }
    } catch (err) {
        console.error("Error:", err);
        const msg = document.getElementById("message");
        msg.style.color = "red";
        msg.textContent = "⚠ Server error. Retry.";
    }
});
