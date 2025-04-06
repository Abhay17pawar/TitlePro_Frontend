import { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object({
  product_name: yup
    .string()
    .trim()
    .required("Product Type is required")
    .matches(/^[^\d]*$/, "Contact Type must not contain any digits")
});

const EditProductTypeModal = ({ isOpen, setIsOpen, onSubmit, editState }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { token } = useAuth();

  useEffect(() => {
    // Only reset when editState and editState.product_name are available
    if (isOpen && editState) {
      reset({
        product_name: editState.product_name || editState.product, // Default to empty string if undefined
      });
    }
  }, [isOpen, editState, reset]);

  const handleFormSubmit = async (data) => {
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
