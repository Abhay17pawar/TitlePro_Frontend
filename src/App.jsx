import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/admin/Admin";
import ContactTypeTable from "./pages/admin/Contact-Type/ContactType";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ContactTable from "./pages/contact/ContactTable";
import OrdersTable from "./pages/order/OrderPage";
import { ToastContainer } from "react-toastify";
import OrderEntry from "./pages/order/orderEntry/OrderEntry";
import Task from "./pages/Tasks/Task";
import Report from "./pages/Reports/Report";
import Accounting from "./pages/Accounting/Accounting";
import OrderSummary from "./pages/order/orderSummary/OrderSummary";
import OrderTask from "./pages/order/orderTask/OrderTask";
import DeletedContactTable from "./pages/contact/DeletedContact";
import LookupList from "./pages/admin/LookUp List/LookupList";
import TransactionType from "./pages/admin/Order Settings/TransactionType";
import ProductType from "./pages/admin/Order Settings/ProductType";
import { AuthProvider } from "./Context/AuthContext";
import WorkflowGroup from "./pages/admin/Workflow/WorkflowGroup";
import WorkflowDetails from "./pages/admin/Workflow/WorkflowDetails";
import PrivateRoute from "./Context/PrivateRoute"; // Import the PrivateRoute component

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/order" element={<PrivateRoute element={<OrdersTable />} />} />
          <Route path="/order-summary" element={<PrivateRoute element={<OrderSummary />} />} />
          <Route path="/order-entry" element={<PrivateRoute element={<OrderEntry />} />} />
          <Route path="/order-task" element={<PrivateRoute element={<OrderTask />} />} />
          <Route path="/task" element={<PrivateRoute element={<Task />} />} />
          <Route path="/report" element={<PrivateRoute element={<Report />} />} />
          <Route path="/accounting" element={<PrivateRoute element={<Accounting />} />} />
          <Route path="/contact" element={<PrivateRoute element={<ContactTable />} />} />
          <Route path="/deleted-contact" element={<PrivateRoute element={<DeletedContactTable />} />} />
          <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
          <Route path="/lookuplist-others" element={<PrivateRoute element={<LookupList />} />} />
          <Route path="/lookuplist-order" element={<PrivateRoute element={<LookupList />} />} />
          <Route path="/lookuplist-propertytax" element={<PrivateRoute element={<LookupList />} />} />
          <Route path="/lookuplist-tasks" element={<PrivateRoute element={<LookupList />} />} />
          <Route path="/lookuplist-data-access" element={<PrivateRoute element={<LookupList />} />} />
          <Route path="/lookuplist-worksheet" element={<PrivateRoute element={<LookupList />} />} />
          <Route path="/lookuplist-accounting" element={<PrivateRoute element={<LookupList />} />} />
          <Route path="/transaction-type" element={<PrivateRoute element={<TransactionType />} />} />
          <Route path="/workflow-group" element={<PrivateRoute element={<WorkflowGroup />} />} />
          <Route path="/details/:id" element={<PrivateRoute element={<WorkflowDetails />} />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
};

export default App;
