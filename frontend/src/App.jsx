import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* -------- COMMON LAYOUT -------- */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* -------- PAGES -------- */
import Homepage from "./pages/Homepage";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import ProductsPage from "./pages/ProductsPage";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Homepage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products_page" element={<ProductsPage />} />
        <Route path="/about_us" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* USER ROUTES */}
        <Route path="/profile" element={<Profile />} />

        {/* SELLER ROUTES */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* FALLBACK */}
        <Route path="*" element={<Homepage />} />
      </Routes>

      <Footer />
    </Router>
  );
}
