import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import Swal from "sweetalert2";
import WorkflowModal from "./WorkFlowModal";
import EditWorkflow from "./EditWorkflow";
import { useAuth } from "../../../Context/AuthContext";

export default function WorkflowGroup() {
  const [workflowTypes, setworkflowTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [workflow, setworkflow] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false); // Separate modal state for adding
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editworkflow, seteditworkflow] = useState(null);
  const workflowPerPage = 8;
  const { token } = useAuth();

  const fetchAllworkflow = async () => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/workflow`, {
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      });

      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setworkflowTypes(response.data.data);
        setworkflow(response.data.data); // Ensure workflow state is updated for pagination
      } else {
        setworkflowTypes([]);
        setworkflow([]);
      }
    } catch (error) {
      setworkflowTypes([]);
      setworkflow([]);
    }
  };

  useEffect(() => {
    fetchAllworkflow();
  }, []);

  const handleAddworkflowType = async (newworkflow) => {
    try {
      // Optimistically update the UI with the new workflow
      setworkflowTypes((prevworkflowTypes) => [...prevworkflowTypes, newworkflow]);
      setworkflow((prevworkflow) => [...prevworkflow, newworkflow]);
  
      // After adding, refetch all transactions to ensure correct IDs
      await fetchAllworkflow();
  
      setIsAddOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error adding Workflow Group:", error);
      toast.error("Error adding Workflow Group.");
    }
  };
  
  const handleEditWorkflow = (updatedworkflow) => {
    setworkflowTypes(workflowTypes.map(workflow => 
      workflow.id === updatedworkflow.id ? updatedworkflow : workflow
    ));
    setworkflow(workflow.map(workflow => 
      workflow.id === updatedworkflow.id ? updatedworkflow : workflow
    ));
    setIsEditOpen(false); // Close modal after editing
  };

  const handleDeleteWorkflow = async (workflowId) => {
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
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/workflow/${workflowId}` , {
          headers : {
            'Authorization': `Bearer ${token}`, 
          }
        });
        
        if (response.data.status) {
          setworkflowTypes(workflowTypes.filter(transaction => transaction.id !== workflowId));
          setworkflow(workflow.filter(transaction => transaction.id !== workflowId));
          toast.success(response.data?.message || "Workflow Group deleted successfully.", { autoClose: 1500 });
        } else {
          toast.error("Failed to delete Workflow Group.", { autoClose: 1500 });
        }
      }catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while deleting Workflow Group.";
        toast.error(errorMessage, { autoClose: 1500 });
      }
    } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your Workflow Group is safe!", "info");
    }
  };

  // Pagination logic
  const indexOfLastworkflow = currentPage * workflowPerPage;
  const indexOfFirstworkflow = indexOfLastworkflow - workflowPerPage;
  const currentworkflow = workflow.slice(indexOfFirstworkflow, indexOfLastworkflow);
  const totalPages = Math.ceil(workflow.length / workflowPerPage);

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
              {currentworkflow.map((workflow, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td>
                  <Link 
                    to={`/details/${workflow.id}`} 
                    style={{ textDecoration: 'none', color: 'info' }} 
                  >
                    {workflow.name}
                  </Link>
                </td>
                  <td className="text-muted">{workflow.created_by.name}</td>
                  <td className="text-muted">{workflow.created_at}</td>
                  <td className="text-muted">{workflow.LastModifyOn}</td>
                  <td className="text-muted">
                    <div className="d-flex align-items-center ms-auto">
                      <div
                        className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                        style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        onClick={() => {
                            seteditworkflow(workflow);
                            setIsEditOpen(true);
                          }}
                      >
                        <FaRegPenToSquare />
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2"
                        style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        onClick={() => handleDeleteWorkflow(workflow.id)}
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

      {isAddOpen && <WorkflowModal isOpen={isAddOpen} setIsOpen={setIsAddOpen} onSubmit={handleAddworkflowType} />}
      {isEditOpen && <EditWorkflow isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditWorkflow} editworkflow={editworkflow} />}
    </div>
  );
}
