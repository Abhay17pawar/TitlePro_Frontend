import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaExclamation } from "react-icons/fa";
import "../LookUp List/Order/scroller.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import AddProductTypeModal from './ProductTypeModal';
import { useAuth } from '../../../Context/AuthContext';

const ProductType = () => {
  const [contactTypes, setContactTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state

  // Fetch all contact types from the API
  const fetchAllProductType = async () => {
    try {      

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);

      const { data } = response;
      
      if (data.success && Array.isArray(data.data)) {
        setContactTypes(data.data);
      } else {
        setContactTypes([]); // Set empty array if no data
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContactTypes([]); // Handle error and clear contact types
    }
  };

  // Call the fetchAllContacts API when the component is mounted
  useEffect(() => {
    fetchAllProductType();
  }, []);

  // Handle adding a new contact type
  const handleAddContactType = (newContact) => {
    if (newContact) {
      setContactTypes((prev) => [...prev, newContact]); // Optionally update state immediately
      // fetchAllProductType(); // Optional: Uncomment this line if you prefer refetching data after adding a new contact type.
    }
    setIsOpen(false); // Close modal after submission
  };

  return (
    <>
      <div className="m-3 col-md-3">
        <h5 className='m-3'>Product Type</h5>
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">Product Type</h6>
            <div>
              <button style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-sm me-1">
                <FaExclamation color="white" size={16} />
              </button>
              <button style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-sm"
                onClick={() => setIsOpen(true)} // Open modal on click
              >
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 overflow-auto custom-scrollbar" style={{ maxHeight: '200px', height: '200px' }}>
            <ul className="list-group list-group-flush">
              {contactTypes.map((type, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {type.product_name}
                  </div>
                  <div className="d-flex align-items-center ms-auto" style={{cursor: 'pointer'}}>
                    <FaRegPenToSquare className="me-2" />
                    <RiDeleteBin6Line />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <AddProductTypeModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContactType} />
    </>
  );
};

export default ProductType;
