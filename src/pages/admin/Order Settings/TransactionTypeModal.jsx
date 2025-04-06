import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"

const validationSchema = yup.object({
  transaction_type : yup
                 .string()
                 .trim()
                 .required("Transaction Type is required")
                 .matches(/^[^\d]*$/, "Transaction Type must not contain any digits")
});

const TransactionTypeModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver : yupResolver(validationSchema)
  });

  const [transactionType, settransactionType] = useState([]); // Store products
  const [selectedTransactionType, setselectedTransactionType] = useState(null); // Store selected product
  const { token } = useAuth();

  // Fetch product types when modal opens
  useEffect(() => {
    if (isOpen) {
      axios.get(`${import.meta.env.VITE_API_URL}/products`, {
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      })
        .then(response => {
          const productsArray = response.data?.data || []; // Ensure correct array
          const products = productsArray.map(product => ({
            value: product.id,  // Store product ID
            label: product.product // Store product name
          }));

          settransactionType(products);
        })
        .catch(error => {
          console.error("Error fetching products:", error);
          toast.error("Failed to fetch product types.");
        });
    }
  }, [isOpen]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!selectedTransactionType) {
        toast.error("Please select a product type.", { autoClose: 1500 });
        return;
      }

      const requestData = {
        product_name: selectedTransactionType.label,  
        transaction_name: data.transaction_type, 
        productId: selectedTransactionType.value,  
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, requestData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });

      const result = response.data;
      if (result.success) {
        toast.success("Transaction Type added successfully!", { autoClose: 1500 });
        onSubmit(requestData);
        setIsOpen(false);
        reset();
        setselectedTransactionType(null); 
      } else {
        toast.error("Failed to add transaction type.", { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while adding Transaction Type.";
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
          <Form.Group controlId="formProductType" className="mb-3">
            <Form.Label className="text-muted mb-0">Product Type</Form.Label>
            <Select
              options={transactionType}
              value={selectedTransactionType}
              onChange={(selected) => setselectedTransactionType(selected)}
              placeholder="Select a product"
            />
          </Form.Group>

          <Form.Group controlId="formTransactionType" className="mb-3">
            <Form.Label className="text-muted mb-0">Transaction Type</Form.Label>
            <Controller
              name="transaction_type"
              control={control}
              rules={{ required: "Transaction Type is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ""}
                    isInvalid={!!errors.transaction_type}
                  />
                  {errors.transaction_type && (
                    <Form.Control.Feedback type="invalid">
                      {errors.transaction_type.message}
                    </Form.Control.Feedback>
                  )}
                </>
              )}
            />
          </Form.Group>

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
