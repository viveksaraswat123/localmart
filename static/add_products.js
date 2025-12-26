const API_URL = "http://127.0.0.1:8000/products/";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const category = form.querySelector("select[name='category']");
  const expiryWrapper = document.getElementById("expiryWrapper");
  const fileInput = document.getElementById("fileInput");
  const previewBox = document.getElementById("preview");
  const msgBox = document.getElementById("message");

  expiryWrapper.style.display = "none";

  category.addEventListener("change", () => {
    expiryWrapper.style.display = category.value.toLowerCase().includes("grocery") ? "block" : "none";
  });

  fileInput.addEventListener("change", () => {
    previewBox.innerHTML = "";
    Array.from(fileInput.files).forEach(file => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.className = "w-28 h-28 object-cover rounded-lg border border-[#444]";
      previewBox.appendChild(img);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";

    const formData = new FormData(form);

    // Append files properly (backend expects key="image")
    if (fileInput.files.length < 3) {
      alert("⚠ Minimum 3 images required!");
      return;
    }

    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append("image", fileInput.files[i]);
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        body: formData
      });

      const d = await res.json();
      msgBox.style.color = res.ok ? "limegreen" : "red";
      msgBox.innerText = res.ok ? "Item Published!" : d.detail;
      if (res.ok) form.reset();

    } catch {
      msgBox.style.color = "red";
      msgBox.innerText = "⚠ Server error. Retry.";
    }
  });
});
