import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const OrderPageModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      customer: "",
      state: "",
      county: "",
      product_type: "",  
      transactionType: "",
      dataSource: "",
      workflowGroup: "",
    },
  });

  const token = localStorage.getItem("token");

  const handleFormSubmit = async (data) => {
    try {
      const formattedData = {
        customer: data.customer,
        state: data.state,
        county: data.county,
        product_type: data.product_type,  // ✅ Fixed field name
        transaction_type: data.transactionType,  // ✅ Ensure backend expects this
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
      console.error("API Error:", error.response?.data || error.message); // ✅ Debugging log

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
              name="product_type"  // ✅ Fixed field name
              control={control}
              render={({ field }) => <Form.Control type="text" {...field} required />}
            />
          </Form.Group>

          <Form.Group controlId="formTransactionType" className="mt-2">
            <Form.Label className="mb-0 text-muted">
              Transaction Type <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name="transactionType"
              control={control}
              render={({ field }) => <Form.Control type="text" {...field} required />}
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
            <Button style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  
 className="d-flex justify-content-end" type="submit">
              Create Order
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderPageModal;
