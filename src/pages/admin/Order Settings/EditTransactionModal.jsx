import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";

const EditTransactionTypeModal = ({ isOpen, setIsOpen, onSubmit, editContact }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();
  useEffect(() => {
    if (isOpen && editContact) {
      reset({
        transaction_type: editContact.transaction_name, // Populate with existing transaction name
      });
    }
  }, [isOpen, editContact, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const requestData = {
        transaction_name: data.transaction_type, // Only update transaction type
      };

      if (!token) {
        toast.error("No token found, please log in.", { autoClose: 1500 });
        return;
      }

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/transactions/${editContact.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Transaction Type updated successfully!", { autoClose: 1500 });
        onSubmit({ ...editContact, ...requestData });
        setIsOpen(false);
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
