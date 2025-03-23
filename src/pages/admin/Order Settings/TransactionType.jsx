import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom for navigation
import TransactionTypeModal from "./TransactionTypeModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";

export default function TransactionType() {
  const [contactTypes, setContactTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [contact, setContact] = useState([]); // New contact state
  const contactsPerPage = 8;
  const navigate = useNavigate();

  // Fetch all contacts
    const fetchAllContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error("No token found, please log in.");
          toast.error("No token found, please log in.", { autoClose: 1500 });
          return false;
        }
  
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
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
    
  const TranactionType = [
    {
      id: 1,
      product_type: "John Doe",
      transaction_type: "Supplier",
      created_by: "johndoe@example.com",
      created_at: "2023-01-01",
      action: "Net 30",
    }
  ];

  useEffect(() => {
    fetchAllContacts();
  }, []);

  const handleAddContactType = (newContact) => {
    // Update the state with the new contact type
    setContactTypes((prevContactTypes) => [...prevContactTypes, newContact]);
    setIsOpen(false); // Close modal after submission
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
          <div className="input-group me-2" style={{ maxWidth: "300px" }}>
          </div>
          <button style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} 
          className="btn btn-info me-2 text-white" 
          onClick={() => setIsOpen(true)}>
            <Plus size={18} className="me-1" /> Add
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Product Type</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Transction Type</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Created By</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Created At</th>
                <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {TranactionType.map((contact, index) => (
                <tr key={contact.id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td className="text-muted">{contact.product_type}</td>                 
                  <td className="text-muted">{contact.transaction_type}</td>
                  <td className="text-muted">{contact.created_by}</td>
                  <td className="text-muted">{contact.created_at}</td>
                  <td className="text-muted">
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
              <button               style={{ color: '#5AC0F2' }}  
                className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                <ChevronLeft size={16} />
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className="page-item">
                <button
                  style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  
                  className={`page-link ${currentPage === index + 1 ? "bg-info text-white" : "text-info"}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button               style={{ color: '#5AC0F2' }}  
                className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight size={16} />
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <TransactionTypeModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContactType} />
    </div>
  );
}
