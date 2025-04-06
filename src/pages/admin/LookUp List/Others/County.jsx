import React, { useEffect, useState } from 'react';
import "../Order/scroller.css";
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa';
import { Smile } from 'lucide-react';
import AddCountyModal from './CountyModal';
import axios from 'axios';
import EditCountyModal from './EditCountyModal';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAuth } from '../../../../Context/AuthContext';

const County = () => {
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [editCounty, seteditCounty] = useState(null);
   const [county, setCounty] = useState([]);  // Array to store fetched counties
   const [isOpen, setIsOpen] = useState(false);  // State to control modal open/close
   const { token } = useAuth();

   const handleCounty = async (newCounty) => {
      try {
         // Optimistically update state without calling API
         setCounty((prevCounty) => [...prevCounty, newCounty]);

         setIsOpen(false); // Close modal after submission
      } catch (error) {
         console.error("Error adding county:", error);
         toast.error(error?.message, { autoClose: 1500 });
      }
   };

   const handleEditCounty = (updatedCounty) => {
      // Update state optimistically on edit
      setCounty(county.map((c) => (c.id === updatedCounty.id ? updatedCounty : c)));
      setIsEditOpen(false);
   };

   // Fetch all counties like the `fetchAllStates` pattern
   const fetchAllCounty = async () => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_API_URL}/county`, {
            headers: {
               'Authorization': `Bearer ${token}`,
            },
         });

         console.log(response?.data);  // Log the API response to check the data

         // Check if response is successful and data is an array
         if (response.data.status === 200 && Array.isArray(response.data.data)) {
            setCounty(response.data.data); // Update state with the response data
         } else {
            setCounty([]); // If no valid data, set an empty array
         }
      } catch (error) {
         const errorMessage = error.response?.data?.message || "An error occurred while fetching counties.";
         toast.error(errorMessage, { autoClose: 1500 });
         setCounty([]); // If error occurs, set counties to an empty array
      }
   };

   useEffect(() => {
      fetchAllCounty(); // Call fetchAllCounty on component mount
   }, []);

   const handleDeleteCounty = async (countyId) => {
      const confirmDelete = await Swal.fire({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#d33",
         cancelButtonColor: "rgba(14,153,223,1)",
         confirmButtonText: "Yes, delete it!",
         cancelButtonText: "Cancel",
      });

      if (confirmDelete.isConfirmed) {
         try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/counties/${countyId}`, {
               headers: {
                  'Authorization': `Bearer ${token}`,
               },
            });

            setCounty(county.filter((c) => c.id !== countyId));
            toast.success("County deleted successfully!", { autoClose: 1500 });
         } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while deleting County.";
            toast.error(errorMessage, { autoClose: 1500 });
         }
      } else if (confirmDelete.dismiss === Swal.DismissReason.cancel) {
         Swal.fire("Cancelled", "Your county is safe!", "info");
      }
   };

   return (
      <>
         <div className="col-md-3">
            <div className="card mb-4">
               <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                  <h6 className="mb-0 text-info">County</h6>
                  <div>
                     <button
                        onClick={() => setIsOpen(true)} // Open modal on click
                        style={{
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                        }}
                        className="btn btn-sm"
                     >
                        <FaPlus color="white" size={16} />
                     </button>
                  </div>
               </div>
               <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
                  <ul className="list-group list-group-flush">
                        {county.map((county, index) => (
                           <li key={county.id || index} className="list-group-item d-flex align-items-center text-muted">
                              <div className="d-flex align-items-center">
                                 <Smile className="text-info me-2" size={16} />
                                 {county?.name}
                              </div>
                              <div className="d-flex align-items-center ms-auto">
                                 <div
                                    onClick={() => {
                                       seteditCounty(county);
                                       setIsEditOpen(true);
                                    }}
                                    className="d-flex justify-content-center align-items-center p-2 bg-primary bg-opacity-10 text-primary me-2 rounded-2"
                                    style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                                 >
                                    <FaRegPenToSquare />
                                 </div>
                                 <div
                                    onClick={() => handleDeleteCounty(county.id)}
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
            <AddCountyModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleCounty} />
            {isEditOpen && <EditCountyModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} onSubmit={handleEditCounty} editCounty={editCounty} />}
         </div>
      </>
   );
};

export default County;
