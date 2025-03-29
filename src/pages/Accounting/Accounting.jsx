import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';

const Accounting = () => {
  
     const navigate = useNavigate();
     const { token } = useAuth();
      
        // If no token, redirect to home page ("/")
        useEffect(() => {
          if (!token) {
      toast.error("No token found! redirecting to login", { autoClose: 1500 });
            navigate("/"); // Redirect to home page if user is not registered
          }
        }, [token, navigate]);

  return (
<div className='d-flex justify-content-center align-items-center fw-bold'>
   Accounting page is in progress...
</div>
  )
}

export default Accounting