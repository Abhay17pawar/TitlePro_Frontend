import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import "../Order/scroller.css"; // Ensure this path is correct
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Smile } from 'lucide-react';
import AddDataSourceModal from './DataSourceModal';
import axios from 'axios'; // Import axios for API calls
import EditDataSourceModal from './EditDataSourceModal';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../Context/AuthContext';

const DataSource = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [datasource, setDataSource] = useState([]); // Store fetched data here
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const { token } = useAuth();

  const fetchAllDataSource = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data-source` , {
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      });
      
      if (response && response.data && response.data.status === 200) {
        setDataSource(response.data.data); 
      } else {
        setDataSource([]); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataSource([]); // Handle error by setting empty data
    }
  };

  useEffect(() => {
    fetchAllDataSource(); // Call the function when the component mounts
  }, []);

  // Handle adding a new data source
  const handleAddDataSource = (newContact) => {
    if (newContact) {
      setDataSource((prev) => [...prev, newContact]); // Add new data source to the list
    }
    setIsOpen(false); // Close modal after submitting
  };

  const handleEditDataSource = (updatedds) => {
    setDataSource(datasource.map((ds) => (ds.id === updatedds.id ? updatedds : ds))); // Corrected: Use setDataSource
    setIsEditOpen(false);
  };

  const handleDeleteProductType = async (datasourceId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgba(14,153,223,1)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${import.meta.env.VITE_API_URL}/data-source/${datasourceId}`, {
            headers : {
              'Authorization': `Bearer ${token}`, 
            }
          });
          setDataSource(datasource.filter((datasource) => datasource.id !== datasourceId));
          toast.success(response.data?.message || "Data Source deleted successfully!", { autoClose: 1500 });
        } catch (error) {
          toast.error("Failed to delete Data Source. Please try again.", { autoClose: 1500 });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your Data Source is safe!", "info");
      }
    });
  };

  return (
    <>
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">Data Source</h6>
            <div>
             <button 
                style={{
                display: 'flex',           
                alignItems: 'center',      
                justifyContent: 'center',  
                background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)'
              }}
              className="btn btn-sm"
              onClick={() => setIsOpen(true)}
            >
              <FaPlus color="white" size={16} />                           
                </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {datasource.map((item, index) => ( // Use 'datasource' here instead of 'BSource'
                <li key={item?.id || index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {item.name} {/* Use 'sourceName' from the response */}
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <div
                      onClick={() => {
                        setEditState(item);
                        setIsEditOpen(true);
                      }}
                      className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                    >
                      <FaRegPenToSquare />
                    </div>
                    <div
                        onClick={() => handleDeleteProductType(item.id)}
                      className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2"
                      style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                    >
                      <RiDeleteBin6Line />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <AddDataSourceModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddDataSource} />
        {isEditOpen && <EditDataSourceModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditDataSource} editState={editState} />}
      </div>
    </>
  );
};

export default DataSource;
