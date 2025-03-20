import React from 'react';
import Form from 'react-bootstrap/Form';
import OrderHandle from '../OrderHandle';
import { ImCross } from "react-icons/im";
import { FaPlus, FaCheck, FaSlidersH  } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdPostAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const OrderTask = () => {
  const tableData = [
    {
      title: "Order Processing",
      data: [
        { name: "John Doe", type: "Processing", address: "123 Main St", phone: "123-456-7890", email: "john@example.com", terms: "Net 30", createdBy: "Admin", createdOn: "08/05/2024 15:52" }      ],
    },
    {
      title: "Tax Processing",
      data: [
        { name: "Mike Johnson", type: "Processing", address: "789 Oak St", phone: "555-123-4567", email: "mike@example.com", terms: "Net 45", createdBy: "User2", createdOn: "08/07/2024 12:15" },
        { name: "Emily Davis", type: "Processing", address: "321 Pine St", phone: "444-789-0123", email: "emily@example.com", terms: "Net 30", createdBy: "Admin", createdOn: "08/08/2024 14:45" },
      ],
    },
    {
      title: "Search Processing",
      data: [
        { name: "Chris Brown", type: "Completed", address: "159 Maple St", phone: "333-222-1111", email: "chris@example.com", terms: "Net 60", createdBy: "User3", createdOn: "08/09/2024 09:20" },
        { name: "Anna Wilson", type: "Completed", address: "753 Cedar St", phone: "777-888-9999", email: "anna@example.com", terms: "Net 15", createdBy: "Admin", createdOn: "08/10/2024 16:10" },
      ],
    },
    {
        title: "SQ Typing",
        data: [
          { name: "Chris Brown", type: "Completed", address: "159 Maple St", phone: "333-222-1111", email: "chris@example.com", terms: "Net 60", createdBy: "User3", createdOn: "08/09/2024 09:20" },
          { name: "Anna Wilson", type: "Completed", address: "753 Cedar St", phone: "777-888-9999", email: "anna@example.com", terms: "Net 15", createdBy: "Admin", createdOn: "08/10/2024 16:10" },
        ],
      },
      {
        title: "Invoice Processing",
        data: [
          { name: "Chris Brown", type: "Completed", address: "159 Maple St", phone: "333-222-1111", email: "chris@example.com", terms: "Net 60", createdBy: "User3", createdOn: "08/09/2024 09:20" },
          { name: "Anna Wilson", type: "Completed", address: "753 Cedar St", phone: "777-888-9999", email: "anna@example.com", terms: "Net 15", createdBy: "Admin", createdOn: "08/10/2024 16:10" },
        ],
      },
      {
        title: "Clients Portal Typing",
        data: [
          { name: "Chris Brown", type: "Completed", address: "159 Maple St", phone: "333-222-1111", email: "chris@example.com", terms: "Net 60", createdBy: "User3", createdOn: "08/09/2024 09:20" },
          { name: "Anna Wilson", type: "Completed", address: "753 Cedar St", phone: "777-888-9999", email: "anna@example.com", terms: "Net 15", createdBy: "Admin", createdOn: "08/10/2024 16:10" },
        ],
      },
      {
        title: "Changed Status To Submitted",
        data: [
          { name: "Chris Brown", type: "Completed", address: "159 Maple St", phone: "333-222-1111", email: "chris@example.com", terms: "Net 60", createdBy: "User3", createdOn: "08/09/2024 09:20" },
          { name: "Anna Wilson", type: "Completed", address: "753 Cedar St", phone: "777-888-9999", email: "anna@example.com", terms: "Net 15", createdBy: "Admin", createdOn: "08/10/2024 16:10" },
        ],
      },
      {
        title: "Document Processing",
        data: [
          { name: "Chris Brown", type: "Completed", address: "159 Maple St", phone: "333-222-1111", email: "chris@example.com", terms: "Net 60", createdBy: "User3", createdOn: "08/09/2024 09:20" },
          { name: "Anna Wilson", type: "Completed", address: "753 Cedar St", phone: "777-888-9999", email: "anna@example.com", terms: "Net 15", createdBy: "Admin", createdOn: "08/10/2024 16:10" },
        ],
      },
  ];

  return (
    <div className='d-flex gap-3'>
      <OrderHandle className="position-sticky"/>
      <div className="table-responsive w-100 me-3">
        <div className="mt-5 pt-3">

          {tableData.map((table, index) => (
            <div key={index} className="mb-5">

              {/* Add Heading & Button ONLY above the first table */}
              {index === 0 && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold">Order Task</h5>
                  <button className="btn btn-info text-white"><MdPostAdd className='mb-1'/>  Add Workflow</button>
                </div>
              )}

              {/* Table Header with Icons */}
              <div className="d-flex justify-content-between align-items-center mb-1 bg-light p-2 rounded">
                <h6 className="ml-2 fw-bold">{table.title}</h6>
                <div className="d-flex gap-2">
                  <span className="text-dark px-3 py-2 rounded" style={{ backgroundColor: "#e0e0e0" }}>
                    <ImCross />
                  </span>
                  <span className="text-dark px-3 py-2 rounded" style={{ backgroundColor: "#e0e0e0" }}>
                    <FaPlus />
                  </span>
                  <span className="text-dark px-3 py-2 rounded" style={{ backgroundColor: "#e0e0e0" }}>
                    <FaCheck />
                  </span>
                  <span className="text-dark px-3 py-2 rounded" style={{ backgroundColor: "#e0e0e0" }}>
                    <FaSlidersH />
                  </span>
                </div>
              </div>

              {/* Table */}
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="bg-info text-white fw-normal">Complete</th>
                    <th className="bg-info text-white fw-normal">Task Name</th>
                    <th className="bg-info text-white fw-normal">Assigned User</th>
                    <th className="bg-info text-white fw-normal">Assigned Type</th>
                    <th className="bg-info text-white fw-normal">Assigned Date</th>
                    <th className="bg-info text-white fw-normal">Due Date</th>
                    <th className="bg-info text-white fw-normal">Completed By</th>
                    <th className="bg-info text-white fw-normal">Completed Date</th>
                    <th className="bg-info text-white fw-normal">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {table.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                    <td className='border'><Form.Check type="checkbox" /></td> 
                     <td className="text-muted">{row.type}</td>
                      <td className="text-muted">{row.address}</td>
                      <td className="text-muted">{row.phone}</td>
                      <td className="text-muted">{row.email}</td>
                      <td className="text-muted">{row.terms}</td>
                      <td className="text-muted">{row.createdBy}</td>
                      <td className="text-muted">{row.createdOn}</td>
                      <td style={{cursor:'pointer'}}> <span className='d-inline-flex gap-3'>
                            <FaRegPenToSquare />
                            <RiDeleteBin6Line />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default OrderTask;
