import React, { useState, useEffect } from 'react';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaExclamation, FaPlus } from 'react-icons/fa';
import { Smile } from 'lucide-react';
import axios from 'axios';
import AddStateModal from './StateModal';
import EditStateModal from './EditStateModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Order/scroller.css";

const State = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [states, setStates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all states
  const fetchAllStates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/states`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setStates(response.data.data);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
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

  // Edit existing state
  const handleEditState = (updatedState) => {
    setStates(states.map((state) => (state.id === updatedState.id ? updatedState : state)));
    setIsEditOpen(false);
  };

  // Delete state with Toast
  const handleDeleteState = async (stateId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error! Please log in.");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/states/${stateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStates(states.filter((state) => state.id !== stateId));
      toast.success("State deleted successfully!");
    } catch (error) {
      console.error("Error deleting state:", error);
      toast.error("Failed to delete state. Please try again.");
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
                style={{ background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}
                className="btn btn-sm me-1">
                <FaExclamation color="white" size={16} />
              </button>
              <button
                onClick={() => setIsOpen(true)}
                style={{ background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}
                className="btn btn-sm">
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {states.map((state) => (
                <li key={state.id} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {state?.state_name}
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <div
                      onClick={() => {
                        setEditState(state);
                        setIsEditOpen(true);
                      }}
                      className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                      <FaRegPenToSquare />
                    </div>
                    <div
                      onClick={() => handleDeleteState(state.id)}
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
        <AddStateModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleState} />
        {isEditOpen && <EditStateModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditState} editState={editState} />}
      </div>
    </>
  );
};

export default State;
