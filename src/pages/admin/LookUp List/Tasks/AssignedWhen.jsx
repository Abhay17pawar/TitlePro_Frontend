import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import AddAssignedModal from './AssignedModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import EditAssignedModal from './EditAssigned';
import { useAuth } from '../../../../Context/AuthContext';

const AssignedWhen = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditState, setCurrentEditState] = useState(null);
  const [assignedItems, setAssignedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { token } = useAuth();

  // Fetch all assigned items
  const fetchAllAssignedItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/assigned`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setAssignedItems(response.data.data);
      } else {
        setAssignedItems([]);
      }
    } catch (error) {
      console.error("Error fetching assigned items:", error);
      setAssignedItems([]);
      toast.error(error.response?.data?.message || "Failed to fetch assigned data" , {autoClose : 1500});
    }
  };

  useEffect(() => {
    fetchAllAssignedItems();
  }, []);

  // Add new assigned item
  const handleAddAssignedItem = (newItem) => {
    setAssignedItems((prevItems) => [...prevItems, newItem]);
    setIsAddModalOpen(false);
  };

  const handleEditAssignedItem = (updatedItem) => {
    setAssignedItems(assignedItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setIsEditModalOpen(false);
  };

  const handleDeleteAssignedItem = async (itemId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgba(14,153,223,1)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/assigned/${itemId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        setAssignedItems(assignedItems.filter((item) => item.id !== itemId));
        toast.success("Assigned item deleted successfully!", { autoClose: 1500 });
      } catch (error) {
        console.error("Error object:", error?.message);
        const errorMessage = error?.message;
        toast.error(errorMessage, { autoClose: 1500 });
      }
    } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your assigned item is safe!", "info");
    }
  };

  return (
    <>
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">Assigned When</h6>
            <div>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)'
                }}
                className="btn btn-sm"
                onClick={() => setIsAddModalOpen(true)} // Open modal on click
              >
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {assignedItems.map((item, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {item.name}
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <div 
                      onClick={() => {
                        setCurrentEditState(item);
                        setIsEditModalOpen(true);
                      }}
                      className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2" style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                    >
                      <FaRegPenToSquare />
                    </div>
                    <div 
                      onClick={() => handleDeleteAssignedItem(item.id)}
                      className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2" style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                    >
                      <RiDeleteBin6Line />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <AddAssignedModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} onSubmit={handleAddAssignedItem} />
        {isEditModalOpen && <EditAssignedModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} onSubmit={handleEditAssignedItem} editState={currentEditState} />}
      </div>
    </>
  );
};

export default AssignedWhen;
