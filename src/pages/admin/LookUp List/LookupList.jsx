import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import { Search } from "react-bootstrap-icons";
import Others from "./Others/Others";
import "bootstrap/dist/css/bootstrap.min.css";
import Order from "./Order/Order";
import PropertyTax from "./PropertyTax/PropertyTax";
import Tasks from "./Tasks/Tasks";
import DataAccess from "./Data Access/DataAccess";
import Accounting from "./Accounting/Accounting";

export default function LookupList() {
  return (
    <div className="container-fluid p-0">
      <div className="card border-0 rounded-0" style={{ width: "100%" }}>
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Lookups List</h5>
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Lookup List"
                aria-label="Search Lookup List"
              />
              <button className="btn btn-outline-info" type="button">
                <Search />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs border-bottom">
            <li className="nav-item">
              <NavLink
                className="nav-link text-secondary"
                to="/lookuplist-accounting"
                activeClassName="active text-primary"
              >
                Accounting
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link text-secondary"
                to="/lookuplist-data-access"
                activeClassName="active text-primary"
              >
                Data Access
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link text-secondary"
                to="/lookuplist-order"
                activeClassName="active text-primary"
              >
                Order
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link text-secondary"
                to="/lookuplist-propertytax"
                activeClassName="active text-primary"
              >
                Property Tax
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link text-secondary"
                to="/lookuplist-tasks"
                activeClassName="active text-primary"
              >
                Tasks
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link text-secondary"
                to="/lookuplist-worksheet"
                activeClassName="active text-primary"
              >
                Worksheet
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link text-secondary"
                to="/lookuplist-others"
                activeClassName="active text-primary"
              >
                Others
              </NavLink>
            </li>
          </ul>

          {/* Conditional Rendering of Components */}
          {location.pathname === "/lookuplist-others" && <Others />}
          {location.pathname === "/lookuplist-order" && <Order />}
          {location.pathname === "/lookuplist-propertytax" && <PropertyTax />}
          {location.pathname === "/lookuplist-tasks" && <Tasks />}
          {location.pathname === "/lookuplist-data-access" && <DataAccess />}
          {location.pathname === "/lookuplist-worksheet" && <DataAccess />}
          {location.pathname === "/lookuplist-accounting" && <Accounting />}
        </div>
      </div>
    </div>
  );
}
