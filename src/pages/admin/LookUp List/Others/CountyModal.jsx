import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";
import * as yup from "yup"; 
import { yupResolver } from "@hookform/resolvers/yup"; 

// Define Yup validation schema
const validationSchema = yup.object({
  name: yup
    .string()
    .trim() 
    .required("County Name is required") 
    .matches(/^[^\d]*$/, "Contact Type must not contain any digits")
});

const AddCountyModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema), 
  });
  const [states, setStates] = useState([]); // Store states
  const [selectedState, setSelectedState] = useState(null); // Store selected state
  const { token } = useAuth();

  // Fetch states when modal opens
  useEffect(() => {
    if (isOpen) {
      axios.get(`${import.meta.env.VITE_API_URL}/state`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
        .then(response => {
          const stateArray = response.data?.data || []; // Ensure correct array format
          const stateOptions = stateArray.map(state => ({
            value: state.id,  // Store state ID
            label: state.name // Store state name
          }));

          setStates(stateOptions);
        })
        .catch(error => {
          console.error("Error fetching states:", error);
          toast.error("Failed to fetch states.");
        });
    }
  }, [isOpen, token]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!selectedState) {
        toast.error("Please select a state.");
        return;
      }

      const requestData = {
        name: data.name, // Sending county name
        state_id: selectedState.value,  // Sending selected state ID
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/county`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 201) {
        toast.success(response.data?.message || "County added successfully!", { autoClose: 1500 });
        onSubmit(requestData);
        setIsOpen(false);
        reset();
        setSelectedState(null); 
      } else {
        toast.error(response.data?.message || "Failed to add county." , {autoClose : 1500});
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while adding County.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add County</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* State Selection */}
          <Form.Group controlId="formState" className="mb-3">
            <Form.Label className="text-muted mb-0">State</Form.Label>
            <Select
              options={states}
              value={selectedState}
              onChange={(selected) => {
                setSelectedState(selected);
              }}
              placeholder="Select a state"
            />
          </Form.Group>

          {/* County Name */}
          <Form.Group controlId="formCountyName" className="mb-3">
            <Form.Label className="text-muted mb-0">County Name</Form.Label>
            <Controller
              name="name"
              control={control}
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

export default AddCountyModal;
