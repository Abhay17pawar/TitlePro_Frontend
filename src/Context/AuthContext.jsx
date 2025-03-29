import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add navigation for redirects

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false); // Mark loading complete
  }, []);

  const login = (authToken) => {
    setToken(authToken);
    localStorage.setItem("token", authToken);
    navigate("/dashboard"); // Redirect user after login
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login after logout
  };

  if (loading) return null; // Prevent rendering until loading completes

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
