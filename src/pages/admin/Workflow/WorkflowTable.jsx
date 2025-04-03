import { Plus } from 'lucide-react';
import React from 'react';
import Form from 'react-bootstrap/Form';
import { FaRegPenToSquare } from "react-icons/fa6";
import { MdPostAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const WorkflowTable = () => {
    
  const tableData = [
    {
      title: "Order Processing",
      data: [
        { name: "Order Processing", AssignedWhen : "Order Open", AssignedType : "user" , SpecificTask : "" , DueDays : "00:00:00"  }      ],
    },
  ];

  return (
    <div className='d-flex gap-3'>
      <div className="table-responsive w-100 me-3">
        <div className="mt-2 pt-3">

          {tableData.map((table, index) => (
            <div key={index} className="mb-5">

              {/* Table Header with Icons */}
              <div className="d-flex justify-content-between align-items-center mb-0 bg-light p-2 rounded">
                <h6 className="ml-2 fw-bold">{table.title}</h6>
                <div className="d-flex gap-2">
                <button onClick={() => setIsAddOpen(true)} // Open Add Modal
                style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                }}
                className="btn text-white"> <Plus size={18} className="me-1" />Add</button>
                </div>
              </div>

              {/* Table */}
              <table className="table table-bordered">
                <thead>
                  <tr>
                  <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',}}
                    className="text-white fw-normal">Name</th>
                     <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',}}
                    className="text-white fw-normal">Assigned When</th>
                     <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',}}
                    className="text-white fw-normal">Assigned Type</th>
                     <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',}}
                    className="text-white fw-normal">Specific Task</th>
                     <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',}}
                    className="text-white fw-normal">Due Days</th>
                     <th
                  style={{
                    border: "none",
                    background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',}}
                    className="text-white fw-normal">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {table.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                     <td className="text-muted">{row?.name}</td>
                      <td className="text-muted">{row?.AssignedWhen}</td>
                      <td className="text-muted">{row?.AssignedType}</td>
                      <td className="text-muted">{row?.SpecificTask}</td>
                      <td className="text-muted">{row?.DueDays}</td>
                      <td style={{cursor:'pointer'}}> <span className='d-inline-flex gap-3'>
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

export default WorkflowTable;
