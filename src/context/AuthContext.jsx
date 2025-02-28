import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true; // Ensure cookies are included in requests

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/currentUser`);
        setCurrentUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user data (without token)
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("user"); // Remove user from localStorage on error
      }
    };

    fetchUser();

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        return config; // Axios automatically sends the token from cookies
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/addUser`, userData);
      setCurrentUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user data
      toast.success("Registration successful");
      navigate("/Leave");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again later.");
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/login`, credentials);
      setCurrentUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user data
      navigate("/Customer");
      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.error || "An unexpected error occurred");
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/user/logout`);
      setCurrentUser(null);
      localStorage.removeItem("user"); // Remove user data on logout
      navigate("/");
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again later.");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
