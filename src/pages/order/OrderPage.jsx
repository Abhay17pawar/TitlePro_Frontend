import { useState, useEffect } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Table } from "react-bootstrap";
import { Search, PlusCircle, Filter, Download, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrderPageModal from "./OrderPageModal";
import { useAuth } from "../../Context/AuthContext";

const OrdersTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const { token } = useAuth();
  
  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setOrders(response.data.data); // Update the state with fetched orders
      } else {
        console.error("No orders found in the response.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while fetching Order.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrder = (newOrder) => {
    // Update the state with the new contact type
    setOrders((prevOrder) => [...prevOrder, newOrder]);
    setIsOpen(false); // Close modal after submission
  };

  // Calculate indices for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Format date to match the display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return dateString.substring(0, 16).replace("T", "");
  };

  return (
    <Container fluid className="px-3 py-4">
      <h4 className="mb-4">Orders</h4>

      <Row className="mb-4 align-items-center">
        <Col md={6} lg={4} className="mb-3 mb-md-0">
          <InputGroup>
            <Form.Control
              placeholder="Order Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-info" type="button">
            <Search size={18} />
            </button>
          </InputGroup>
        </Col>
        <Col md={6} lg={8} className="d-flex justify-content-md-end gap-2">
          <Button
            className="d-flex align-items-center gap-1"
            style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  
            onClick={() => setIsOpen(true)} 
          >
            <FileText size={18} />
            <span>Create Order</span>
          </Button>
          <Button style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}>
            <PlusCircle size={18} />
          </Button>
          <Button style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}>
            <Filter size={18} />
          </Button>
          <Button style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}>
            <Download size={18} />
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Arrival Date</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal" >Delivery Date</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Order Number</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Customer</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Priority</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Transaction Type</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Data Source</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">State</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">County</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Active Workflow</th>
              <th style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  className="text-white fw-normal">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? "bg-light" : ""}>
                <td className="text-muted">{formatDate(order.created_at)}</td>
                <td className="text-muted"></td>
                <td className="text-info" style= {{cursor : 'pointer'}} onClick={() => navigate('/order-summary')}>{order.id}</td>
                <td className="text-muted">{order.customer}</td>
                <td className="text-muted"></td>
                <td className="text-muted">{order.transaction_type}</td>
                <td className="text-muted">{order.data_source}</td>
                <td className="text-muted">{order.state}</td>
                <td className="text-muted">{order.county}</td>
                <td className="text-muted">{order.workflow_group}</td>
                <td className="text-muted">{order.assigned_to}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-center mt-4">
        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                style={{ color: '#5AC0F2' }}
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className="page-item">
                <button 
                  className={`page-link ${currentPage === index + 1 ? "bg-info text-white" : "text-white"}`}
                  style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
           <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              style={{ color: '#5AC0F2' }}  
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </li>
          </ul>
        </nav>
          <OrderPageModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddOrder} />
      </div>
    </Container>
  );
};

export default OrdersTable;
