import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Task = () => {
  
     const navigate = useNavigate();
     const token = localStorage.getItem('token'); // Check for token (authentication)
      
        // If no token, redirect to home page ("/")
        useEffect(() => {
          if (!token) {
            toast.error("No token found, redirecting to login Page.", { autoClose: 1500 });
            navigate("/"); // Redirect to home page if user is not registered
          }
        }, [token, navigate]);

  return (
<div className='d-flex justify-content-center align-items-center fw-bold'>
  Task page is in progress...
</div>
  )
}

export default Task