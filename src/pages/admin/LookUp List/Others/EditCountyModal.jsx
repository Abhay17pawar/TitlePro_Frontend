import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";
import * as yup from "yup";  
import { yupResolver } from "@hookform/resolvers/yup";  

const validationSchema = yup.object({
  name : yup 
        .string()
        .trim()
        .required("County name is required")
        .matches(/^[^\d]*$/, "Contact Type must not contain any digits")
});

const EditCountyModal = ({ isOpen, setIsOpen, onSubmit, editCounty }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver : yupResolver(validationSchema),
  });

  const { token } = useAuth();
  
  useEffect(() => {
    if (isOpen && editCounty) {
      reset({
        name: editCounty.name,  // This should correctly reset the form when opening the modal
      });
    }
  }, [isOpen, editCounty, reset]);
  

  const handleFormSubmit = async (data) => {
    try {

      const requestData = {
        name: data.name, 
        state_id: editCounty.state_id
      };

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/county/${editCounty.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        toast.success(response.data?.message || "County updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editCounty, ...requestData });
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update county.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while updating County.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit County</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          {/* County Name Input */}
          <Form.Group controlId="formStateName" className="mb-3">
            <Form.Label className="text-muted mb-0">County Name</Form.Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "County Name is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ""}
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
