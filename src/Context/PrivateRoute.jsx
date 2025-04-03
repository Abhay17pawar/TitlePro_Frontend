import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify"; // Import toast from react-toastify

const PrivateRoute = ({ element }) => {
  const { token } = useAuth(); // Get token from the AuthContext

  useEffect(() => {
    // Show a toast notification if the user is redirected
    if (!token) {
      toast.error("No token found! redirecting to login" , {autoClose: 1500});
    }
  }, [token]); // Run the effect whenever the token changes

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If there's a token, render the protected component (element)
  return element;
};

export default PrivateRoute;
