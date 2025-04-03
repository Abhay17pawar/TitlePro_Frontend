import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WorkFlowDetails.css";
import { Plus } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import WorkflowTable from "./WorkflowTable";
import AddWorkflowDetailsModal from "./WorkflowDetailsAddModal";
import WorkflowTableAddModal from "./WorkflowTableAddModal";

export default function WorkflowDetails() {
  const { id } = useParams(); // Get ID from URL
  const [workflow, setWorkflow] = useState(null);
  const [contactTypes, setContactTypes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/workflows/${id}`,{
          headers : {
            'Authorization': `Bearer ${token}`, 
          }
        });
        setWorkflow(response.data.data);
      } catch (error) {
        console.error("Error fetching workflow:", error);
      }
    };

    if (id) fetchWorkflow();
  }, [id]);

    const handleAddContactType = async (newContact) => {
      try {
        setContactTypes((prevContactTypes) => [...prevContactTypes, newContact]);
        setContacts((prevContacts) => [...prevContacts, newContact]);
    
        await fetchAllContacts();
    
        setIsAddOpen(false); // Close modal after submission
      } catch (error) {
        toast.error("Error adding Transaction Type." , { autoClose : 1500});
      }
    };
    
  return (
    <div className="workflow-container">
      <nav aria-label="breadcrumb" className="breadcrumb-nav py-2 px-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/admin">
              <IoHome size={16} className="home-icon align-top" />
            </Link>
          </li>
          <span>{">"}</span>
          <li className="breadcrumb-item">
            <Link to="/workflow-group">Workflow Groups</Link>
          </li>
          <span>{">"}</span>
          <li className="breadcrumb-item primary">Workflow Details</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center px-3">
  <h5 className="text-muted">{workflow && workflow.work_name}</h5>
  <button onClick={() => setIsAddOpen(true)} // Open Add Modal
  style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
  }}
  className="btn text-white"> <Plus size={18} className="me-1" />Add</button>
</div>
  <div className="px-3">
   <WorkflowTable/>
  </div>
  {isAddOpen && <AddWorkflowDetailsModal isOpen={isAddOpen} setIsOpen={setIsAddOpen} onSubmit={handleAddContactType} />}

    </div>
  );
}
