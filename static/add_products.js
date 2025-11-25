const API_URL = "http://127.0.0.1:8000/products/";

document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const token = localStorage.getItem("token");

    if (!token) {
        alert("⚠ Login first as SELLER to add products!");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token       // 🔥 REQUIRED
            },
            body: formData
        });

        const result = await response.json();
        const msg = document.getElementById("message");

        if (response.ok) {
            msg.style.color = "limegreen";
            msg.textContent = "Product added successfully!";
            form.reset();
        } else {
            msg.style.color = "red";
            msg.textContent = "Failed to add product: " + (result.detail || "Unknown error");
        }
    } catch (err) {
        console.error("Error:", err);
        const msg = document.getElementById("message");
        msg.style.color = "red";
        msg.textContent = "⚠️ Server error. Please try again.";
    }
});
