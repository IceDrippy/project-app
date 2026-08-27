import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { number, object, string } from "yup";

import "./ManualAircraft-Search.css";

const RegistrySchema = object({
  year: number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("Enter a valid four-digit year")
    .integer("Year must be a whole number")
    .min(1903, "Year must be 1903 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the distant future")
    .required("Aircraft year is required"),
  make: string().trim().required("Aircraft make is required"),
  model: string().trim().required("Aircraft model is required"),
  engine_type: string().trim().required("Engine type is required"),
serial_number: string().trim().required("Aircraft serial number is required"),
});

export function ManualSignUp({ compSteps = [], addCompletedStep , updateRegistrationData }) {
  const navigate = useNavigate();

  const label = { slotProps: { input: { "aria-label": "Checkbox demo", readOnly: true } } };
  const steps = [
  { number: 1, label: "Aircraft", active: true },
  { number: 2, label: "Use Case", active: false },
  { number: 3, label: "Pilot", active: false },
  { number: 4, label: "Coverage", active: false },
  { number: 5, label: "Quote", active: false },
  ];

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } = useFormik({
  initialValues: {
    year :  "",
    make :  "",
    model : "",
    engine_type :  "",
    serial_number : "",
  },
  validationSchema: RegistrySchema,
  onSubmit: () => {
    updateRegistrationData?.({ ...values });
    addCompletedStep?.(1);
    navigate("/use-case");
  },
  });

  return (
  <form onSubmit={handleSubmit} className="signup-container">
    <header className="progress-header">
      <div className="steps-wrapper">
        {steps.map((step) => (
          <div key={step.number} className={`step-item ${step.active ? "active-step" : ""}`}>
            {compSteps.includes(step.number) ? (
              <Checkbox
                {...label}
                size="small"
                sx={{
                  color: "#1e293b",
                  "&.Mui-checked": {
                    color: "#1e293b",
                  },
                }}
                checked
              />
            ) : (
              <span className="step-number">{step.number}</span>
            )}

            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </header>

    <div className="sub-nav">
      <Button className="back-btn" variant="text" onClick={() => navigate("/aircraft")} size="small">
        <span className="arrow">‹</span> Back
      </Button>
      <div className="autosave-status">
        <span className="green-dot"></span> Progress saved automatically
      </div>
    </div>

    <div className="wizard-card">
      <main className="form-fields">
      <h1 className="main-title">Enter Aircraft Details</h1>
      {Boolean(Object.keys(errors).length) && <Alert severity="error">Please correct the highlighted fields.</Alert>}

      <TextField
        label="Year"
        value={values.year}
        onChange={handleChange}
        onBlur={handleBlur}
        name="year"
        type="number"
        placeholder="2005"
        slotProps={{ htmlInput: { min: 1903, max: new Date().getFullYear() + 1 } }}
        variant="outlined"
        fullWidth
        error={Boolean(touched.year && errors.year)}
        helperText={touched.year && errors.year ? errors.year : null}
      />

      <TextField
        label="Make"
        value={values.make}
        onChange={handleChange}
        onBlur={handleBlur}
        name="make"
        placeholder="Boeing"
        variant="outlined"
        fullWidth
        error={Boolean(touched.make && errors.make)}
        helperText={touched.make && errors.make ? errors.make : null}
      />

      <TextField
        label="Model"
        value={values.model}
        onChange={handleChange}
        onBlur={handleBlur}
        name="model"
        placeholder="737"
        variant="outlined"
        fullWidth
        error={Boolean(touched.model && errors.model)}
        helperText={touched.model && errors.model ? errors.model : null}
      />

      <TextField
        label="Engine Type"
        value={values.engine_type}
        onChange={handleChange}
        onBlur={handleBlur}
        name="engine_type"
        placeholder="Turbofan"
        variant="outlined"
        fullWidth
        error={Boolean(touched.engine_type && errors.engine_type)}
        helperText={touched.engine_type && errors.engine_type ? errors.engine_type : null}
      />

      <TextField
        label="Serial Number"
        value={values.serial_number}
        onChange={handleChange}
        onBlur={handleBlur}
        name="serial_number"
        placeholder="12345JJ79T"
        variant="outlined"
        fullWidth
        error={Boolean(touched.serial_number && errors.serial_number)}
        helperText={touched.serial_number && errors.serial_number ? errors.serial_number : null}
      />
      </main>

    <footer className="action-footer">
      <Button
        className="submit-btn"
        variant="contained"
        sx={{
          backgroundColor: "#1b263b",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#151e2e",
          },
        }}
        type="submit"

      >
        Continue
      </Button>
    </footer>
    </div>
  </form>
  );
}

