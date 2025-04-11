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
import { useAuth } from '../../../../Context/AuthContext';

const ProductType = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [productType, setproductType] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();

  const fetchAllProductType = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/product`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setproductType(response.data.data);
      } else {
        setproductType([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setproductType([]);
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
          const response = await axios.delete(`${import.meta.env.VITE_API_URL}/product/${productId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          setproductType(productType.filter((product) => product.id !== productId));
          toast.success(response.data?.message || "Product Type deleted successfully!", { autoClose: 1500 });
        } catch (error) {
          toast.error(response.data?.message || "Failed to delete Product Type. Please try again.", { autoClose: 1500 });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your product type is safe!", "info");
      }
    });
  };

  const handleAddContactType = (newContact) => {
    if (newContact) {
      setproductType((prev) => [...prev, newContact]);
    }
    setIsOpen(false);
  };

  const handleEditState = (updatedType) => {
    setproductType(prevTypes => 
      prevTypes.map(type => 
        type.id === updatedType.id ? updatedType : type
      )
    );
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
              {productType.map((type, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {type.name}
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <div
                      onClick={() => {
                        setEditState(type);
                        setIsEditOpen(true);
                      }}
                      className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                    >
                      <FaRegPenToSquare />
                    </div>
                    <div
                      onClick={() => handleDeleteProductType(type.id)}
                      className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                    >
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
