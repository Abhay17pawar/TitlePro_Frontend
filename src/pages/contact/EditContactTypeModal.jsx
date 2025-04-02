import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, ModalFooter } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';

const EditContactModal = ({ isOpen, setIsOpen, onSubmit, editContact }) => {
  const { control, handleSubmit, reset, setValue } = useForm();
  const { token } = useAuth(); // Get token for API requests

  // State for dynamic options fetched from the API
  const [contactTypes, setContactTypes] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countyOptions, setCountyOptions] = useState([]);

  // Fetch contact types from the API
  useEffect(() => {
    const fetchContactTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/contact-types`,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${token}`
             },
          }
        );

        console.log("contact-types",response?.data);

        if (response.data?.success) {
          const options = response.data.data.map((type) => ({
            value: type.slug,  // Assuming 'slug' is the unique identifier for contact types
            label: type.contact_type,  // 'label' is the display name for the contact type
          }));
          setContactTypes(options);
        } else {
          toast.error("Failed to fetch contact types.");
        }
      } catch (error) {
        toast.error("Error fetching contact types.");
      }
    };

    if (isOpen) {
      fetchContactTypes(); // Fetch contact types when the modal opens
    }
  }, [isOpen]);

  // Fetch states from the API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/states`,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" ,
              'Authorization': `Bearer ${token}`, 
            }
          }
        );

        if (response.data?.success) {
          const options = response.data.data.map((state) => ({
            value: state.id,
            label: state.state_name,
          }));
          setStateOptions(options);
        } else {
          toast.error("Failed to fetch states.");
        }
      } catch (error) {
        toast.error("Error fetching states." , {autoClose : 1500});
      }
    };

    if (isOpen) {
      fetchStates(); // Fetch states when the modal opens
    }
  }, [isOpen]);

  // Fetch counties based on selected state
  const handleStateChange = async (option, field) => {
    field.onChange(option);  // Updates the state
    if (option?.value) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/counties/states/${option.value}`,
          { headers: { "Content-Type": "application/x-www-form-urlencoded"  ,
            'Authorization': `Bearer ${token}`, 
          }
          }
        );

        if (response.data?.data && Array.isArray(response.data.data)) {
          const countyOptions = response.data.data.map((county) => ({
            value: county.id,
            label: county.county_name,
          }));
          setCountyOptions(countyOptions);

          // Pre-select the county if editContact has a county already
          if (editContact?.county) {
            const selectedCounty = countyOptions.find(
              (county) => county.value === editContact.county.id
            );
            setValue("county", selectedCounty);
          }
        } else {
          setCountyOptions([]);
          toast.error("Failed to fetch counties.");
        }
      } catch (error) {
        setCountyOptions([]);
        toast.error("Failed to load counties.");
      }
    } else {
      setCountyOptions([]);
    }
  };

// Reset form when modal opens with new data
useEffect(() => {
    if (isOpen && editContact) {
      reset({
        name: editContact.name,
        phone: editContact.phone,
        email: editContact.email,
        address: editContact.address,
        // Ensure that 'type' is set in the correct format for react-select
        type: editContact.contact_type
          ? { value: editContact.type.slug, label: editContact.type.contact_type }
          : null,
        // Ensure that 'state' is set in the correct format for react-select
        state: editContact.state
          ? { value: editContact.state.id, label: editContact.state.state_name }
          : null,
        // Ensure that 'county' is set in the correct format for react-select
        county: editContact.county
          ? { value: editContact.county.id, label: editContact.county.county_name }
          : null,
        status: editContact.status,
      });
  
      // If state is already set in editContact, fetch counties
      if (editContact.state) {
        handleStateChange({ value: editContact.state.id, label: editContact.state.state_name }, { onChange: setValue });
      }
    }
  }, [isOpen, editContact, reset, setValue]);
  

  const handleFormSubmit = async (data) => {
    try {
      const requestData = { ...data };

      if (!token) {
        toast.error('No token found, please log in.', { autoClose: 1500 });
        return;
      }

      // Send the update request to the API
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/contacts/${editContact.id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Contact updated successfully!', { autoClose: 1500 });
        onSubmit({ ...editContact, ...requestData }); // Call the onSubmit prop to update state
        setIsOpen(false); // Close the modal
      } else {
        toast.error('Failed to update contact', { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while adding contact.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Edit Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formContact" className="mb-2">
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formName">
                  <Form.Label className="mb-0 text-muted">Name</Form.Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <Form.Control type="text" {...field} required />}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formPhone">
                  <Form.Label className="mb-0 text-muted">Phone</Form.Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => <Form.Control type="text" {...field} required />}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-7">
                <Form.Group controlId="formEmail">
                  <Form.Label className="mb-0 text-muted">Email</Form.Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <Form.Control type="email" {...field} required />}
                  />
                </Form.Group>
              </div>
              <div className="col-md-5">
                <Form.Group controlId="formType">
                  <Form.Label className="mb-0 text-muted">Contact Type</Form.Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={contactTypes}
                        placeholder="Select Type"
                        getOptionLabel={(e) => e.label}
                      />
                    )}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group controlId="formAddress" className="mt-2">
              <Form.Label className="mb-0 text-muted">Address</Form.Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <Form.Control type="text" {...field} required />}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formState" className="mt-2">
                  <Form.Label className="mb-0 text-muted">State</Form.Label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={stateOptions}
                        placeholder="Select state"
                        value={stateOptions.find((option) => option.value === field.value?.value) || null}
                        onChange={(option) => handleStateChange(option, field)}
                        required
                      />
                    )}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formCounty" className="mt-2">
                  <Form.Label className="mb-0 text-muted">County</Form.Label>
                  <Controller
                    name="county"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={countyOptions}
                        placeholder="Select county"
                        value={countyOptions.find((option) => option.value === field.value?.value) || null}
                        onChange={(option) => field.onChange(option)}
                        required
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="formStatus" className="mt-2">
            <Form.Label className="text-muted">Status</Form.Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Form.Control as="select" {...field}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Control>
              )}
            />
          </Form.Group>

          <ModalFooter>
            <Button
              style={{ border: "none", background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}
              className="d-flex justify-content-end"
              type="submit"
            >
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditContactModal;
