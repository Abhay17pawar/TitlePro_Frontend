import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import "../Order/scroller.css";
import AddContactTypeModal from '../../Contact-Type/ContactTypeModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';
import EditContactType from './EditContactTypeModal';
import Swal from 'sweetalert2';

const ContactType = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const [contactTypes, setContactTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const { token } = useAuth(); // Get the token from useAuth

  // Fetch all contact types from the API
  const fetchAllContacts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-type`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        },
      });

      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setContactTypes(response.data.data); 
      } else {
        setContactTypes([]); // If no valid data, set an empty array
      }
    }catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching Contact Type.";
      toast.error(errorMessage, { autoClose: 1500 });
      setContactTypes([]);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, [token]); 

  // Handle adding a new contact type
  const handleAddContactType = (newContact) => {
    if (newContact) {
      setContactTypes((prev) => [...prev, newContact]); // Optionally update state immediately
      fetchAllContacts(); // Refetch the contact types to ensure the list is updated from the API
    }
    setIsOpen(false); // Close modal after submission
  };

  const handleEditState = (updatedct) => {
    setContactTypes(contactTypes.map((ct) => (ct.id === updatedct.id ? updatedct : ct)));
    setIsEditOpen(false); // Close the edit modal
  };

   const handleDeleteContactType = async (productId) => {
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
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/contact-type/${productId}`,{
              headers : {
                'Authorization': `Bearer ${token}` 
              }
            });
            setContactTypes(contactTypes.filter((contact) => contact.id !== productId));
            toast.success(response.data?.message || "Contact Type deleted successfully!", { autoClose: 1500 });
          } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while deleting Contact Type.";
            toast.error(errorMessage, { autoClose: 1500 });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your Contact type is safe!", "info");
        }
      });
    };

  return (
    <>
      {/* Contact Type */}
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">Contact Type</h6>
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
                <li key={type.id || index} className="list-group-item d-flex align-items-center text-muted">
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
                    onClick={() => handleDeleteContactType(type.id)}
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
      <AddContactTypeModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContactType} />
      {isEditOpen && <EditContactType isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditState} editState={editState} token={token} />} {/* Pass token to EditContactType */}
    </>
  );
};

export default ContactType;