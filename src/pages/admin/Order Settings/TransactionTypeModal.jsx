import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";

const TransactionTypeModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [productOptions, setProductOptions] = useState([]); // Store products
  const [selectedProduct, setSelectedProduct] = useState(null); // Store selected product
  
  // Fetch product types when modal opens
  useEffect(() => {
    if (isOpen) {
      axios.get(`${import.meta.env.VITE_API_URL}/products`)
        .then(response => {
          const productsArray = response.data?.data || []; // Ensure correct array
          const products = productsArray.map(product => ({
            value: product.id,  // Store product ID
            label: product.product // Store product name
          }));

          setProductOptions(products);
          console.log("Fetched Products:", products); // ✅ Debugging log
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
      if (!selectedProduct) {
        toast.error("Please select a product type.", { autoClose: 1500 });
        return;
      }

      console.log("Selected Product:", selectedProduct); // ✅ Debugging log

      const requestData = {
        product_name: selectedProduct.label,  // ✅ Sending product name
        transaction_name: data.transaction_type, // ✅ Sending transaction type
        productId: selectedProduct.value,  // ✅ Sending product ID
      };

      console.log("Request Data:", requestData); // ✅ Log the request before sending


      const response = await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;
      if (result.success) {
        toast.success("Transaction Type added successfully!", { autoClose: 1500 });
        onSubmit(requestData);
        setIsOpen(false);
        reset();
        setSelectedProduct(null); // ✅ Reset selected product
      } else {
        toast.error("Failed to add transaction type.", { autoClose: 1500 });
      }
    } catch (error) {
      toast.error("An error occurred while adding transaction type.", { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add Transaction Types</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Product Type Select */}
          <Form.Group controlId="formProductType" className="mb-3">
            <Form.Label className="text-muted mb-0">Product Type</Form.Label>
            <Select
              options={productOptions}
              value={selectedProduct}
              onChange={(selected) => {
                console.log("Selected Option:", selected); // ✅ Debugging log
                setSelectedProduct(selected);
              }}
              placeholder="Select a product"
            />
          </Form.Group>

          {/* Transaction Type Input */}
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