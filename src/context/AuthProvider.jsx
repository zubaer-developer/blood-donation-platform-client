import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

// backend base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = async (registrationData) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      registrationData
    );

    // JWT token store in local storage
    if (response.data.token) {
      localStorage.setItem("blood-donation-token", response.data.token);
    }
    setUser(response.data.user);
    return response.data;
  };

  const signInUser = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    // JWT token store in local storage
    if (response.data.token) {
      localStorage.setItem("blood-donation-token", response.data.token);
    }
    setUser(response.data.user);
    return response.data;
  };

  // logout and token remove and state reset
  const signOutUser = () => {
    localStorage.removeItem("blood-donation-token");
    setUser(null);
    return Promise.resolve();
  };

  // user state persistent logic using jwt token information
  useEffect(() => {
    const token = localStorage.getItem("blood-donation-token");
    setLoading(true);

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userData = {
          email: decoded.email,
          role: decoded.role,
          status: decoded.status,
        };
        setUser(userData);
      } catch (error) {
        console.error("Token decoding failed:", error);
        localStorage.removeItem("blood-donation-token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const authInfo = {
    registerUser,
    signInUser,
    signOutUser,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}> {children} </AuthContext.Provider>
  );
};

export default AuthProvider;
