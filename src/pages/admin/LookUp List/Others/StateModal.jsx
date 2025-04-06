import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios"; 
import { useAuth } from "../../../../Context/AuthContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema using Yup
const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("State name is required")
    .matches(/^[^\d]*$/, "State name must not contain any digits")
});

const AddStateModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema), // Integrating yup validation
  });
  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    try {
      // Send POST request to the API
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/state`, data, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.status === 201) {
        toast.success(response?.data?.message || "State added successfully!", { autoClose: 1500 });
        onSubmit(response.data.data); // Send the returned state data to the parent
        setIsOpen(false); // Close the modal
        reset(); // Reset form fields
      } else {
        toast.error(response.data.message || "Error while adding State", { autoClose: 1500 });
      }
    } catch (error) {
      // Handle the error in case of failure
      const errorMessage = error.response?.data?.message || "An error occurred while adding State.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add State</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formStateName" className="mb-3">
            <Form.Label className="text-muted">State</Form.Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ''}  // Ensure the value is always a defined string
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
            style={{
              border: "none",
              background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)'
            }}  
            className="w-100" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddStateModal;
