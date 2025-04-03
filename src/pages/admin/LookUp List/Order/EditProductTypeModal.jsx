import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";

const EditProductTypeModal = ({ isOpen, setIsOpen, onSubmit, editState }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();
  
  // Effect to reset form with the editState when the modal is opened or editState changes
  useEffect(() => {
    if (isOpen && editState) {
      reset({
        product_name: editState.product_name || '', // Ensure we set default to empty string if undefined
      });
    }
  }, [isOpen, editState, reset]);

  const handleFormSubmit = async (data) => {
    // Validation is handled automatically by react-hook-form
    try {
      const requestData = {
        product_name: data.product_name, // Only update product name
      };

      // Send patch request to update the product type
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${editState.id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Product Type updated successfully!", { autoClose: 1500 });
        // On successful update, trigger the onSubmit function to update the parent state
        onSubmit({ ...editState, ...requestData });
        setIsOpen(false); // Close the modal
      } else {
        toast.error(response.data.message || "Failed to update Product Type.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while updating Product Type.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit Product Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Product Name Input */}
          <Form.Group controlId="formProductName" className="mb-3">
            <Form.Label className="text-muted mb-0">Product Name</Form.Label>
            <Controller
              name="product_name"
              control={control}
              rules={{ required: "Product Name is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    isInvalid={!!errors.product_name}
                  />
                  {errors.product_name && (
                    <Form.Control.Feedback type="invalid">
                      {errors.product_name.message}
                    </Form.Control.Feedback>
                  )}
                </>
              )}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            style={{
              border: "none",
              background: "linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)",
            }}
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

export default EditProductTypeModal;
