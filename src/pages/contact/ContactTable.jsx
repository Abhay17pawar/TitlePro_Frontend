import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import AddContactModal from "./ContactModal"; // Import the modal
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom for navigation

export default function ContactTable() {
  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [contact, setContact] = useState([]); // New contact state
  const contactsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "Deleted") {
      navigate("/deleted-contact");
    }
  }, [activeTab, navigate]);
  
  // Fetch all contacts
  const fetchAllContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No token found, redirecting to login Page.", { autoClose: 1500 });
        navigate("/");
        return;
      }

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
          <button style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-info text-white">
            <Trash2 size={18} />
          </button>
        </div>

        {/* Contact Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="bg-info text-white fw-normal">Name</th>
                <th className="bg-info text-white fw-normal">Type</th>
                <th className="bg-info text-white fw-normal">Address</th>
                <th className="bg-info text-white fw-normal">Phone Number</th>
                <th className="bg-info text-white fw-normal">Email Address</th>
                <th className="bg-info text-white fw-normal">Invoice Terms</th>
                <th className="bg-info text-white fw-normal">Created By</th>
                <th className="bg-info text-white fw-normal">Created On</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact, index) => (
                <tr key={contact.id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td className="text-muted">{contact.name}</td>
                  <td className="text-muted">{contact.type}</td>
                  <td className="text-muted">{contact.address}</td>
                  <td className="text-muted">{contact.phone}</td>
                  <td className="text-muted">{contact.email}</td>
                  <td className="text-muted">{contact.invoiceTerms} {'Net 30'}</td>
                  <td className="text-muted">{contact.name}</td>
                  <td className="text-muted">{contact.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link text-info" onClick={() => setCurrentPage(currentPage - 1)}>
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
              <button className="page-link text-info" onClick={() => setCurrentPage(currentPage + 1)}>
                <ChevronRight size={16} />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContact} />
    </div>
  );
}
