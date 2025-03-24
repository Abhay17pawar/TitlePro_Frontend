import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";

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

  const token = localStorage.getItem("token");
  const [productOptions, setProductOptions] = useState([]);
  const [transactionOptions, setTransactionOptions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://titlepro-backend-final.onrender.com/products",
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data?.data && Array.isArray(response.data.data)) {
          const options = response.data.data.map((product) => ({
            value: product.id,
            label: product.product_name,
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

  const handleProductChange = async (option, field) => {
    field.onChange(option);
    if (option?.value) {
      try {
        const response = await axios.get(
          `https://titlepro-backend-final.onrender.com/transactions/${option.value}`,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
  
        console.log("Transaction API Response:", response.data); // Debugging log
  
        if (response.data?.data && Array.isArray(response.data.data)) {
          const transOptions = response.data.data.map((item, index) => ({
            value: index, // Since `id` is not present, using index
            label: item.transaction_name, // Corrected field name
          }));
          setTransactionOptions(transOptions);
        } else {
          setTransactionOptions([]);
          toast.error("Invalid transaction data received.");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactionOptions([]);
        toast.error("Failed to load transaction types.");
      }
    } else {
      setTransactionOptions([]); // Reset if no product is selected
    }
  }

  const handleFormSubmit = async (data) => {
    try {
      const formattedData = {
        customer: data.customer,
        state: data.state,
        county: data.county,
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
      toast.error(
        error.response?.data?.message || "An error occurred while creating the order.",
        { autoClose: 1500 }
      );
    }
  };

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
                  name="state"
                  control={control}
                  render={({ field }) => <Form.Control type="text" placeholder="Enter State" {...field} required />}
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
                  render={({ field }) => <Form.Control type="text" placeholder="Enter county" {...field} required />}
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
                value={productOptions.find(option => option.value === field.value?.value) || null}
                onChange={(option) => {
                  field.onChange(option); 
                  handleProductChange(option, field); // Ensure transaction options update
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
                value={transactionOptions.find(option => option.value === field.value?.value) || null}
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
              render={({ field }) => <Form.Control type="text" {...field} required />}
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
