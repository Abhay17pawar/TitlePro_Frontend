import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";

const OrderPageModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      customer: "",
      state: "",
      county: "",
      product_type: null,
      transactionType: null,
      dataSource: "",
      workflowGroup: "",
    },
  });

  const { token } = useAuth();
  const [productOptions, setProductOptions] = useState([]);
  const [transactionOptions, setTransactionOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countyOptions, setCountyOptions] = useState([]);
  const [datasource, setDataSource] = useState([]);

  // Fetch Data Source Options
  useEffect(() => {
    const fetchDataSource = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/datasource`);
        const { data } = response;

        console.log("Data Source Response: ", data);

        if (data.success && Array.isArray(data.data)) {
          const options = data.data.map((item) => ({
            value: item.id, // Assuming 'id' is the unique identifier for the data source
            label: item.source_name, // Assuming 'name' is the label for the data source
          }));
          setDataSource(options);
        } else {
          toast.error("Failed to fetch data sources.");
        }
      } catch (error) {
        toast.error("Error fetching data sources.");
      }
    };

    fetchDataSource();
  }, []);

  // Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/states`, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

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
        toast.error("Error fetching states.");
      }
    };

    fetchStates();
  }, []);

  // Fetch Product Types
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data?.data && Array.isArray(response.data.data)) {
          const options = response.data.data.map((product) => ({
            value: product.id,
            label: product.product,
          }));
          setProductOptions(options);
        } else {
          toast.error("Invalid product data received.");
        }
      } catch (error) {
        toast.error("Failed to load product types.");
      }
    };

    fetchProducts();
  }, []);

  // Fetch Transaction Types based on Product Type
  const handleProductChange = async (option, field) => {
    field.onChange(option);
    if (option?.value) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/transactions/${option.value}`,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (response.data?.data && Array.isArray(response.data.data)) {
          const transOptions = response.data.data.map((item, index) => ({
            value: index, // Using index since there's no ID
            label: item.transaction_name,
          }));
          setTransactionOptions(transOptions);
        } else {
          setTransactionOptions([]);
          toast.error("Invalid transaction data received.");
        }
      } catch (error) {
        setTransactionOptions([]);
        toast.error("Failed to load transaction types.");
      }
    } else {
      setTransactionOptions([]);
    }
  };

  // Fetch Counties based on selected State
  const handleStateChange = async (option, field) => {
    field.onChange(option);
    if (option?.value) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/counties/states/${option.value}`,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (response.data?.data && Array.isArray(response.data.data)) {
          const countyOptions = response.data.data.map((county) => ({
            value: county.id,
            label: county.county_name,
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

  // Handle form submit
  const handleFormSubmit = async (data) => {
    try {
      const formattedData = {
        customer: data.customer,
        state: data.state?.value || "",
        county: data.county?.value || "",
        product_type: data.product_type?.value || "",
        transaction_type: data.transactionType?.value || "",
        data_source: data.dataSource,
        workflow_group: data.workflowGroup,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order added successfully!", { autoClose: 1500 });
        onSubmit(response.data.data);
        setIsOpen(false);
        reset();
      } else {
        toast.error(response.data.message || "Failed to create order.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.errorMessage || "An error occurred while creating Order.";
      toast.error(errorMessage, { autoClose: 1500 });
    }
  };

  const customerOptions = [
    { value: 'customer1', label: 'Customer 1' },
    { value: 'customer2', label: 'Customer 2' },
    { value: 'customer3', label: 'Customer 3' },
    // Add more options as needed
  ];

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Open New Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Group controlId="formName" className="mb-2">
            <Form.Label className="mb-0 text-muted">
              Customer <span className="text-danger">*</span>
            </Form.Label>
            <Controller
        name="customer"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={customerOptions}
                  required
                  onChange={(selectedOption) => field.onChange(selectedOption?.value)} // Handle onChange to integrate with react-hook-form
                  placeholder="Select a Customer"
                />
              )}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formState" className="mt-2">
                <Form.Label className="mb-0 text-muted">
                  State <span className="text-danger">*</span>
                </Form.Label>
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
                <Form.Label className="mb-0 text-muted">
                  County <span className="text-danger">*</span>
                </Form.Label>
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

          <Form.Group controlId="formProductType" className="mt-2">
            <Form.Label className="mb-0 text-muted">
              Product Type <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name="product_type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={productOptions}
                  placeholder="Select product type"
                  value={productOptions.find((option) => option.value === field.value?.value) || null}
                  onChange={(option) => {
                    field.onChange(option);
                    handleProductChange(option, field);
                  }}
                />
              )}
            />
          </Form.Group>

          <Form.Group controlId="formTransactionType" className="mt-2">
            <Form.Label className="mb-0 text-muted">
              Transaction Type <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name="transactionType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={transactionOptions}
                  placeholder="Select transaction type"
                  value={transactionOptions.find((option) => option.value === field.value?.value) || null}
                  onChange={(option) => field.onChange(option)}
                />
              )}
            />
          </Form.Group>

          <Form.Group controlId="formDataSource" className="mt-2">
          <Form.Label className="mb-0 text-muted">
              Data Source <span className="text-danger">*</span>
            </Form.Label>
            <Controller
            name="dataSource"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={datasource} // Using the mapped dataSource options
                placeholder="Select data source"
                value={datasource.find((option) => option.value === field.value?.value) || null} // Match selected value
                onChange={(selectedOption) => field.onChange(selectedOption)} // Correctly set the selected option
                getOptionLabel={(option) => option.label} // Display the label of the option
                required
              />
            )}
          />

          </Form.Group>

          <Form.Group controlId="formWorkflowGroup" className="mt-2">
            <Form.Label className="mb-0 text-muted">
              Workflow Group <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name="workflowGroup"
              control={control}
              render={({ field }) => <Form.Control type="text" {...field} required />}
            />
          </Form.Group>

          <Modal.Footer>
            <Button
              style={{
                border: "none",
                background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)',
              }}
              type="submit"
            >
              Create Order
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderPageModal;
