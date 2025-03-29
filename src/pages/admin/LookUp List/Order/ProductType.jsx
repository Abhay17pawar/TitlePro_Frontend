import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaExclamation } from "react-icons/fa";
import "./scroller.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import AddProductTypeModal from './ProductTypeModal';
import EditProductTypeModal from './EditProductTypeModal';

const ProductType = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
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

  // Delete state with Toast
  const handleDeleteProductType = async (productId) => {
    try { 
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productId}`);
  
      // Corrected this line to use `contactTypes` instead of `states`
      setContactTypes(contactTypes.filter((product) => product.id !== productId));
      toast.success("Product Type deleted successfully!", { autoClose: 1500 });
    } catch (error) {
      toast.error("Failed to delete Product Type. Please try again.", { autoClose: 1500 });
    }
  };

  // Handle adding a new contact type
  const handleAddContactType = (newContact) => {
    if (newContact) {
      setContactTypes((prev) => [...prev, newContact]); // Optionally update state immediately
      // fetchAllProductType(); // Optional: Uncomment this line if you prefer refetching data after adding a new contact type.
    }
    setIsOpen(false); // Close modal after submission
  };

  // Edit existing state
  const handleEditState = (updatedct) => {
    setContactTypes(contactTypes.map((ct) => (ct.id === updatedct.id ? updatedct : ct)));
    setIsEditOpen(false);
  };

  return (
    <>
      <div className="col-md-3">
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
                 <div className="d-flex align-items-center ms-auto">
                       <div
                          onClick={() => {
                            setEditState(type);
                            setIsEditOpen(true);
                          }}
                       className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2" 
                           style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                         <FaRegPenToSquare />
                       </div>
                       <div 
                        onClick={() => handleDeleteProductType(type.id)}
                        className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2" 
                         style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                         <RiDeleteBin6Line />
                       </div>
                     </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <AddProductTypeModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContactType} />
      {isEditOpen && <EditProductTypeModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditState} editState={editState} />}
    </>
  );
};

export default ProductType;
