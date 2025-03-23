import React from 'react'
import { MdOutlineCircle } from "react-icons/md";
import "../Order/scroller.css";
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaExclamation, FaPlus } from 'react-icons/fa';
import { Smile } from 'lucide-react';

const Jobtitle = () => {

  const jobTitles = [
    "ATO Support",
    "Account Executive",
    "Accountant",
    "Attorney",
    "BPO Vendor"
  ];

  return (
    <>
      {/* Job Title */}
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">Job Title</h6>
            <div>
              <button style={{ background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-sm me-1">                            <FaExclamation color="white" size={16} />
              </button>
              <button style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-sm ">
                <FaPlus color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {jobTitles.map((title, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <Smile className="text-info me-2" size={16}/>
                    {title}
                  </div>
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Jobtitle
