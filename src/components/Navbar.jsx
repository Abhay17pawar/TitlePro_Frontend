import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaClipboardList, FaTasks, FaChartBar, FaCalculator, FaAddressBook, FaUserShield, FaBell, FaCommentDots, FaUserCircle } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear user session (if using localStorage or context)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login page
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg py-2" style={{ backgroundColor: "#022a4d" }}>
      <div className="container-fluid">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold text-light" to="/">Title Pro</NavLink>

        {/* Navbar Toggle (for Mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            {[
              { path: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
              { path: "/order", icon: <FaClipboardList />, label: "Orders" },
              { path: "/task", icon: <FaTasks />, label: "Tasks" },
              { path: "/report", icon: <FaChartBar />, label: "Reports" },
              { path: "/accounting", icon: <FaCalculator />, label: "Accounting" },
              { path: "/contact", icon: <FaAddressBook />, label: "Contacts" },
              { path: "/admin", icon: <FaUserShield />, label: "Admin" }
            ].map(({ path, icon, label }) => (
              <li className="nav-item px-3" key={path}>
                <NavLink
                  className="nav-link d-flex align-items-center fs-6"
                  to={path}
                  style={({ isActive }) => ({
                    color: isActive ? "#007bff" : "white",
                    borderBottom: isActive ? "3px solid #007bff" : "none",
                    paddingBottom: "5px",
                    fontWeight: isActive ? "bold" : "normal"
                  })}
                >
                  {icon} <span className="ms-2">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right-Side Icons */}
        <div className="d-flex align-items-center ms-auto">
          <NavLink className="nav-link text-light position-relative me-3" to="/notifications">
            <FaBell className="fs-5" />
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">99+</span>
          </NavLink>
          <NavLink className="nav-link text-light me-3" to="/messages">
            <FaCommentDots className="fs-5" />
          </NavLink>
          
          {/* Profile Dropdown using React-Bootstrap */}
          <DropdownButton id="dropdown-basic-button" title={<FaUserCircle className="fs-3 text-light" />} variant="link">
            <Dropdown.Item as={NavLink} to="/dashboard">Dashboard</Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => handleSignOut()}>Sign out</Dropdown.Item>
            </DropdownButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
