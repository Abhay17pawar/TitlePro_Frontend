import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Link } from 'react-router-dom';
import AddContactModal from "./ContactModal"; 
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import EditContactModal from "./EditContactTypeModal";
import { useAuth } from "../../Context/AuthContext";
import Swal from "sweetalert2";

const ContactTable = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [contact, setContact] = useState([]); // New contact state
  const [isEditOpen, setIsEditOpen] = useState(false); // Separate modal state for editing
  const [editContact, setEditContact] = useState(null); // State for the contact being edited
  const contactsPerPage = 8;
  const navigate = useNavigate();
  const { token } = useAuth();
  const currentUser = JSON.parse(localStorage.getItem("user")); 

  useEffect(() => {
    if (activeTab === "Deleted") {
      navigate("/deleted-contact");
    }
  }, [activeTab, navigate]);

  // Fetch all contacts
  const fetchAllContacts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;
      if (data.success && Array.isArray(data.data)) {
        setContacts(data.data);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []); // Runs only once on mount

  // Add new contact
  const handleAddContact = (newContact) => {
    // Update the state with the new contact
    setContacts((prevContacts) => [...prevContacts, newContact]);
    setIsOpen(false); // Close modal after submission
  };

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  const handleEditTransactionType = (updatedContact) => {
    // Update the state with the edited contact
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
    setIsEditOpen(false); // Close modal after editing
  };

  const handleEditClick = (contactToEdit) => {
    setEditContact(contactToEdit); // Set the contact to edit
    setIsEditOpen(true); // Open edit modal
  };

  const handleDeleteClick = async (transactionId) => {
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
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/contacts/${transactionId}` , {
          headers : {
            Authorization: `Bearer ${token}`,
          }
        });
        
        if (response.data.success) {
          setContacts(contacts.filter(transaction => transaction.id !== transactionId));
          toast.success("Contact deleted successfully.", { autoClose: 1500 });
        } else {
          toast.error("Failed to delete Contact", { autoClose: 1500 });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred while deleting Contact!", { autoClose: 1500 });
      }
    } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your Contact is safe!", "info");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="p-3">
        <h4 className="mb-4">Contact List</h4>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Active" ? "active text-primary border-primary border-bottom-0" : "text-secondary"}`}
              onClick={() => setActiveTab("Active")}
            >
              Active
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Deleted" ? "active text-primary border-primary border-bottom-0" : "text-secondary"}`}
              onClick={() => {
                setActiveTab("Deleted"); navigate('/deleted-contact'); 
              }}
            >
              Deleted
            </button>
          </li>
        </ul>

        {/* Search and Action Buttons */}
        <div className="d-flex justify-content-end mb-3">
          <div className="input-group me-2" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Contact Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-info" type="button">
              <Search size={18} />
            </button>
          </div>
          <button style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-info me-2 text-white" onClick={() => setIsOpen(true)}>
            <Plus size={18} className="me-1" /> Add
          </button>
        </div>

        {/* Contact Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Name</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Type</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Address</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Phone Number</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Email Address</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Invoice Terms</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Created By</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact, index) => (
                <tr key={contact.id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td className="text-muted">
                    <Link 
                      to={`/contacts/${contact.id}`} 
                      style={{ textDecoration: 'none', color: 'info' }}
                    >
                      {contact.name}
                    </Link>
                  </td>
                  <td className="text-muted">
                    {contact.type 
                      ? (typeof contact.type === 'string' ? JSON.parse(contact.type).value : contact.type.value) 
                      : "Unknown"}
                  </td>
                  <td className="text-muted">{contact.address}</td>
                  <td className="text-muted">{contact.phone}</td>
                  <td className="text-muted">{contact.email}</td>
                  <td className="text-muted">{contact.invoiceTerms} {'Net 30'}</td>
                  <td className="text-muted">{currentUser.name}</td>
                  <td className="text-muted">
                    <div className="d-flex align-items-center ms-auto">
                      <div
                        className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                        style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        onClick={() => handleEditClick(contact)}
                      >
                        <FaRegPenToSquare />
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2"
                        style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        onClick={() => handleDeleteClick(contact.id)}
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
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                <ChevronLeft size={16} />
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className="page-item">
                <button
                  className={`page-link ${currentPage === index + 1 ? "bg-info text-white" : "text-info"}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight size={16} />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modals */}
      <AddContactModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContact} />
      {isEditOpen && <EditContactModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditTransactionType} editContact={editContact} />}
    </div>
  );
};

export default ContactTable;
