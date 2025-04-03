import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";

const WorkflowTableAddModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();
  
  const handleFormSubmit = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/assigned`, data, {
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
      const errorMessage = error.response?.data?.error?.errorMessage || 'An error occurred while adding Workflow Details!';
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };  

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="md" centered>
    <Modal.Header closeButton>
      <Modal.Title className="h6">Add Task</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Task Name */}
        <Form.Group className="mb-3">
          <Form.Label>Task Name <span className="text-danger">*</span></Form.Label>
          <Controller
            name="task_name"
            control={control}
            rules={{ required: "Task Name is required" }}
            render={({ field }) => (
              <>
                <Form.Control type="text" {...field} isInvalid={!!errors.task_name} />
                <Form.Control.Feedback type="invalid">{errors.task_name?.message}</Form.Control.Feedback>
              </>
            )}
          />
        </Form.Group>

        {/* When & Specific Task */}
        <Form.Group className="mb-3 d-flex">
          <div className="me-2 flex-grow-1">
            <Form.Label>When <span className="text-danger">*</span></Form.Label>
            <Controller
              name="when"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <>
                  <Form.Control type="text" {...field} isInvalid={!!errors.when} />
                  <Form.Control.Feedback type="invalid">{errors.when?.message}</Form.Control.Feedback>
                </>
              )}
            />
          </div>
          <div className="flex-grow-1">
            <Form.Label>Specific Task</Form.Label>
            <Controller
              name="specific_task"
              control={control}
              render={({ field }) => <Form.Control type="text" {...field} />}
            />
          </div>
        </Form.Group>

        {/* Assign Type (Radio Buttons) */}
        <Form.Group className="mb-3">
          <Form.Label>Assign Type <span className="text-danger">*</span></Form.Label>
          <div className="d-flex gap-3">
            {["User", "Task group(Auto)", "Task group", "Previous Owner"].map((type) => (
              <Controller
                key={type}
                name="assign_type"
                control={control}
                rules={{ required: "Please select an option" }}
                render={({ field }) => (
                  <Form.Check type="radio" {...field} value={type} label={type} />
                )}
              />
            ))}
          </div>
          {errors.assign_type && <span className="text-danger">{errors.assign_type.message}</span>}
        </Form.Group>

        {/* Assign Task Group & Assign to User */}
        <Form.Group className="mb-3 d-flex">
          <div className="me-2 flex-grow-1">
            <Form.Label>Assign Task Group <span className="text-danger">*</span></Form.Label>
            <Controller
              name="assign_task_group"
              control={control}
              rules={{ required: "Task Group is required" }}
              render={({ field }) => (
                <Form.Select {...field} isInvalid={!!errors.assign_task_group}>
                  <option value="">Select Task Group</option>
                  <option value="group1">Group 1</option>
                  <option value="group2">Group 2</option>
                </Form.Select>
              )}
            />
            <Form.Control.Feedback type="invalid">{errors.assign_task_group?.message}</Form.Control.Feedback>
          </div>
          <div className="flex-grow-1">
            <Form.Label>Assign to User</Form.Label>
            <Controller
              name="assign_to_user"
              control={control}
              render={({ field }) => (
                <Form.Select {...field}>
                  <option value="">Select User</option>
                  <option value="user1">User 1</option>
                  <option value="user2">User 2</option>
                </Form.Select>
              )}
            />
          </div>
        </Form.Group>

        {/* Due Date */}
        <Form.Group className="mb-3">
          <Form.Label>Due Date <span className="text-danger">*</span></Form.Label>
          <Controller
            name="due_date"
            control={control}
            rules={{ required: "Due Date is required" }}
            render={({ field }) => (
              <>
                <Form.Control type="datetime-local" {...field} isInvalid={!!errors.due_date} />
                <Form.Control.Feedback type="invalid">{errors.due_date?.message}</Form.Control.Feedback>
              </>
            )}
          />
        </Form.Group>

        {/* Vendor Management Checkbox */}
        <Form.Group className="mb-3">
          <Controller
            name="vendor_management"
            control={control}
            render={({ field }) => (
              <Form.Check type="checkbox" label="Vendor Management" {...field} />
            )}
          />
        </Form.Group>

        {/* Buttons */}
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Previous</Button>
          <Button type="submit" style={{ background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}>
            Submit
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
  );
};

export default WorkflowTableAddModal;
