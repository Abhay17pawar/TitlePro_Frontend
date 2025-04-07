import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios"; 
import { useAuth } from "../../../Context/AuthContext";

const WorkflowModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/workflow`, data , {
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      });

      if (response.data.status) {
        toast.success(response.data.message || "Workflow Group added successfully!", { autoClose: 1500 });
        onSubmit(response.data.data); 
        setIsOpen(false); // Close modal after success
        reset(); // Reset form fields
      } else {
        toast.error(response.data.message || "Failed to add Workflow Group." , {autoClose : 1500});
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while adding Workflow Group.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add Workflow Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Group controlId="formProductType" className="mb-3">
        <Form.Label className="text-muted">Workflow Group</Form.Label>
        <Controller
          name="name" 
          control={control}
          rules={{ required: "Workflow Group is required" }}
          render={({ field }) => (
            <>
              <Form.Control
                type="text"
                {...field}
                value={field.value || ''} // Ensure the value is always a defined string
                isInvalid={!!errors.name} // Update the error handling here
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

export default WorkflowModal;
