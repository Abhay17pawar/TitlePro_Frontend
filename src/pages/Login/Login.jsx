import React, { useEffect, useState } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import backgroundImage from "../../assets/background.png";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext"; 
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [emailOrusername, setemailOrusername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  
  useEffect(() => {
    if (token) {
      navigate("/dashboard"); 
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {
      email: "",
      password: validator.isLength(password, { min: 6 }) ? "" : "Password must be at least 6 characters",
    };
  
    if (validator.isEmail(emailOrusername)) {
      newErrors.email = validator.isEmail(emailOrusername) ? "" : "Invalid email format";
    } else {
      newErrors.email = ""; 
    }
  
    setErrors(newErrors);
  
    if (newErrors.password) {
      return; 
    }
  
    setLoading(true);
    setApiError(""); 
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          emailOrusername,
          password,
        }
      );
  
      const { token, data, message } = response.data;

      toast.success(message || "Login success", { autoClose: 1500 });
  
      login(token);

      localStorage.setItem("user", JSON.stringify(data));
  
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!", { autoClose: 1500 });
      setApiError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
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
          width: "100%",
          maxWidth: "500px",
          height: "auto",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-69px)",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-4" style={{ fontSize: "24px" }}>
            <span style={{ color: "#007bff" }}>Title</span>Pro
          </h3>

          {apiError && (
            <div className="alert alert-danger text-center">{apiError}</div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter email or username"
                value={emailOrusername}
                onChange={(e) => setemailOrusername(e.target.value)}
              />
              {errors.email && (
                <div className="text-danger small">{errors.email}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="position-absolute"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6c757d",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </span>
              </InputGroup>
              {errors.password && (
                <div className="text-danger small">{errors.password}</div>
              )}
            </Form.Group>

            <div className="text-end mb-3">
              <span
                className="text-primary text-decoration-none"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>

            <Button
              className="w-100"
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
