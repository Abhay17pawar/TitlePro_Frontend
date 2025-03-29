import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaExclamation } from "react-icons/fa";
import "../Order/scroller.css";
import AddContactTypeModal from '../../Contact-Type/ContactTypeModal';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have toast for notifications
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';

const ContactType = () => {
  const [contactTypes, setContactTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const { token } = useAuth();

  // Fetch all contact types from the API
  const fetchAllContacts = async () => {
    try {
      
      if (!token) {
        toast.error("No token found! redirecting to login", { autoClose: 1500 });
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-types`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the Authorization header with the token
        },
      });

      const { data } = response;
      
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

  // Call the fetchAllContacts API when the component is mounted
  useEffect(() => {
    fetchAllContacts();
  }, []);

  // Handle adding a new contact type
  const handleAddContactType = (newContact) => {
    if (newContact) {
      setContactTypes((prev) => [...prev, newContact]); // Optionally update state immediately
      fetchAllContacts(); // Refetch the contact types to ensure the list is updated from the API
    }
    setIsOpen(false); // Close modal after submission
  };

  return (
    <>
      {/* Contact Type */}
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">Contact Type</h6>
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
          {type.contact_type}
        </div>
      <div className="d-flex align-items-center ms-auto">
      <div className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2" 
          style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
        <FaRegPenToSquare />
      </div>
      <div className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2" 
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
      <AddContactTypeModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContactType} />
    </>
  );
};

export default ContactType;
