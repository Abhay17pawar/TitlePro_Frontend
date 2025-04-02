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

export default function WorkflowDetails() {
  const { id } = useParams(); // Get ID from URL
  const [workflow, setWorkflow] = useState(null);
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
        console.log(response?.data?.data?.work_name)
      } catch (error) {
        console.error("Error fetching workflow:", error);
      }
    };

    if (id) fetchWorkflow();
  }, [id]);

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
  <button 
  style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
  }}
  className="btn text-white"> <Plus size={18} className="me-1" />Add</button>
</div>
  <div className="px-3">
   <WorkflowTable/>
  </div>
    </div>
  );
}
