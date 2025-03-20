import React from 'react'
import { MdOutlineCircle } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import "../Order/scroller.css";
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';

const UserGroupType = () => {
  const UserGroupType = [
    "Abstractor",
    "Customer"
  ];
  return (
    <>
      {/* User Group Type */}
      <div className="col-md-3">
        <div className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
            <h6 className="mb-0 text-info">User Group Type</h6>
            <div>
            <button style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn btn-sm">                <FaExclamation color="white" size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0 custom-scrollbar overflow-auto" style={{ height: '200px', maxHeight: '200px' }}>
            <ul className="list-group list-group-flush">
              {UserGroupType.map((title, index) => (
                <li key={index} className="list-group-item d-flex align-items-center text-muted">
                  <div className="d-flex align-items-center">
                    <MdOutlineCircle className="text-primary me-2" size={16} fill="#0d6efd" />
                    {title}
                  </div>
                  <div className="d-flex align-items-center ms-auto" style={{ cursor: 'pointer' }}>
                    <FaRegPenToSquare className="me-2" />
                    <RiDeleteBin6Line />
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

export default UserGroupType