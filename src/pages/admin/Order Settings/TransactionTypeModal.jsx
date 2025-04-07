import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema using yup
const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Transaction Type is required")
    .matches(/^[^\d]*$/, "Transaction Type must not contain any digits")
});

const TransactionTypeModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [transactionType, setTransactionType] = useState([]); // Store product types
  const [selectedTransactionType, setSelectedTransactionType] = useState(null); // Store selected product
  const { token } = useAuth();

  // Fetch product types when modal opens
  useEffect(() => {
    if (isOpen) {
      axios.get(`${import.meta.env.VITE_API_URL}/product`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
        .then(response => {
          // Log the response for debugging
          console.log("API Response:", response);
  
          // Ensure response.data?.data is an array and not empty
          const productsArray = Array.isArray(response.data?.data) ? response.data.data : [];
  
          // Check if the array is not empty
          if (productsArray.length > 0) {
            const products = productsArray.map(product => ({
              value: product.id,  // Ensure product has an id
              label: product.name   // Ensure product has a name
            }));
  
            setTransactionType(products);
          } else {
            console.error("No products found or invalid data structure.");
            toast.error("No products found or invalid response structure.");
          }
        })
        .catch(error => {
          console.error("Error fetching products:", error);
          toast.error("Failed to fetch product types.");
        });
    }
  }, [isOpen, token]);
  

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!selectedTransactionType) {
        toast.error("Please select a product type.", { autoClose: 1500 });
        return;
      }

      const requestData = {
        name: data.name, 
        product_id: selectedTransactionType.value,  // Use the selected product ID
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/transaction-type`, requestData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.data.status) {
        toast.success(response.data.message || "Transaction Type added successfully!", { autoClose: 1500 });
        onSubmit(requestData);
        setIsOpen(false);
        reset();
        setSelectedTransactionType(null); // Clear the selected product
      } else {
        toast.error("Failed to add transaction type.", { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while adding Transaction Type.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add Transaction Types</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Product Type Selection */}
          <Form.Group controlId="formProductType" className="mb-3">
            <Form.Label className="text-muted mb-0">Product Type</Form.Label>
            <Select
              options={transactionType}
              value={selectedTransactionType}
              onChange={(selected) => setSelectedTransactionType(selected)}
              placeholder="Select a product"
            />
          </Form.Group>

          {/* Transaction Type Field */}
          <Form.Group controlId="formTransactionType" className="mb-3">
            <Form.Label className="text-muted mb-0">Transaction Type</Form.Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Transaction Type is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ""}
                    isInvalid={!!errors.name}
                  />
                  {errors.name && (
                    <Form.Control.Feedback type="invalid">
                      {errors.name.message}
                    </Form.Control.Feedback>
                  )}
                </>
              )}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            style={{ border: "none", background: "linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)" }}
            className="w-100"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionTypeModal;
