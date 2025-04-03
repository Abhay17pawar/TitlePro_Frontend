import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios
import { useAuth } from "../../../Context/AuthContext";

const AddContactTypeModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contact-types`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        toast.success("Contact Type added successfully!", { autoClose: 1500 });
        onSubmit(result.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error(result.message || "Failed to add contact type.");
      }
    } catch (error) {
      toast.error("An error occurred while adding contact type.");
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
              name="contact_type"
              control={control}
              rules={{ required: "Contact Type is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ''}  // Ensure the value is always a defined string
                    isInvalid={!!errors.contact_type}
                  />
                  {errors.contact_type && (
                    <Form.Control.Feedback type="invalid">
                      {errors.contact_type.message}
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
