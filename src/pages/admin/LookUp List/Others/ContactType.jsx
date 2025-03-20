import React, { useEffect, useState } from 'react';
import { MdOutlineCircle } from "react-icons/md";
import { FaPlus } from 'react-icons/fa';
import { FaExclamation } from "react-icons/fa";
import "../Order/scroller.css";
import AddContactTypeModal from '../../Contact-Type/ContactTypeModal';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have toast for notifications
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';

const ContactType = () => {
  const [contactTypes, setContactTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state

  // Fetch all contact types from the API
  const fetchAllContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("No token found, please log in.", { autoClose: 1500 });
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
          <MdOutlineCircle className="text-primary me-2" size={16} fill="#0d6efd" />
          {type.contact_type}
        </div>
        <div className="d-flex align-items-center ms-auto" style={{cursor: 'pointer'}}> {/* Use ms-auto to push the icons to the right */}
          <FaRegPenToSquare className="me-2" />
          <RiDeleteBin6Line />
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
