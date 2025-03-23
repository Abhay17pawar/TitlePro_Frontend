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

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<OrdersTable />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/order-entry" element={<OrderEntry />} />
        <Route path="/order-task" element={<OrderTask />} />
        <Route path="/task" element={<Task />} />
        <Route path="/report" element={<Report />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/contact" element={<ContactTable />} />
        <Route path="/deleted-contact" element={<DeletedContactTable />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/lookuplist-others" element={<LookupList />} />
        <Route path="/lookuplist-order" element={<LookupList />} />
        <Route path="/lookuplist-propertytax" element={<LookupList />} />
        <Route path="/lookuplist-tasks" element={<LookupList />} />
        <Route path="/lookuplist-data-access" element={<LookupList />} />
        <Route path="/lookuplist-worksheet" element={<LookupList />} />
        <Route path="/lookuplist-accounting" element={<LookupList />} />
        <Route path="/transaction-type" element={<TransactionType />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
