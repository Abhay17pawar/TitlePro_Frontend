import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import "./scroller.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import Swal from 'sweetalert2';
import AddProductTypeModal from './ProductTypeModal';
import EditProductTypeModal from './EditProductTypeModal';

const ProductType = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [contactTypes, setContactTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAllProductType = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      const { data } = response;
      console.log("data", data);
      if (data.success && Array.isArray(data.data)) {
        setContactTypes(data.data);
      } else {
        setContactTypes([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContactTypes([]);
    }
  };

  useEffect(() => {
    fetchAllProductType();
  }, []);

  const handleDeleteProductType = async (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgba(14,153,223,1)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productId}`);
          setContactTypes(contactTypes.filter((product) => product.id !== productId));
          toast.success("Product Type deleted successfully!", { autoClose: 1500 });
        } catch (error) {
          toast.error("Failed to delete Product Type. Please try again.", { autoClose: 1500 });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your product type is safe!", "info");
      }
    });
  };

  const handleAddContactType = (newContact) => {
    if (newContact) {
      setContactTypes((prev) => [...prev, newContact]);
    }
    setIsOpen(false);
  };

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
            <button
              style={{
                display: 'flex',           
                alignItems: 'center',      
                justifyContent: 'center',  
                background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)'
              }}
              className="btn btn-sm"
              onClick={() => setIsOpen(true)}
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
                    {type.product}
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
