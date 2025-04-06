import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"

const validationSchema = yup.object({
  transaction_type : yup
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
        transaction_type: editTransactionType.transaction_name, // Populate with existing transaction name
      });
    }
  }, [isOpen, editTransactionType, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        transaction_name: data.transaction_type, // Only update transaction type
      };

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/transactions/${editTransactionType.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Transaction Type updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editTransactionType, ...requestData }); // Pass the updated contact info
        setIsOpen(false); // Close the modal after submitting
      } else {
        toast.error("Failed to update transaction type.", { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while updating transaction type.";
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
              name="transaction_type"
              control={control}
              rules={{ required: "Transaction Type is required" }}
              render={({ field }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    value={field.value || ""}
                    isInvalid={!!errors.transaction_type}
                  />
                  {errors.transaction_type && (
                    <Form.Control.Feedback type="invalid">
                      {errors.transaction_type.message}
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
