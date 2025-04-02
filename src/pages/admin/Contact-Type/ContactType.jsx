import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Plus, Trash2 } from "lucide-react";
import AddContactTypeModal from "./ContactTypeModal"; // Import the modal
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../Context/AuthContext";

const ContactTypeTable = () => {
  const [contactTypes, setContactTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const { token } = useAuth();

  // Fetch all contacts
  const fetchAllContacts = async () => {
    try {
      
      if (!token) {
        console.error("No token found, please log in.");
        toast.error("No token found, please log in.", { autoClose: 1500 });
        return false;
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

  useEffect(() => {
    fetchAllContacts();
  }, []);

  const handleAddContactType = (newContact) => {
    // Update the state with the new contact type
    setContactTypes((prevContactTypes) => [...prevContactTypes, newContact]);
    setIsOpen(false); // Close modal after submission
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Contact Type</h4>
        <div>
          <button
            className="btn me-2 btn-info border-0 text-white"
            onClick={() => setIsOpen(true)} // Open modal on click
          >
            <Plus size={18} className="me-1" /> Add
          </button>
          <button className="btn text-white" style={{ backgroundColor: "#0dcaf0", borderColor: "#0dcaf0" }}>
            <Trash2 size={18} className="me-1 mt-n2" /> Delete
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="bg-info text-white fw-normal">Name</th>
              <th className="bg-info text-white fw-normal">Slug</th>
              <th className="bg-info text-white fw-normal">User ID</th>
            </tr>
          </thead>
          <tbody>
            {contactTypes.map((type,index) => (
              <tr key={index}>
                <td className="text-muted">{type.contact_type}</td>
                <td className="text-muted">{type.slug}</td>
                <td className="text-muted">{type.user_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contact Type Modal */}
      <AddContactTypeModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddContactType} />
    </div>
  );
};

export default ContactTypeTable;