import React, { useState, useEffect } from 'react';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa';
import { Smile } from 'lucide-react';
import axios from 'axios';
import AddStateModal from './StateModal';
import EditStateModal from './EditStateModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Order/scroller.css";
import Swal from 'sweetalert2';
import { useAuth } from '../../../../Context/AuthContext';

const State = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [states, setStates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();

  // Fetch all states
  const fetchAllStates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/state`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setStates(response.data.data); // Corrected: set the states array directly
      } else {
        setStates([]); // If no valid data, set an empty array
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching states.";
      toast.error(errorMessage, { autoClose: 1500 });
      setStates([]); // If error occurs, set states to an empty array
    }
  };

  useEffect(() => {
    fetchAllStates();
  }, []);

  // Handle adding a new state
  const handleState = (newState) => {
    setStates((prevState) => [...prevState, newState]); // Add the new state to the existing list
    setIsOpen(false); // Close the modal after adding
  };

  // Update existing state in the list
  const handleEditState = (updatedState) => {
    setStates(states.map((state) => (state.id === updatedState.id ? updatedState : state)));
    setIsEditOpen(false); // Close the edit modal
  };

  // Delete state from the list
  const handleDeleteState = async (stateId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgba(14,153,223,1)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/states/${stateId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setStates(states.filter((state) => state.id !== stateId)); // Remove the state from the list
        toast.success("State deleted successfully!", { autoClose: 1500 });
      } catch (error) {
        const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while deleting State.";
        toast.error(errorMessage, { autoClose: 1500 });
      }
    } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your state is safe!", "info");
    }
  };

  return (
    <>
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">State</h6>
            <div>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                }}
                className="btn btn-sm"
                onClick={() => setIsOpen(true)}
              >
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {states.map((state, index) => (
                <li key={state.id || index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {state.name}
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    {/* Edit Button */}
                    <div
                      onClick={() => {
                        setEditState(state);
                        setIsEditOpen(true);
                      }}
                      className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                    >
                      <FaRegPenToSquare />
                    </div>
                    {/* Delete Button */}
                    <div
                      onClick={() => handleDeleteState(state.id)}
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
        <AddStateModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleState} />
        {isEditOpen && <EditStateModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditState} editState={editState} />}
      </div>
    </>
  );
};

export default State;
