import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import API_BASE_URL from "../config";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();

  // Helper to auto-logout when token expires
  const setLogoutTimer = (expirationTime) => {
    const timeRemaining = expirationTime * 1000 - Date.now();
    setTimeout(() => {
      logout();
    }, timeRemaining);
  };

  // Check token and set up auto-logout on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedUser.accessToken}`;

      const decodedToken = jwtDecode(storedUser.accessToken);
      if (decodedToken.exp * 1000 > Date.now()) {
        setLogoutTimer(decodedToken.exp);
      } else {
        logout(); // Immediate logout if token is expired
      }
    }

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.accessToken) {
          config.headers["Authorization"] = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const handleAuthSuccess = (user, accessToken) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify({ ...user, accessToken }));
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    const decodedToken = jwtDecode(accessToken);
    setLogoutTimer(decodedToken.exp); // Set auto-logout timer on successful login
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/login`, credentials);
      const { accessToken, user } = res.data;
      handleAuthSuccess(user, accessToken);
        navigate("/Customer");
        toast.success("Login successful");      
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/addUser`, userData);
      const { accessToken, user } = res.data;
      handleAuthSuccess(user, accessToken);
      toast.success("Registration successful");
      navigate("/Leave");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again later.");
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/user/logout`);
      setCurrentUser(null);
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again later.");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
