import "bootstrap/dist/css/bootstrap.min.css"
import {
  Home,
  FileText,
  Database,
  Receipt,
  FileSpreadsheet,
  CheckSquare,
  File,
  Clock,
  Mic,
  StickyNote,
  Mail,
  DollarSign,
  Settings,
} from "lucide-react"
import { XCircle } from "lucide-react"
import OrderHandle from "../OrderHandle"

export default function OrderSummary() {
    return (
      <div className="container-fluid p-0">
        <div className="row g-0">
          {/* Use flexbox for the layout of OrderHandle and main content */}
          <div className="d-flex">
            {/* OrderHandle Section */}
            <div className="flex-shrink-0">
              <OrderHandle/>
            </div>
  
            <div className="container-fluid p-0">
      {/* Navigation Breadcrumb */}
      <div className="bg-light py-3 px-3 d-flex justify-content-between align-items-center">
        <nav aria-label="breadcrumb" className="d-flex align-items-center">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <a href="#" className="text-decoration-none">
                <i className="bi bi-house-door"></i>
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="#" className="text-decoration-none">
                Orders
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Order Summary
            </li>
          </ol>
        </nav>

        <div className="d-flex gap-2">
          <div className="form-group mb-0">
            <input
              type="text"
              className="form-control"
              placeholder="Property Address"
              value="Property Address"
              readOnly
            />
          </div>
          <div className="form-group mb-0">
            <input type="text" className="form-control" placeholder="Search Property Address" />
          </div>
        </div>
      </div>

      {/* Order Number with X button */}
      <div className="bg-light border-top border-bottom py-2 px-3">
        <div className="d-inline-block">
          <span className="badge bg-white text-primary border p-2 d-flex align-items-center">
            <span className="fs-6">2024-0183075-NH</span>
            <button className="btn btn-sm text-danger border-0 p-0 ms-2">
              <XCircle size={16} />
            </button>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3">
        {/* First Row */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Property Address</div>
              <div>47 Bog Road, Apt.G1,</div>
              <div>Concord, NH, 0000</div>
              <div>Merrimack</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <div className="text-muted small">Order Status</div>
              <div className="bg-success text-white p-2 text-center rounded">Open</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <div className="text-muted small">Product Type</div>
              <div>Property Search</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Transaction Type</div>
              <div>Two Owner</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <div className="text-muted small">Property Type</div>
              <div>--</div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Order Number</div>
              <div>2024-0183075-NH</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Active WorkFlow</div>
              <div className="border p-2 rounded">Tax Processing</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Assigned To</div>
              <div>--</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Data Access</div>
              <div>Online</div>
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Open Date</div>
              <div>08/05/2024</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Due Date</div>
              <div>08/05/2024 03:51 PM</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Arrival Date</div>
              <div>08/05/2024 03:51 PM</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <div className="text-muted small">Closed Date</div>
              <div>--</div>
            </div>
          </div>
        </div>

        {/* Transaction Details Section */}
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header bg-white">
                <h6 className="text-primary mb-0">Transaction Details</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="text-muted small">Customer</div>
                    <div>New England Title & Escrow Services PC</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Address</div>
                    <div>841 Main St,Tewksbury,MA,01876</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Branch Code</div>
                    <div>NETESPC</div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="text-muted small">Lender</div>
                    <div>--</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Address</div>
                    <div>--</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Branch Code</div>
                    <div>--</div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="text-muted small">File#</div>
                    <div>2024-12311</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Loan#</div>
                    <div>--</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Sales Price</div>
                    <div>$0.00</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="text-muted small">Loan Type</div>
                    <div></div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Loan Date</div>
                    <div></div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Loan Amount</div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header bg-white">
                <h6 className="text-primary mb-0">Order Label</h6>
              </div>
              <div className="card-body">
                <div className="text-muted small">Order Label</div>
                <div></div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-white">
                <h6 className="text-primary mb-0">Partners</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="text-muted small">Abstractor</div>
                  <div>--</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Business Source</div>
                  <div className="bg-dark text-white p-1" style={{ width: "100%" }}>
                    &nbsp;
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Other Partner</div>
                  <div>--</div>
                </div>
                <div>
                  <div className="text-muted small">Other Source</div>
                  <div>--</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
          </div>
        </div>
      </div>
    );
  }
  