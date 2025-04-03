import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import Select from "react-select";

const AddWorkflowDetailsModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/workflow`, data, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      const result = response.data;
  
      if (result.success) {
        toast.success("Workflow Details added successfully!", { autoClose: 1500 });
        onSubmit(result.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error(result.error?.errorMessage || 'Failed to add Workflow Details.', { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while adding Workflow Details!";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };  

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add Workflow Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formContactType" className="mb-3">
            <Form.Label className="text-muted mb-0">Workflow Details</Form.Label>
            <Controller
              name="workflow_name"
              control={control}
              rules={{ required: "Assigned name is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ''}  
                    isInvalid={!!errors.workflow_name}
                  />
                  {errors.workflow_name && (
                    <Form.Control.Feedback type="invalid">
                      {errors.workflow_name.message}
                    </Form.Control.Feedback>
                  )}
                </>
              )}
            />
           <Form.Label className="text-muted mb-0">Place After</Form.Label>
          <Controller
            name="place_after"
            control={control}
            rules={{ required: "Assigned name is required" }}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  options={[
                    { value: "at_first", label: "At First" },
                    { value: "after_order_processing", label: "After Order Processing" }
                  ]}
                  value={field.value ? { value: field.value, label: field.value.replace(/_/g, " ") } : null}
                  onChange={(selectedOption) => field.onChange(selectedOption.value)}
                  isInvalid={!!errors.workflow_name}
                />
                {errors.workflow_name && (
                  <div className="text-danger mt-1">{errors.workflow_name.message}</div>
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

export default AddWorkflowDetailsModal;
