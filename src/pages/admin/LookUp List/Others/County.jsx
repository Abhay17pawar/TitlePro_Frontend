import React, { useEffect, useState } from 'react'
import { MdOutlineCircle } from "react-icons/md";
import "../Order/scroller.css";
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaExclamation, FaPlus } from 'react-icons/fa';
import { Smile } from 'lucide-react';
import AddCountyModal from './CountyModal';
import axios from 'axios';
import EditCountyModal from './EditCountyModal';
import { toast } from 'react-toastify';

const County = () => {
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [editState, setEditState] = useState(null);
   const [county, setCounty] = useState([]);  // Array to store fetched states
   const [isOpen, setIsOpen] = useState(false);  // State to control modal open/close

   const handleCounty = async (newCounty) => {
    try {
      // Optimistically update state
      setCounty((prevCounty) => [...prevCounty, newCounty]);
  
      // Fetch updated data to ensure correct IDs
      await fetchAllCounty();
  
      setIsOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error adding county:", error);
      toast.error("Error adding county. Please try again.");
    }
  };
  

      const handleEditState = (updatedCounty) => {
        setCounty(county.map((county) => (county.id === updatedCounty.id ? updatedCounty : county))); // Fixing here (was using states instead of county)
        setIsEditOpen(false);
      };
  
   // Fetch all contacts
    const fetchAllCounty = async () => {
      try {
       const response = await axios.get(`${import.meta.env.VITE_API_URL}/counties`);
  
        const { data } = response;
  
        if (data.success && Array.isArray(data.data)) {
          setCounty(data.data); // Set fetched data to state
        } else {
          setCounty([]); // If response format is unexpected, set state to empty array
        }
      } catch (error) {
        console.error("Error fetching States:", error);
        setCounty([]); // Handle error by setting state to empty array
      }
    };
  
    useEffect(() => {
      fetchAllCounty(); // Call fetchAllCounty on component mount
    }, []);

     // Delete state with Toast
  const handleDeleteState = async (countyId) => {
    try {

      await axios.delete(`${import.meta.env.VITE_API_URL}/counties/${countyId}`);

      setCounty(county.filter((county) => county.id !== countyId));
      toast.success("County deleted successfully!");
    } catch (error) {
      console.error("Error deleting county:", error);
      toast.error("Failed to delete county. Please try again.");
    }
  };


  return (
    <>
      {/* Job Title */}
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">County</h6>
            <div>
              <button style={{ background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-sm me-1">                            <FaExclamation color="white" size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(true)} // Open modal on click
                style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-sm ">
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
                <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
                  <ul className="list-group list-group-flush">
                  {county.map((county, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16} />
                    {county?.county_name}
              </div>
              <div className="d-flex align-items-center ms-auto">
                <div 
                  onClick={() => {
                    setEditState(county); 
                    setIsEditOpen(true);
                  }}
                className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2" 
                  style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                  <FaRegPenToSquare />
                </div>
                <div
                onClick={() => handleDeleteState(county.id)}
                className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-10 text-danger rounded-2" 
                  style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}>
                  <RiDeleteBin6Line />
            </div>
          </div>
        </li>
      ))}

            </ul>
          </div>
        </div>
        <AddCountyModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleCounty} />
        {isEditOpen && <EditCountyModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditState} editState={editState} />}
      </div>
    </>
  )
}

export default County
