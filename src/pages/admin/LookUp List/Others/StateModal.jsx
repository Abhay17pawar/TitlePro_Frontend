import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios"; 

const AddStateModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("No token found, please log in.");
        toast.error("No token found, please log in.", { autoClose: 1500 });
        return false;
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/states`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        toast.success("State added successfully!", { autoClose: 1500 });
        onSubmit(result.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error(result.message || "Failed to add State.");
      }
    } catch (error) {
      toast.error("An error occurred while adding State.");
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add State</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formContactType" className="mb-3">
            <Form.Label className="text-muted">State</Form.Label>
            <Controller
              name="state_name"
              control={control}
              rules={{ required: "State name is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ''}  // Ensure the value is always a defined string
                    isInvalid={!!errors.state_name}
                  />
                  {errors.state_name && (
                    <Form.Control.Feedback type="invalid">
                      {errors.state_name.message}
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

export default AddStateModal;
