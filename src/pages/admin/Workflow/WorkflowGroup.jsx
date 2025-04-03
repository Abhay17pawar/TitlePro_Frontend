import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import Swal from "sweetalert2";
import WorkflowModal from "./WorkFlowModal";
import EditWorkflow from "./EditWorkflow";
import WorkflowDetails from "./WorkflowDetails";
import { useAuth } from "../../../Context/AuthContext";

export default function WorkflowGroup() {
  const [contactTypes, setContactTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false); // Separate modal state for adding
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [states, setStates] = useState([]); // Correct state to manage fetched 
  const [editState, setEditState] = useState(null);
  const contactsPerPage = 8;
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null); // Track selected contact for details
  const { token } = useAuth();

  const fetchAllContacts = async () => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/workflows`, {
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      });

      const { data } = response;

      if (data.success && Array.isArray(data.data)) {
        setContactTypes(data.data);
        setContacts(data.data); // Ensure contacts state is updated for pagination
      } else {
        setContactTypes([]);
        setContacts([]);
      }
    } catch (error) {
      setContactTypes([]);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);

  const handleAddContactType = async (newContact) => {
    try {
      // Optimistically update the UI with the new contact
      setContactTypes((prevContactTypes) => [...prevContactTypes, newContact]);
      setContacts((prevContacts) => [...prevContacts, newContact]);
  
      // After adding, refetch all transactions to ensure correct IDs
      await fetchAllContacts();
  
      setIsAddOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error adding Workflow Group:", error);
      toast.error("Error adding Workflow Group.");
    }
  };
  
  const handleEditWorkflow = (updatedContact) => {
    setContactTypes(contactTypes.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    setContacts(contacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    setIsEditOpen(false); // Close modal after editing
  };

  const handleDeleteContact = async (transactionId) => {
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
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/workflows/${transactionId}` , {
          headers : {
            'Authorization': `Bearer ${token}`, 
          }
        });
        
        if (response.data.success) {
          setContactTypes(contactTypes.filter(transaction => transaction.id !== transactionId));
          setContacts(contacts.filter(transaction => transaction.id !== transactionId));
          toast.success("Workflow Group deleted successfully.", { autoClose: 1500 });
        } else {
          toast.error("Failed to delete Workflow Group.", { autoClose: 1500 });
        }
      }catch (error) {
        const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while deleting Workflow Group.";
        toast.error(errorMessage, { autoClose: 1500 });
      }
    } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your Workflow Group is safe!", "info");
    }
  };

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  return (
    <div className="container-fluid p-0">
      <div className="p-3">
        <h4 className="mb-4">Workflow Groups</h4>

        {/* Search and Action Buttons */}
        <div className="d-flex justify-content-end mb-3">
          <button
            style={{
              border: "none",
              background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
            }}
            className="btn btn-info me-2 text-white"
            onClick={() => setIsAddOpen(true)} // Open Add Modal
          >
            <Plus size={18} className="me-1" /> Add
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                  }}
                  className="text-white fw-normal"
                >
                  Name
                </th>
                <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                  }}
                  className="text-white fw-normal"
                >
                  Created By
                </th>
                <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                  }}
                  className="text-white fw-normal"
                >
                  Created On
                </th>
                <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                  }}
                  className="text-white fw-normal"
                >
                  Last Modified On
                </th>
                <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                  }}
                  className="text-white fw-normal"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact, index) => (
                <tr key={contact.id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td
                    onClick={() => navigate(`/details/${contact.id}`)}      
                    style={{ cursor: 'pointer' }}
                    className="text-muted"
                  >
                    {contact.work_name}
                  </td>
                  <td className="text-muted">{JSON.parse(localStorage.getItem("user"))?.name}</td>
                  <td className="text-muted">{contact.CreatedOn}</td>
                  <td className="text-muted">{contact.LastModifyOn}</td>
                  <td className="text-muted">
                    <div className="d-flex align-items-center ms-auto">
                      <div
                        className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                        style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        onClick={() => {
                            setEditState(contact);
                            setIsEditOpen(true);
                          }}
                      >
                        <FaRegPenToSquare />
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2"
                        style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <RiDeleteBin6Line />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button style={{ color: '#5AC0F2' }} className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                <ChevronLeft size={16} />
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className="page-item">
                <button
                  style={{
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                  }}
                  className={`page-link ${currentPage === index + 1 ? "bg-info text-white" : "text-white"}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button style={{ color: '#5AC0F2' }} className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight size={16} />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isAddOpen && <WorkflowModal isOpen={isAddOpen} setIsOpen={setIsAddOpen} onSubmit={handleAddContactType} />}
      {isEditOpen && <EditWorkflow isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditWorkflow} editState={editState} />}
    </div>
  );
}
