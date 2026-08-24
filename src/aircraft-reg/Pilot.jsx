import {
  Alert,
  Box,
  Button,
  Checkbox,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WizardPage.css";

export function Pilot({ compSteps = [], addCompletedStep, registrationData = {}, updateRegistrationData }) {
  const navigate = useNavigate();

  const [pilotCert, setPilotCert] = useState(registrationData.pilotCert || "PPL License");
  const [medicalStatus, setMedicalStatus] = useState(registrationData.medicalStatus || "First Class - Active");
  const [hours, setHours] = useState(registrationData.hours || {
    total: "",
    retractable: "",
    multiEngine: "",
    makeModel: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");

  const label = {
    slotProps: { input: { "aria-label": "Completed step", readOnly: true } },
  };

  const hourTracker = [
    { id: "total", label: "Total Logged Flight Hours" },
    { id: "retractable", label: "Retractable Gear Hours" },
    { id: "multiEngine", label: "Multi-Engine Flight Hours" },
    { id: "makeModel", label: "Hours in Make/Model" },
  ];

  const hasHoursError = Number(hours.makeModel) > Number(hours.total);

  const handleContinue = () => {
    if (hasHoursError) {
      return;
    }

    updateRegistrationData?.({ pilotCert, medicalStatus, hours });
    if (typeof addCompletedStep === "function") {
      addCompletedStep(3);
    }
    navigate("/coverage");
  };

  const steps = [
    { number: 1, label: 'Aircraft', active: false},
    { number: 2, label: 'Use Case', active: false },
    { number: 3, label: 'Pilot', active: true },
    { number: 4, label: 'Coverage', active: false},
    { number: 5, label: 'Quote', active: false  },
  ];

  const handleHoursChange = (field) => (event) => {
    const value = event.target.value;
    setHours((current) => ({ ...current, [field]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > 2) {
      setUploadedFiles([]);
      setUploadError("You can upload up to 2 documents only.");
      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find((file) => !["application/pdf", "image/png", "image/jpeg"].includes(file.type));
    if (invalidFile) {
      setUploadedFiles([]);
      setUploadError("Please choose PDF, PNG, or JPG files only.");
      event.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFile) {
      setUploadedFiles([]);
      setUploadError("Each selected file must be smaller than 10MB.");
      event.target.value = "";
      return;
    }

    setUploadedFiles(selectedFiles.map((file) => file.name));
    setUploadError("");
    event.target.value = "";
  };

  return (
    <article className="signup-container">
       <header className="progress-header">
              <div className="steps-wrapper">
                {steps.map((step) => (
                  <div 
                    key={step.number} 
                    className={`step-item ${step.active ? 'active-step' : ''}`}
                  >
                                 {compSteps.includes(step.number) ? (
                                  <Checkbox
                                      {...label}
                                      size="small"
                                      sx={{
                                      color: '#1e293b',
                                      '&.Mui-checked': {
                                          color:'#1e293b',
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
              <Button className="back-btn" onClick={() => navigate("/use-case")} variant="text" size="small">
                <span className="arrow">‹</span> Back 
              </Button>
              <div className="autosave-status">
                <span className="green-dot"></span> Progress saved automatically
              </div>
            </div>
      

      <main>
        <div className="wizard-card">
          <Typography variant="h5" className="wizard-title">
          Pilot Logbook & Qualifications
          </Typography>
          <Typography variant="body2" className="wizard-subtitle">
          Underwriting rates rely heavily on flight hours and verified certifications.
          </Typography>

        <Box className="wizard-grid-two">
          <TextField
            select
            label="Pilot Cert Level"
            value={pilotCert}
            onChange={(event) => setPilotCert(event.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="PPL License">PPL License</MenuItem>
            <MenuItem value="CPL License">CPL License</MenuItem>
            <MenuItem value="ATPL License">ATPL License</MenuItem>
          </TextField>

          <TextField
            select
            label="Medical Status"
            value={medicalStatus}
            onChange={(event) => setMedicalStatus(event.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="First Class - Active">First Class - Active</MenuItem>
            <MenuItem value="Second Class">Second Class</MenuItem>
            <MenuItem value="Third Class">Third Class</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3 }}>
          {hourTracker.map((item) => (
            <Box key={item.id} className="wizard-row">
              <Typography variant="body2" className="wizard-field-label">
                {item.label}
              </Typography>

              <Box className="wizard-hours-box">
                <TextField
                  value={hours[item.id]}
                  onChange={handleHoursChange(item.id)}
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "6px 0 0 6px" },
                    "& input": { textAlign: "right", fontWeight: 700 },
                  }}
                />
                <Box className="wizard-hour-suffix">
                  <Typography variant="caption">Hrs</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {hasHoursError && (
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ bgcolor: "#fff7ed", color: "#c2410c", borderColor: "#ffedd5", mb: 4, borderRadius: 2 }}
          >
            Make/Model hours cannot exceed total logged flight hours.
          </Alert>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 1.5 }}>
          Upload Credentials
        </Typography>

        <Box className="wizard-upload-area">
          <Typography variant="h6" className="wizard-upload-icon">
            ⤴
          </Typography>
          <Typography variant="body2" className="wizard-upload-text">
            Drag & drop files here or <Box component="label" htmlFor="pilot-credential-upload" className="wizard-upload-link">browse</Box>
          </Typography>
          <input
            id="pilot-credential-upload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            onChange={handleFileChange}
            multiple
            hidden
          />
          <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
            Supports PDF, PNG, JPG (Max 10MB each, up to 2 files)
          </Typography>
          {uploadedFiles.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              {uploadedFiles.map((fileName) => (
                <Typography key={fileName} variant="body2" sx={{ color: "#166534", display: "block", fontWeight: 600 }}>
                  Selected: {fileName}
                </Typography>
              ))}
            </Box>
          )}
          {uploadError && (
            <Typography variant="body2" sx={{ color: "#b91c1c", display: "block", mt: 1 }}>
              {uploadError}
            </Typography>
          )}
        </Box>



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
          onClick={handleContinue}
          disabled={hasHoursError}
        >
          Continue
        </Button>
      </footer>
        </div>
      </main>

    </article>
      
  );
        
}
