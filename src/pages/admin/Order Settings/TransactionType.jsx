import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TransactionTypeModal from "./TransactionTypeModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import EditTransactionTypeModal from "./EditTransactionModal";
import { useAuth } from "../../../Context/AuthContext";

export default function TransactionType() {
  const [contactTypes, setContactTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false); // Separate modal state for adding
  const [isEditOpen, setIsEditOpen] = useState(false); // Separate modal state for editing
  const [editContact, setEditContact] = useState(null); // State for the contact to be edited
  const contactsPerPage = 8;
  const navigate = useNavigate();

  const fetchAllContacts = async () => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`);

      const { data } = response;

      if (data.success && Array.isArray(data.data)) {
        setContactTypes(data.data);
        setContacts(data.data); // Ensure contacts state is updated for pagination
      } else {
        setContactTypes([]);
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
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
      console.error("Error adding transaction:", error);
      toast.error("Error adding Transaction Type.");
    }
  };
  

  // Handle editing an existing contact type
  const handleEditTransactionType = (updatedContact) => {
    setContactTypes(contactTypes.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    setContacts(contacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    setIsEditOpen(false); // Close modal after editing
  };

  const handleDeleteContact = async (transactionId) => {
    try {

      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/transactions/${transactionId}`);

      if (response.data.success) {
        // Remove the deleted contact from the state
        setContactTypes(contactTypes.filter(transaction => transaction.id !== transactionId));
        setContacts(contacts.filter(transaction => transaction.id !== transactionId));
        toast.success("Transaction Type deleted successfully.", { autoClose: 1500 });
      } else {
        toast.error("Failed to delete Transaction Type.", { autoClose: 1500 });
      }
    } catch (error) {
      console.error("Error deleting transaction type:", error);
      toast.error("Error deleting Transaction Type.", { autoClose: 1500 });
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
        <h4 className="mb-4">Transaction Types</h4>

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
                  Product Type
                </th>
                <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                  }}
                  className="text-white fw-normal"
                >
                  Transaction Type
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact, index) => (
                <tr key={contact.id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td className="text-muted">{contact.product_name}</td>
                  <td className="text-muted">{contact.transaction_name}</td>
                  <td className="text-muted">{JSON.parse(localStorage.getItem("user"))?.name}</td>
                  <td className="text-muted">
                    <div className="d-flex align-items-center ms-auto">
                      <div
                        className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                        style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        onClick={() => {
                          setEditContact(contact);
                          setIsEditOpen(true); // Open Edit Modal
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

      {/* Conditionally render Add or Edit modal */}
      {isAddOpen && <TransactionTypeModal isOpen={isAddOpen} setIsOpen={setIsAddOpen} onSubmit={handleAddContactType} />}
      {isEditOpen && <EditTransactionTypeModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditTransactionType} editContact={editContact} />}
    </div>
  );
}
