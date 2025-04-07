import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"

const validationSchema = yup.object({
  name : yup
                 .string()
                 .trim()
                 .required("Transaction Type is required")
                 .matches(/^[^\d]*$/, "Transaction Type must not contain any digits")
});

const EditTransactionTypeModal = ({ isOpen, setIsOpen, onSubmit, editTransactionType }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver : yupResolver(validationSchema)
  });
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen && editTransactionType) {
      reset({
        name: editTransactionType.name, // Populate with existing transaction name
      });
    }
  }, [isOpen, editTransactionType, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        name: data.name, // Only update transaction type
      };

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/transaction-type/${editTransactionType.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        toast.success(response.data?.message || "Transaction Type updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editTransactionType, ...requestData }); // Pass the updated contact info
        setIsOpen(false); // Close the modal after submitting
      } else {
        toast.error("Failed to update transaction type.", { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while updating transaction type.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit Transaction Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>

          {/* Transaction Type Input */}
          <Form.Group controlId="formTransactionType" className="mb-3">
            <Form.Label className="text-muted mb-0">Transaction Type</Form.Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Transaction Type is required" }}
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

export default EditTransactionTypeModal;
