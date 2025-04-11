import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { RxCross2 } from "react-icons/rx";
import { FaRegPenToSquare } from "react-icons/fa6";
import { VscDebugPause, VscDebugStart } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";

const WorkflowTable = () => {
  const [timers, setTimers] = useState({});
  const intervalsRef = useRef({});

  const tableData = [
    {
      title: "Order Processing",
      data: [
        { id: 1, name: "Order Processing", AssignedWhen: "Order Open", AssignedType: "user", SpecificTask: "", DueDays: "00:00:00" },
      ],
    },
    {
      title: "Tax Processing",
      data: [
        { id: 2, name: "Tax Processing", AssignedWhen: "Order Packed", AssignedType: "admin", SpecificTask: "", DueDays: "00:00:00" },
      ],
    },
  ];

  useEffect(() => {
    return () => {
      // Cleanup intervals when unmounting
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleStart = (id) => {
    if (intervalsRef.current[id]) return;

    intervalsRef.current[id] = setInterval(() => {
      setTimers((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }, 1000);
  };

  const handlePause = (id) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
  };

  return (
    <div className='d-flex gap-3'>
      <div className="table-responsive w-100 me-3">
        <div className="mt-2 pt-3">

          {tableData.map((table, index) => (
            <div key={index} className="mb-5">

              {/* Table Header */}
              <div className="d-flex justify-content-between align-items-center mb-0 bg-light p-2 rounded">
                <h6 className="ml-2 fw-bold">{table.title}</h6>
                <div className="d-flex gap-2">
                  <button
                    style={{
                      background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                    }}
                    className="btn text-white"
                  >
                    <Plus size={18} className="me-1" />Add
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="table table-bordered">
                <thead>
                  <tr>
                    {["Name", "Operations", "Assigned When", "Assigned Type", "Specific Task", "Due Days", "Action"].map((heading, i) => (
                      <th
                        key={i}
                        style={{
                          border: "none",
                          background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
                        }}
                        className="text-white fw-normal"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.data.map((row, rowIndex) => (
                    <tr key={row.id}>
                      <td className="text-muted">{row?.name}</td>
                      <td className="text-muted d-flex gap-2">
                        <div
                          className="d-flex justify-content-center align-items-center p-2 bg-success bg-opacity-25 text-success rounded-2"
                          style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                          onClick={() => handleStart(row.id)}
                        >
                          <VscDebugStart />
                        </div>

                        <div
                          className="d-flex justify-content-center align-items-center p-2 bg-warning bg-opacity-25 text-warning rounded-2"
                          style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                          onClick={() => handlePause(row.id)}
                        >
                          <VscDebugPause />
                        </div>

                        <div
                          className="d-flex justify-content-center align-items-center p-2 bg-danger bg-opacity-25 text-danger rounded-2"
                          style={{ cursor: 'pointer', width: '1.75rem', height: '1.75rem' }}
                        >
                          <RxCross2 />
                        </div>
                      </td>

                      <td className="text-muted">{row?.AssignedWhen}</td>
                      <td className="text-muted">{row?.AssignedType}</td>
                      <td className="text-muted">{row?.SpecificTask}</td>
                      <td className="text-muted">{formatTime(timers[row.id] || 0)}</td>
                      <td style={{ cursor: 'pointer' }}>
                        <span className='d-inline-flex gap-3'>
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
};

export default WorkflowTable;
