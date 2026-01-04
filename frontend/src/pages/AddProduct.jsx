import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const API_URL = "http://127.0.0.1:8000/products/";

const AddProduct = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("⚠ Login first as SELLER to add products!");
      navigate("/login");
      return;
    }

    const formData = new FormData(e.target);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token, // 🔥 REQUIRED
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("Product added successfully!");
        e.target.reset();
      } else {
        setMessageType("error");
        setMessage(
          "Failed to add product: " + (result.detail || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setMessageType("error");
      setMessage("⚠️ Server error. Please try again.");
    }
  };

  return (
    <div className="add-product-page">
      <h2>Add New Product</h2>

      <form id="productForm" onSubmit={handleSubmit}>
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          required
        ></textarea>

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          required
        />

        {/* Image */}
        <input type="file" name="image" accept="image/*" required />

        <button type="submit">Add Product</button>
      </form>

      {/* Message */}
      {message && (
        <p
          id="message"
          className={messageType === "success" ? "success" : "error"}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddProduct;
