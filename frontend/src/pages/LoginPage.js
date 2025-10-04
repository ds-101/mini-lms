import React, { useState } from "react";
import { loginUser } from "../services/api";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.token); // JWT Save
      setMessage("Login Successful ✅");
    } catch (error) {
      setMessage("Error: " + error.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginPage;
