import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios
import { useAuth } from "../../../../Context/AuthContext";

const AddProductTypeModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    try {

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, data, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, 
        },
      });

      const result = response.data;

      if (result.success) {
        toast.success("Product Type added successfully!", { autoClose: 1500 });
        onSubmit(result.data); // Pass the new product type to parent
        setIsOpen(false); // Close modal after success
        reset(); // Reset form fields
      } else {
        toast.error(result.message || "Failed to add product type.");
      }
    } catch (error) {
      toast.error("An error occurred while adding product type.");
    }
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">Add Product Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Group controlId="formProductType" className="mb-3">
        <Form.Label className="text-muted">Product Type</Form.Label>
        <Controller
          name="product_name" // Make sure this matches your Sequelize model attribute
          control={control}
          rules={{ required: "Product Type is required" }}
          render={({ field }) => (
            <>
              <Form.Control
                type="text"
                {...field}
                value={field.value || ''} // Ensure the value is always a defined string
                isInvalid={!!errors.product_name} // Update the error handling here
              />
              {errors.product_name && (
                <Form.Control.Feedback type="invalid">
                  {errors.product_name.message}
                </Form.Control.Feedback>
              )}
            </>
          )}
        />
      </Form.Group>

          <Button 
          style={{border: "none",background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}  
          className="w-100" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductTypeModal;
