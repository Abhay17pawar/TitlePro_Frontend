import { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const EditContactType = ({ isOpen, setIsOpen, onSubmit, editState, token }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isOpen && editState) {
      reset({
        contact_type: editState.contact_type,
      });
    }
  }, [isOpen, editState, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        contact_type: data.contact_type,
      };

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/contact-types/${editState.id}`, requestData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, // Pass the token here
        },
      });

      if (response.data.success) {
        toast.success("Contact Type updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editState, ...requestData });
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update Contact Type.", { autoClose: 1500 });
      }
    } catch (error) {
      toast.error("An error occurred while updating the Contact Type.", { autoClose: 1500 });
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
              name="contact_type"
              control={control}
              rules={{ required: "Contact Type is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
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

