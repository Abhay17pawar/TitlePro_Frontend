import { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {
  Settings,ChevronRight,User,Users,Workflow,UserCog} from "lucide-react"
import {  useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Admin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check for token (authentication)
  
    // If no token, redirect to home page ("/")
    useEffect(() => {
      if (!token) {
        toast.error("No token found, redirecting to login Page.", { autoClose: 1500 });
        navigate("/"); // Redirect to home page if user is not registered
      }
    }, [token, navigate]);

  const [expandedItems, setExpandedItems] = useState({
    administrator: true,
    systemSettings: true,
    users: true,
  })

  const toggleExpand = (section) => {
    setExpandedItems({
      ...expandedItems,
      [section]: !expandedItems[section],
    })
  }

  return (
    <div className="d-flex flex-column vh-100">
      
      {/* Main Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="d-flex flex-column border-end" style={{ width: "200px", backgroundColor: "#f8f9fa" }}>
          <div className="p-3 border-bottom">
            <h5>Admin</h5>
          </div>
          <div className="p-2 border-start border-5" style={{ borderColor: "#0d6efd !important" }}>
            <a href="#" className="text-decoration-none d-flex align-items-center text-primary">
              <Settings size={16} className="me-2" />
              <span>Overview</span>
            </a>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1 p-4">
          <h4 className="mb-4">Admin Overview</h4>

          <div className="d-flex mb-4">
            {/* Administrator Section */}
            <div className="card h-100 w-25 me-3" style={{ marginRight: "20px" }}>
              <div className="card-header bg-light d-flex align-items-center">
                <UserCog  size={18} className="me-2 text-primary" />
                <span className="fw-bold">Administrator</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    User Permissions <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Data Access <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Allowed IP Address <ChevronRight size={16} />
                  </li>
                </ul>
              </div>
            </div>

            {/* System Settings Section */}
            <div className="card h-100 w-25" style={{ marginRight: "20px" }}>
              <div className="card-header bg-light d-flex align-items-center">
                <Settings size={18} className="me-2 text-primary" />
                <span className="fw-bold">System Settings</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => navigate("/lookuplist-others")} // Navigate on click
                    style={{ cursor: "pointer" }} // Change cursor to pointer
                  >
                    Lookup List <ChevronRight size={16} />
                  </li> 
                </ul>
              </div>
            </div>

            {/* Users Section */}
            <div className="card h-100 w-25">
              <div className="card-header bg-light d-flex align-items-center">
                <Users size={18} className="me-2 text-primary" />
                <span className="fw-bold">Company</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                  Company <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Order Number <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                  Invoice Number <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                  Customer Fee Schedule <ChevronRight size={16} />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="d-flex mb-4">
            {/* Administrator Section */}
            <div className="card h-100 w-25 me-3" style={{ marginRight: "20px" }}>
              <div className="card-header bg-light d-flex align-items-center">
                <User size={18} className="me-2 text-primary" />
                <span className="fw-bold">Users</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    User List <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    List User List <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Permission Groups <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Task Groups <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    User Non-Availability <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    User Task Reassign <ChevronRight size={16} />
                  </li>
                </ul>
              </div>
            </div>

            {/* System Settings Section */}
            <div className="card h-100 w-25" style={{ marginRight: "20px" }}>
              <div className="card-header bg-light d-flex align-items-center">
                <Workflow size={18} className="me-2 text-primary" />
                <span className="fw-bold">Workflow</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                  Workflow Groups <ChevronRight size={16} />
                  </li> 
                </ul>
              </div>
            </div>

            {/* Users Section */}
            <div className="card h-100 w-25">
              <div className="card-header bg-light d-flex align-items-center">
                <Settings size={18} className="me-2 text-primary" />
                <span className="fw-bold">Order Settings</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li style={{cursor: 'pointer'}}
                    onClick={() => navigate('/lookuplist-transaction-type')}
                   className="list-group-item d-flex justify-content-between align-items-center">
                    Transaction Types <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Order Templates <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Custom Documents <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Email Template <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    SQSearch Bot <ChevronRight size={16} />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
          <div className="card h-100 w-25 me-3" style={{ marginRight: "20px" }}>
              <div className="card-header bg-light d-flex align-items-center">
                <Settings size={18} className="me-2 text-primary" />
                <span className="fw-bold">Defaults</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Contact Fee Schedule <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                  Contact Workflow Groups <ChevronRight size={16} />
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                  Contact Guidance <ChevronRight size={16} />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin