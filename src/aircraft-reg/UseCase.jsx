import { useNavigate } from "react-router-dom";
import "./UseCase.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { useState } from "react";
import { TextField } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import SchoolIcon from "@mui/icons-material/School";
import WarehouseIcon from "@mui/icons-material/Warehouse";

export function UseCase({ compSteps = [], addCompletedStep, registrationData = {}, updateRegistrationData }) {
  const navigate = useNavigate();

  const label = { slotProps: { input: { "aria-label": "Checkbox demo", readOnly: true } } };
  const steps = [
    { number: 1, label: "Aircraft", active: false },
    { number: 2, label: "Use Case", active: true },
    { number: 3, label: "Pilot", active: false },
    { number: 4, label: "Coverage", active: false },
    { number: 5, label: "Quote", active: false },
  ];

  const flightPurposes = [
    { purpose: "Pleasure and Buisness", description: "Personal flying and non-commercial buisness trips", icon: FlightTakeoffIcon },
    { purpose: "Industrial Aid", description: "Corporate transport flown by pro pilots", icon: BusinessCenterIcon },
    { purpose: "Commercial Charter", description: "Part 135 on-demand passenger/cargo", icon: LandscapeIcon },
    { purpose: "Instruction & Rental", description: "Flight school or club aircraft rental", icon: SchoolIcon },
  ];

  const storageOptions = [
    { label: "Hangar", icon: WarehouseIcon },
    { label: "Tiedown", icon: LandscapeIcon },
    { label: "Maintained Ramp", icon: LocalParkingIcon },
  ];
  const [storage, setStorage] = useState(registrationData.storage || "");
  const [homeBase, setHomeBase] = useState(registrationData.homeBase || "");
  const [flightPurpose, setSelectedPurpose] = useState(registrationData.flightPurpose || null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const normalizedHomeBase = homeBase.trim().toUpperCase();

    if (!flightPurpose) {
      nextErrors.flightPurpose = "Select the primary purpose of flight.";
    }

    if (!normalizedHomeBase) {
      nextErrors.homeBase = "Home airport base is required.";
    } else if (!/^[A-Z]{3,4}$/.test(normalizedHomeBase)) {
      nextErrors.homeBase = "Enter a valid 3 or 4-letter ICAO/FAA airport code.";
    }

    if (!storage) {
      nextErrors.storage = "Select where the aircraft is parked.";
    }

    return nextErrors;
  };

  const handleContinue = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    updateRegistrationData?.({ flightPurpose, storage, homeBase: homeBase.trim().toUpperCase() });
    addCompletedStep?.(2);
    navigate("/pilot");
  };

  return (
    <article className="signup-container">
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
        <Button className="back-btn" variant="text" onClick={() => navigate("/manual")} size="small">
          <span className="arrow">‹</span> Back
        </Button>
        <div className="autosave-status">
          <span className="green-dot"></span> Progress saved automatically
        </div>
      </div>

      <div className="wizard-card">
        <main className="form-content">
        <h1 className="main-title">Aircraft Operation & Storage</h1>
        <p className="subtitle">help us understand your flight profile and regional risk factors.</p>

        <section className="input-group">
          <div className="purpose-container">
            <h4>Primary Purpose of Flight</h4>
            <div className="purpose-options">
              {flightPurposes.map((purpose) => {
                const isSelected = flightPurpose === purpose.purpose;
                const PurposeIcon = purpose.icon;

                return (
                  <button
                    type="button"
                    key={purpose.purpose}
                    className={`option-card ${isSelected ? "selected" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedPurpose(purpose.purpose);
                      setErrors((current) => ({ ...current, flightPurpose: undefined }));
                    }}
                  >
                    <span className="option-card-heading">
                      <PurposeIcon className="option-card-icon" aria-hidden="true" />
                      <h2>{purpose.purpose === "Pleasure and Buisness" ? "Pleasure and Business" : purpose.purpose}</h2>
                    </span>
                    <p>{purpose.description.replace("buisness", "business")}</p>
                  </button>
                );
              })}
            </div>
            {errors.flightPurpose && <p className="validation-error">{errors.flightPurpose}</p>}
          </div>

          <div className="base-container">
            <h4>Home Airport Base</h4>
            <TextField
              variant="outlined"
              onChange={(event) => {
                setHomeBase(event.target.value.toUpperCase());
                setErrors((current) => ({ ...current, homeBase: undefined }));
              }}
              value={homeBase}
              placeholder="Base"
              className="registration-input"
              fullWidth
              error={Boolean(errors.homeBase)}
              helperText={errors.homeBase || "Enter a 3 or 4-letter ICAO/FAA code (e.g. KLAX, KOSH)."}
              slotProps={{ htmlInput: { maxLength: 4 } }}
            />
          </div>

          <div className="aircraft-storage-container">
            <label className="input-label">Where is the aircraft parked?</label>
            <div className="aircraft-storage">
              {storageOptions.map((option) => {
                const isSelected = storage === option.label;
                const StorageIcon = option.icon;

                return (
                  <button
                    type="button"
                    key={option.label}
                    className={`option-card ${isSelected ? "selected" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setStorage(option.label);
                      setErrors((current) => ({ ...current, storage: undefined }));
                    }}
                  >
                    <span className="option-card-heading">
                      <StorageIcon className="option-card-icon" aria-hidden="true" />
                      <span>{option.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.storage && <p className="validation-error">{errors.storage}</p>}
          </div>
        </section>
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
          onClick={handleContinue}
        >
          Continue
        </Button>
      </footer>
      </div>
    </article>
  );
}