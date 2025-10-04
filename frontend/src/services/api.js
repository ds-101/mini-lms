// src/services/api.js

import axios from "axios";

// তোমার backend base URL এখানে দাও (যেমন: http://localhost:5000 বা render/vercel URL)
const API_BASE_URL = "http://localhost:5000/api/auth";

// Register API call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Login API call
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Example: Protected API request (token সহ)
export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Profile fetch error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
