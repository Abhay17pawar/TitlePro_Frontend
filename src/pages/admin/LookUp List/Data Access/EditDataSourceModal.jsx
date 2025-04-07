import { useEffect } from "react";
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
                .required("Data Source is required")
                .matches(/^[^\d]*$/, "Data Source must not contain any digits")
});

const EditDataSourceModal = ({ isOpen, setIsOpen, onSubmit, editState }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver : yupResolver(validationSchema)
  });
  const { token } = useAuth();
  
  useEffect(() => {
    if (isOpen && editState) {
      reset({
        name: editState.name, 
      });
    }
  }, [isOpen, editState, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        name: data.name, 
      };

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/data-source/${editState.id}`, requestData, {
        headers: {
            "Content-Type": "application/json" ,
            'Authorization': `Bearer ${token}`, 
        },
      });

      if (response.data.status) {
        toast.success(response.data?.message || "Data Source updated successfully!" , {autoClose: 1500});
        onSubmit({ ...editState, ...requestData });
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update Source Name." , {autoClose: 1500});
      }
    } catch (error) {
      toast.error(error.response.data?.message || "An error occurred while updating the Source Name.", {autoClose: 1500});
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit State</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          {/* State Name Input */}
          <Form.Group controlId="formStateName" className="mb-3">
            <Form.Label className="text-muted mb-0">Data Source</Form.Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Data Source is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
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

export default EditDataSourceModal;
