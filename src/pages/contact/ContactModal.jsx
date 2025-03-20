import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, ModalFooter } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const AddContactModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm();
  const [contactTypes, setContactTypes] = useState([]);

  // Fetch contact types from API
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    const fetchContactTypes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-types`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data && Array.isArray(response.data.data)) {
          setContactTypes(response.data.data); // Extract the array from the `data` property
        } else {
          setContactTypes([]); // Fallback to an empty array if data is not in expected format
        }
      } catch (error) {
        toast.error("Failed to fetch contact types.");
        setContactTypes([]); // Ensure contactTypes is always an array
      }
    };
  
    if (isOpen) fetchContactTypes();
  }, [isOpen]);
  

  const handleFormSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("user")); // Assuming user is stored as a JSON string in localStorage
      if (!token) {
        toast.error("No token found, please log in.");
        return;
      }

      if (!userId) {
        toast.error("No user ID found.");
        return;
      }  

      const requestData = { ...data, user_id: userId.id };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contacts`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        toast.success("Contact added successfully!", { autoClose: 1500 });
        onSubmit(result.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error(result.message || "Failed to add contact.");
      }
    } catch (error) {
      toast.error("An error occurred while adding contact.");
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formContact" className="mb-2">
            <Form.Group controlId="formName">
              <Form.Label className="mb-0 text-muted">Name</Form.Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Form.Control type="text" {...field} required />}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label className="mb-0 text-muted">Phone</Form.Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <Form.Control type="text" {...field} required />}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-2">
              <Form.Label className="mb-0 text-muted">Email</Form.Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <Form.Control type="email" {...field} required />}
              />
            </Form.Group>

            <Form.Group controlId="formType" className="mt-2">
              <Form.Label className="mb-0 text-muted">Type</Form.Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Form.Control as="select" {...field} required>
                    <option value="">Select Type</option>
                    {contactTypes.map((type) => (
                      <option key={type.slug} value={type.slug}>
                        {type.slug}
                      </option>
                    ))}
                  </Form.Control>
                )}
              />
            </Form.Group>

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
                <Form.Group controlId="formCity" className="mt-2">
                  <Form.Label className="mb-0 text-muted">City</Form.Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => <Form.Control type="text" {...field} required />}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formCounty" className="mt-2">
                  <Form.Label className="mb-0 text-muted">County</Form.Label>
                  <Controller
                    name="county"
                    control={control}
                    render={({ field }) => <Form.Control type="text" {...field} required />}
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
            <Button className="d-flex justify-content-end bg-info border-info" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddContactModal;
