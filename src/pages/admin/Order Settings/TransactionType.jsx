import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TransactionTypeModal from "./TransactionTypeModal"; // Correct import
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegPenToSquare } from "react-icons/fa6";
import EditTransactionTypeModal from "./EditTransactionModal"; // Correct import
import { useAuth } from "../../../Context/AuthContext";
import Swal from "sweetalert2";

export default function TransactionType() {
  const [transaction, settransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionType, settransactionType] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false); // Separate modal state for adding
  const [isEditOpen, setIsEditOpen] = useState(false); // Separate modal state for editing
  const [editTransactionType, seteditTransactionType] = useState(null); // State for the transactiontype to be edited
  const transactionTypePerPage = 8;
  const { token } = useAuth();

  const fetchAlltransactionType = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transaction-type`,{
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      });

      if (response.data.status = 200 && Array.isArray(response.data.data)) {
        settransaction(response.data.data);
        settransactionType(response.data.data); // Ensure transactionType state is updated for pagination
      } else {
        settransaction([]);
        settransactionType([]);
      }
    } catch (error) {
      console.error("Error fetching transactionType:", error);
      settransaction([]);
      settransactionType([]);
    }
  };

  useEffect(() => {
    fetchAlltransactionType();
  }, []);

  const handleAddTransactionType = async (newtransactiontype) => {
    try {
      // Optimistically update the UI with the new transactiontype
      settransaction((prevtransaction) => [...prevtransaction, newtransactiontype]);
      settransactionType((prevtransactionType) => [...prevtransactionType, newtransactiontype]);
  
      // After adding, refetch all transactions to ensure correct IDs
      await fetchAlltransactionType();
  
      setIsAddOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error adding Transaction Type.");
    }
  };
  

  // Handle editing an existing transactiontype type
  const handleEditTransactionType = (updatedTransactionType) => {
    settransaction(transaction.map(transactiontype => 
      transactiontype.id === updatedTransactionType.id ? updatedTransactionType : transactiontype
    ));
    settransactionType(transactionType.map(transactiontype => 
      transactiontype.id === updatedTransactionType.id ? updatedTransactionType : transactiontype
    ));
    setIsEditOpen(false); // Close modal after editing
  };

  const handleDeleteTransactionType = async (transactionId) => {
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
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/transaction-type/${transactionId}`, {
          headers : {
            'Authorization': `Bearer ${token}`, 
          }
        });
        
        if (response.data.status) {
          settransaction(transaction.filter(transaction => transaction.id !== transactionId));
          settransactionType(transactionType.filter(transaction => transaction.id !== transactionId));
          toast.success(response.data?.message || "Transaction Type deleted successfully.", { autoClose: 1500 });
        } else {
          toast.error("Failed to delete Transaction Type.", { autoClose: 1500 });
        }
      }catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while deleting transaction Type.";
        toast.error(errorMessage, { autoClose: 1500 });
      }
    } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your transaction type is safe!", "info");
    }
  };

  // Pagination logic
  const indexOfLasttransactiontype = currentPage * transactionTypePerPage;
  const indexOfFirsttransactiontype = indexOfLasttransactiontype - transactionTypePerPage;
  const currenttransactionType = transactionType.slice(indexOfFirsttransactiontype, indexOfLasttransactiontype);
  const totalPages = Math.ceil(transactionType.length / transactionTypePerPage);

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
            {currenttransactionType.map((transactiontype, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                {/* Check if transactiontype.product exists and has a name */}
                <td className="text-muted">
                  {transactiontype.product && transactiontype.product.name ? transactiontype.product.name : "N/A"}
                </td>
                <td className="text-muted">{transactiontype.name}</td>
                <td className="text-muted">{transactiontype.created_by?.name}</td>
                <td className="text-muted">
                  <div className="d-flex align-items-center ms-auto">
                    <div
                      className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                      onClick={() => {
                        seteditTransactionType(transactiontype);
                        setIsEditOpen(true); // Open Edit Modal
                      }}
                    >
                      <FaRegPenToSquare />
                    </div>
                    <div
                      className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                      onClick={() => handleDeleteTransactionType(transactiontype.id)}
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
      {isAddOpen && <TransactionTypeModal isOpen={isAddOpen} setIsOpen={setIsAddOpen} onSubmit={handleAddTransactionType} />}
      {isEditOpen && <EditTransactionTypeModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditTransactionType} editTransactionType={editTransactionType} />}
    </div>
  );
}
