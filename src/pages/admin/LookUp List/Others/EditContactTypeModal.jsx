import { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema using Yup
const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Contact Type is required")
    .matches(/^[^\d]*$/, "Contact Type must not contain any digits")
});

const EditContactType = ({ isOpen, setIsOpen, onSubmit, editState, token }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver : yupResolver(validationSchema)
  });
  
  useEffect(() => {
    if (isOpen && editState) {
      reset({
        name: editState.name,
      });
    }
  }, [isOpen, editState, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        name: data.name,
      };

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/contact-type/${editState.id}`, requestData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, // Pass the token here
        },
      });

      if (response.data.status) {
        toast.success(response.data?.message || "Contact Type updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editState, ...requestData });
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update Contact Type.", { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while updating Contact Type.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit Contact Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          {/* State Name Input */}
          <Form.Group controlId="formStateName" className="mb-3">
            <Form.Label className="text-muted mb-0">Contact Type</Form.Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Contact Type is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
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
            style={{
              border: "none",
              background: "linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)"
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

export default EditContactType;

