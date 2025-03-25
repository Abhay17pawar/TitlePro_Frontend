import React, { useState, useEffect } from 'react';
import { MdOutlineCircle } from "react-icons/md";
import "../Order/scroller.css";
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaExclamation, FaPlus } from 'react-icons/fa';
import { Smile } from 'lucide-react';
import AddStateModal from './StateModal';
import axios from 'axios'; // Ensure axios is imported

const State = () => {

  const [state, setState] = useState([]);  // Array to store fetched states
  const [isOpen, setIsOpen] = useState(false);  // State to control modal open/close

  const handleState = (newState) => {
    // Update the state with the new contact type
    setState((prevState) => [...prevState, newState]);
    setIsOpen(false); // Close modal after submission
  };

  // Fetch all contacts
  const fetchAllStates = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found, please log in.");
        // Handle error, maybe using toast or alert
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/states`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the Authorization header with the token
        },
      });

      const { data } = response;

      if (data.success && Array.isArray(data.data)) {
        setState(data.data); // Set fetched data to state
      } else {
        setState([]); // If response format is unexpected, set state to empty array
      }
    } catch (error) {
      console.error("Error fetching States:", error);
      setState([]); // Handle error by setting state to empty array
    }
  };

  useEffect(() => {
    fetchAllStates(); // Call fetchAllStates on component mount
  }, []);

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
                onClick={() => setIsOpen(true)} // Open modal on click
                style={{ background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}
                className="btn btn-sm">
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {state.map((state, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {state?.state_name}
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <div
                      className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                      <FaRegPenToSquare />
                    </div>
                    <div
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
      </div>
    </>
  );
};

export default State;
