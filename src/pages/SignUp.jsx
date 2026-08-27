import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from "@mui/material/TextField";
import FlightIcon from "@mui/icons-material/Flight";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { object, string } from "yup";
import "./SignUp.css";
import { API_URL } from "../global";

const RegistrySchema = object({
    fullname: string().required("Full Name is required"),
    email : string().required(),
    gender: string().required("Gender is required"),
    username: string().required("Username is required"),
    password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const STEPS = [
  { number: "1", title: "Create your account", desc: "Enter your details below" },
  { number: "2", title: "Register your aircraft", desc: "Add your fleet information" },
  { number: "3", title: "Get instant coverage", desc: "Receive tailored quotes in minutes" },
];

export function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      fullname: "",
      gender: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema: RegistrySchema,
    onSubmit: (formValues) => {
      setError("");
      setLoading(true);
      fetch(`${API_URL}/auth/signup`,{
        method : "POST",
        body: JSON.stringify(formValues),
        headers:{
          "Content-Type":"application/json"
        }
      })
      .then((res) => res.ok ? res.json():Promise.reject("Access Denied"))
      .then(() => navigate ("/login"))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
    }

  });

  return (
    <Box className="signup-page">
      
      <Box className="signup-brand-panel">
        <Box className="signup-brand-logo">
          <FlightIcon sx={{ fontSize: 40, color: "#ea580c" }} />
          <span>AVIAGUARD</span>
        </Box>
        
        <p className="signup-brand-tagline">
          Join the future of <span>aviation insurance</span>
        </p>
        
        <p className="signup-brand-description">
          Get started in minutes. Our streamlined onboarding process gets you 
          protected fast with enterprise-grade coverage.
        </p>
        
        <Box className="signup-brand-steps">
          {STEPS.map((step) => (
            <Box key={step.number} className="signup-step-item">
              <Box className="signup-step-number">{step.number}</Box>
              <Box className="signup-step-content">
                <p className="signup-step-title">{step.title}</p>
                <p className="signup-step-desc">{step.desc}</p>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box className="signup-form-panel">
        <Box className="signup-form-card">
          <Box className="signup-form-header">
            <p className="signup-form-title">Create your account</p>
            <p className="signup-form-subtitle">
              Start protecting your fleet today
            </p>
          </Box>

          <form onSubmit={handleSubmit} className="signup-form">

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Full Name"
              value={values.fullname}
              onChange={handleChange} 
              onBlur={handleBlur}
              name="fullname"
              placeholder="John Doe"
              variant="outlined"
              fullWidth
              error={Boolean(touched.fullName && errors.fullName)}
              helperText={touched.fullName && errors.fullName ? errors.fullName : null}
            />

            <TextField
              label="Username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              name="username" 
              placeholder="johndoe"
              variant="outlined"
              fullWidth
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username ? errors.username : null}
            />

            <TextField
              label="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              placeholder="john.doe@example.com"
              variant="outlined"
              fullWidth
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email ? errors.email : null}
            />

            <TextField
              label="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              placeholder="••••••••"
              variant="outlined"
              fullWidth
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password ? errors.password : null}
            />

            <FormControl error={Boolean(touched.gender && errors.gender)}>
              <FormLabel id="gender-label">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="gender-label"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                row
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
              </RadioGroup>
              {touched.gender && errors.gender ? <FormHelperText>{errors.gender}</FormHelperText> : null}
            </FormControl>

            <Button
              className="signup-submit-btn"
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <Box className="signup-divider">or</Box>

          <Box className="signup-footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

