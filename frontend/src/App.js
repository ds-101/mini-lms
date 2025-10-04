import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
