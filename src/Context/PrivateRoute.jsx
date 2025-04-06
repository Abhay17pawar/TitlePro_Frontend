import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify"; 

const PrivateRoute = ({ element }) => {
  const { token } = useAuth(); 

  useEffect(() => {
    if (!token) {
      toast.error("No token found! redirecting to login" , {autoClose: 1500});
    }
  }, [token]); 

  if (!token) {
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
