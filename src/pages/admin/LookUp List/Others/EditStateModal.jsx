import { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";
import * as yup from "yup";  
import { yupResolver } from "@hookform/resolvers/yup";  

// Define Yup validation schema
const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("State Name is required") 
    .matches(/^[^\d]*$/, "Contact Type must not contain any digits")
});

const EditStateModal = ({ isOpen, setIsOpen, onSubmit, editState }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),  // Pass the validation schema
  });
  const { token } = useAuth();

  // Prepopulate the form when editing a state
  useEffect(() => {
    if (isOpen && editState) {
      reset({
        name: editState.name, // Populate with existing state name
      });
    }
  }, [isOpen, editState, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        name: data.name, // Only update state name
      };

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/state/${editState.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        toast.success(response.data.message || "State updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editState, ...requestData });
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update state." , { autoClose : 1500});
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while updating state.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit State</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          {/* State Name Input */}
          <Form.Group controlId="formStateName" className="mb-3">
            <Form.Label className="text-muted mb-0">State Name</Form.Label>
            <Controller
              name="name"
              control={control}
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

export default EditStateModal;
