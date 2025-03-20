import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import backgroundImage from "../../assets/Background.png"; 
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(true);
    } else {
      setError(false);
      console.log("Password reset request sent to:", email);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        overflow: "hidden",
      }}
    >
      <Card
        style={{
          width: "500px",
          height : "280px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-69px)",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-3">
            <span style={{ color: "#007bff" }}>Title</span>Pro
          </h3>
          <h5 className="text-center text-primary mb-4">Forgot Password</h5>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter the Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <div className="text-danger small mt-1">Email is required</div>}
            </Form.Group>

            <Button onClick={() => navigate('/login')} className="w-100" variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPassword;