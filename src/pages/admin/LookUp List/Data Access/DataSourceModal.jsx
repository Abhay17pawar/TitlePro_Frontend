import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios

const AddDataSourceModal = ({ isOpen, setIsOpen, onSubmit }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    const handleFormSubmit = async (data) => {

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/datasource`, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded" // Set content type for form data
                },
            });

            const result = response.data;
            console.log(result);
            
            if (result.success) {
                toast.success("Data Source added successfully!", { autoClose: 1500 });
                onSubmit(result.data); // Pass the new data source to parent
                setIsOpen(false); // Close modal after success
                reset(); // Reset form fields
            } else {
                toast.error(result.message || "Failed to add Data Source.");
            }
        } catch (error) {
            console.error("Error adding data source:", error.response ? error.response.data : error);
            toast.error("An error occurred while adding Data Source.");
        }
    };

    return (
        <Modal show={isOpen} onHide={() => setIsOpen(false)} size="sm" centered>
            <Modal.Header closeButton>
                <Modal.Title className="h6">Add Data Source</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Form.Group controlId="formProductType" className="mb-3">
                        <Form.Label className="text-muted">Data Source</Form.Label>
                        <Controller
                            name="source_name" // Keep the same name in the form (frontend)
                            control={control}
                            rules={{ required: "Data Source is required" }}
                            render={({ field }) => (
                                <>
                                    <Form.Control
                                        type="text"
                                        {...field}
                                        value={field.value || ''} // Ensure the value is always a defined string
                                        isInvalid={!!errors.source_name} // Check for error in source_name field
                                    />
                                    {errors.source_name && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.source_name.message}
                                        </Form.Control.Feedback>
                                    )}
                                </>
                            )}
                        />
                    </Form.Group>

                    <Button
                        style={{ border: "none", background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }}
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

export default AddDataSourceModal;
