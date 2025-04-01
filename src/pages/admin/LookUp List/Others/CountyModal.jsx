import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";

const AddCountyModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [states, setStates] = useState([]); // Store states
  const [selectedState, setSelectedState] = useState(null); // Store selected state

  // Fetch states when modal opens
  useEffect(() => {
    if (isOpen) {
      axios.get(`${import.meta.env.VITE_API_URL}/states`) // Fetch states from the API
        .then(response => {
          const stateArray = response.data?.data || []; // Ensure correct array format
          const stateOptions = stateArray.map(state => ({
            value: state.id,  // Store state ID
            label: state.state_name // Store state name
          }));

          setStates(stateOptions);
          console.log("Fetched States:", stateOptions); // Debugging log
        })
        .catch(error => {
          console.error("Error fetching states:", error);
          toast.error("Failed to fetch states.");
        });
    }
  }, [isOpen]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!selectedState) {
        toast.error("Please select a state.");
        return;
      }

      console.log("Selected State:", selectedState); // Debugging log

      const requestData = {
        state_name: selectedState.label,  // Sending selected state name
        county_name: data.county_name, // Sending county name
        stateId: selectedState.value,  // Sending selected state ID
      };

      console.log("Request Data:", requestData); // Log the request before sending

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in.");
        toast.error("No token found, please log in.", { autoClose: 1500 });
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/counties`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;
      if (result.success) {
        toast.success("County added successfully!", { autoClose: 1500 });
        onSubmit(requestData);
        setIsOpen(false);
        reset();
        setSelectedState(null); 
      } else {
        toast.error(result.message || "Failed to add county.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while adding County.";
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
                console.log("Selected State:", selected); // Debugging log
                setSelectedState(selected);
              }}
              placeholder="Select a state"
            />
          </Form.Group>

          {/* County Name */}
          <Form.Group controlId="formCountyName" className="mb-3">
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

export default AddCountyModal;
