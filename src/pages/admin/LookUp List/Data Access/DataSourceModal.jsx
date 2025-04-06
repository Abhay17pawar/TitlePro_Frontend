import { Modal, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";
import * as yup from "yup";  
import { yupResolver } from "@hookform/resolvers/yup";  

const validationSchema = yup.object({
  name : yup 
                .string()
                .trim()
                .required("Data Source is required")
                .matches(/^[^\d]*$/, "Data Source must not contain any digits")
});

const AddDataSourceModal = ({ isOpen, setIsOpen, onSubmit }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver : yupResolver(validationSchema)
    });
    const { token } = useAuth();

    const handleFormSubmit = async (data) => {

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/data-source`, data, {
                headers: {
                    "Content-Type": "application/json" ,
                    'Authorization': `Bearer ${token}`, 
                },
            });
            
            if (response.data.status === 201) {
                toast.success("Data Source added successfully!", { autoClose: 1500 });
                onSubmit(response.data.data); // Pass the new data source to parent
                setIsOpen(false); // Close modal after success
                reset(); // Reset form fields
            } else {
                toast.error(response.data?.message || "Failed to add Data Source." , { autoClose : 1500});
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while adding Data Source." , {autoClose : 1500});
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
                            name="name" // Keep the same name in the form (frontend)
                            control={control}
                            rules={{ required: "Data Source is required" }}
                            render={({ field }) => (
                                <>
                                    <Form.Control
                                        type="text"
                                        {...field}
                                        value={field.value || ''} // Ensure the value is always a defined string
                                        isInvalid={!!errors.name} // Check for error in name field
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
