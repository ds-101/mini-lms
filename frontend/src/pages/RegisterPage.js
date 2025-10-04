import React, { useState } from "react";
import { registerUser } from "../services/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      setMessage("Registration Successful ✅");
    } catch (error) {
      setMessage("Error: " + error.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br />
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
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RegisterPage;
