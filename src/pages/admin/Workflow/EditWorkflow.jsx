import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";

const EditWorkflow = ({ isOpen, setIsOpen, onSubmit, editState }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen && editState) {
      reset({
        work_name: editState.work_name, 
      });
    }
  }, [isOpen, editState, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        work_name: data.work_name, 
      };
  
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/workflows/${editState.id}`, requestData , {
        headers : {
          'Authorization': `Bearer ${token}`, 
        }
      });
  
      if (response.data.success) {
        toast.success("Workflow Group updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editState, ...requestData });
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update Workflow Group.", { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while updating the Workflow Group.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };  

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit Workflow Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          {/* State Name Input */}
          <Form.Group controlId="formStateName" className="mb-3">
            <Form.Label className="text-muted mb-0">Workflow Group</Form.Label>
            <Controller
              name="work_name"
              control={control}
              rules={{ required: "Workflow Group is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ""}
                    isInvalid={!!errors.work_name}
                  />
                  {errors.work_name && (
                    <Form.Control.Feedback type="invalid">
                      {errors.work_name.message}
                    </Form.Control.Feedback>
                  )}
                </>
              )}
            />
          </Form.Group>

          {/* Submit Button */}
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

export default EditWorkflow;
