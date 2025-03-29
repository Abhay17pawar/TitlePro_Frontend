import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const EditCountyModal = ({ isOpen, setIsOpen, onSubmit, editState }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isOpen && editState) {
      reset({
        county_name: editState.county_name,  // This should correctly reset the form when opening the modal
      });
    }
  }, [isOpen, editState, reset]);
  

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        county_name: data.county_name, // Only update county name
      };

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, please log in.");
        return;
      }

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/counties/${editState.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("County updated successfully!");
        onSubmit({ ...editState, ...requestData });
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update county.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the county.");
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit County</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          {/* State Name Input */}
          <Form.Group controlId="formStateName" className="mb-3">
            <Form.Label className="text-muted mb-0">County Name</Form.Label>
            <Controller
              name="county_name"
              control={control}
              rules={{ required: "County Name is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ""}
                    isInvalid={!!errors.county_name}
                  />
                  {errors.county_name && (
                    <Form.Control.Feedback type="invalid">
                      {errors.county_name.message}
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

export default EditCountyModal
