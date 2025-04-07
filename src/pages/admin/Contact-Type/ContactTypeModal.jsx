import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios"; 
import { useAuth } from "../../../Context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"

const validationSchema = yup.object({
  name : yup
                 .string()
                 .trim()
                 .required("Contact Type is required")
                 .matches(/^[^\d]*$/, "Contact Type must not contain any digits")});

const AddContactTypeModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver : yupResolver(validationSchema)
  });

  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contact-type`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.status) {
        toast.success(response.data?.message || "Contact Type added successfully!", { autoClose: 1500 });
        onSubmit(response.data?.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error(result.message || "Failed to add contact type.");
      }
    } catch (error) {
      toast.error(error.response.data?.message || "An error occurred while adding contact type.");
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add Contact Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formContactType" className="mb-3">
            <Form.Label className="text-muted">Contact Type</Form.Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Contact Type is required" }}
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
          style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  
          className="w-100" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddContactTypeModal;
