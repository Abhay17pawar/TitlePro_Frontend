import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, ModalFooter } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { useAuth } from "../../Context/AuthContext";

const AddContactModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      contact_type_id: null,
      address: "",
      state_id: null,
      county_id: null,
      status: "active",
    },
  });
  
  const [contactTypes, setContactTypes] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countyOptions, setCountyOptions] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchContactTypes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-type`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setContactTypes(response.data.data);
        } else {
          setContactTypes([]);
        }
      } catch (error) {
        toast.error("Failed to fetch contact types.", { autoClose: 1500 });
        setContactTypes([]);
      }
    };

    if (isOpen) fetchContactTypes();
  }, [isOpen]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/state`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.status) {
          const options = response.data.data.map((state) => ({
            value: state.id,
            label: state.name,
          }));
          setStateOptions(options);
        } else {
          toast.error("Failed to fetch states.", { autoClose: 1500 });
        }
      } catch (error) {
        toast.error("Error fetching states.", { autoClose: 1500 });
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = async (option, field) => {
    field.onChange(option);
    if (option?.value) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_county_by_state/${option.value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.status && Array.isArray(response.data.data)) {
          const countyOptions = response.data.data.map((county) => ({
            value: county.id,
            label: county.name,
          }));
          setCountyOptions(countyOptions);
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

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        contact_type_id: data.contact_type_id?.value,
        address: data.address,
        state_id: data.state_id?.value,
        county_id: data.county_id?.value,
        status: data.status,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      if (result.status) {
        toast.success("Contact added successfully!", { autoClose: 1500 });
        onSubmit(result.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error(result.message || "Failed to add contact.", { autoClose: 1500 });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorMessage || "An error occurred while adding contact.";
      toast.error(errorMessage, { autoClose: 1500 });
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
                    name="contact_type_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={contactTypes.map((type) => ({
                          value: type.id,
                          label: type.slug,
                        }))}
                        placeholder="Select Type"
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
                  <Form.Label className="mb-0 text-muted">
                    State <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="state_id"
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
                  <Form.Label className="mb-0 text-muted">
                    County <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="county_id"
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

export default AddContactModal;
