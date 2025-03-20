import React from 'react'
import { useNavigate } from 'react-router-dom'

const OrderHandle = () => {
    const navigate = useNavigate();

  return (
    <div className='d-flex'>
          
          <div className="border-end bg-light" style={{ width: "200px", minHeight: "100vh" }}>
          <div className="p-3 border-bottom">
            <h5 className="m-0">Dashboard</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-grid me-2"></i>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/order-summary')}>Order Summary</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-file-text me-2"></i>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/order-entry')}>Order Entry</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-database me-2"></i>
              <span>Data Access</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-house me-2"></i>
              <span>Property Tax</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-file-earmark me-2"></i>
              <span>Worksheet</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-check-square me-2"></i>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/order-task')}>Tasks</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-file-earmark-text me-2"></i>
              <span>Documents</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-clock-history me-2"></i>
              <span>File History</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-record-circle me-2"></i>
              <span>Recording</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-sticky me-2"></i>
              <span>Notes</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-envelope me-2"></i>
              <span>Email</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-calculator me-2"></i>
              <span>Accounting</span>
            </li>
            <li className="list-group-item border-0 d-flex align-items-center">
              <i className="bi bi-gear me-2"></i>
              <span>Custom Fields</span>
            </li>
          </ul>
        </div>

      
    </div>
  )
}

export default OrderHandle
