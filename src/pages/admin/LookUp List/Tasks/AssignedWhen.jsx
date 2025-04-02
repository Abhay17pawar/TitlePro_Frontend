import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import AddAssignedModal from './AssignedModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import EditAssignedWhen from './EditAssigned';
import { useAuth } from '../../../../Context/AuthContext';

const AssignedWhen = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [states, setStates] = useState([]); // Correct state to manage fetched states
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();

  // Fetch all states
  const fetchAllStates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/assigned` , {
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        setStates(response.data.data);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
      toast.error("Failed to fetch assigned data.");
    }
  };

  useEffect(() => {
    fetchAllStates();
  }, []);

  // Add new state
  const handleState = (newState) => {
    setStates((prevState) => [...prevState, newState]);
    setIsOpen(false);
  };

  const handleEditState = (updatedState) => {
    setStates(states.map((state) => (state.id === updatedState.id ? updatedState : state)));
    setIsEditOpen(false);
  };

  const handleDeleteState = async (stateId) => {
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/assigned/${stateId}`, {
          headers : {
            'Authorization': `Bearer ${token}`, 
          }
        });
        
        setStates(states.filter((state) => state.id !== stateId));
        toast.success("Assigned When deleted successfully!" , {autoClose: 1500});
      } catch (error) {
        console.error("Error object:", error?.message);

        const errorMessage = error?.message;
        toast.error(errorMessage, { autoClose: 1500 });
      }
    } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your Assigned When is safe!", "info");
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
                onClick={() => setIsOpen(true)} // Open modal on click
              >
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {states.map((state, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {state.assigned_name}
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <div 
                      onClick={() => {
                        setEditState(state);
                        setIsEditOpen(true);
                      }}
                    className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2" style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                      <FaRegPenToSquare />
                    </div>
                    <div 
                    onClick={() => handleDeleteState(state.id)}
                    className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2" style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                      <RiDeleteBin6Line />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <AddAssignedModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleState} />
        {isEditOpen && <EditAssignedWhen isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditState} editState={editState} />}
      </div>
    </>
  );
};

export default AssignedWhen;
