import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightIcon from "@mui/icons-material/Flight";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import "./Login.css";
import { API_URL } from "../global";

const loginSchema = object({
  username: string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters"),
  password: string()
    .required("Password is required")
});

const FEATURES = [
  { icon: <SecurityIcon fontSize="small" />, text: "Bank-level security & encryption" },
  { icon: <SpeedIcon fontSize="small" />, text: "Real-time fleet monitoring" },
  { icon: <CheckCircleIcon fontSize="small" />, text: "Instant policy quotes" },
  { icon: <SupportAgentIcon fontSize="small" />, text: "24/7 claims support" },
];

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: async (formValues) => {
        setError("");
        setLoading(true);

        fetch(`${API_URL}/auth/login`,{
          method : 'POST',
          body : JSON.stringify(formValues),
          headers:{
            "Content-Type":"application/json"
          }
        })

        .then((res) => res.ok ? res.json() : Promise.reject("Access Denied"))
        .then((data) =>{
          localStorage.setItem("role" , data.role);
          localStorage.setItem("token" ,data.token);
          localStorage.setItem( "fullname" , data.fullname);
          localStorage.setItem("isAuthenticated", "true");
        })
        .then(() => navigate("/dashboard"))
        .catch((err) => setError(err))
        .finally(() => setLoading(false))


        //   localStorage.setItem("fullname", formValues.username);
        //   localStorage.setItem("isAuthenticated", "true");
      },
    });

    useEffect(() => {
    localStorage.clear();
    }, []);

  return (
    <Box className="login-page">
      {/* Left branding panel */}
      <Box className="login-brand-panel">
        <Box className="login-brand-logo">
          <FlightIcon sx={{ fontSize: 40, color: "#ea580c" }} />
          <span>AVIAGUARD</span>
        </Box>
        
        <p className="login-brand-tagline">
          Protect your fleet with <span>confidence</span>
        </p>
        
        <p className="login-brand-description">
          Enterprise aviation insurance built for modern operators. Get comprehensive 
          coverage, streamlined claims, and real-time risk management.
        </p>
        
        <Box className="login-brand-features">
          {FEATURES.map((feature, index) => (
            <Box key={index} className="login-feature-item">
              <Box className="login-feature-icon">{feature.icon}</Box>
              {feature.text}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box className="login-form-panel">
        <Box className="login-form-card">
          <Box className="login-form-header">
            <p className="login-form-title">Welcome back</p>
            <p className="login-form-subtitle">
              Sign in to access your dashboard
            </p>
          </Box>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              name="username"
              placeholder="Enter your username"
              variant="outlined"
              label="Username"
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username ? errors.username : null}
              fullWidth
            />

            <TextField
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              placeholder="Enter your password"
              variant="outlined"
              label="Password"
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password ? errors.password : null}
              fullWidth
            />

            <Button 
              variant="contained" 
              type="submit" 
              disabled={loading}
              className="login-submit-btn"
              fullWidth
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Box className="login-divider">or</Box>

          <Box className="login-footer">
            Don't have an account?{" "}
            <Link to="/user-signup">Create one</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
