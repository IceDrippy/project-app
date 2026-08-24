import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { buildQuoteSummary } from "./quoteCalculator";
import "./WizardPage.css";

export function Payment({ compSteps = [], addCompletedStep, registrationData = {}, addAircraft, resetRegistrationFlow }) {
  const navigate = useNavigate();
  const label = { slotProps: { input: { "aria-label": "Checkbox demo", readOnly: true } } };

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, label: "Aircraft", active: false },
    { number: 2, label: "Use Case", active: false },
    { number: 3, label: "Pilot", active: false },
    { number: 4, label: "Coverage", active: false },
    { number: 5, label: "Quote", active: false },
    { number: 6, label: "Payment", active: true },
  ];

  const quoteSummary = buildQuoteSummary({
    hullValue: registrationData.hullValue || 450000,
    selectedTier: registrationData.selectedTier || "professional",
    flightPurpose: registrationData.flightPurpose || "Pleasure and Buisness",
    storage: registrationData.storage || "Hangar",
    totalHours: Number(registrationData.hours?.total) || 0,
    certLevel: registrationData.pilotCert || "PPL License",
    medicalStatus: registrationData.medicalStatus || "First Class - Active",
    deductible: 2500,
  });

  const aircraftLabel =
    [registrationData.year, registrationData.make, registrationData.model]
      .filter(Boolean)
      .join(" ") || "Aircraft details pending";

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const validate = () => {
    const nextErrors = {};
    if (!cardName.trim()) nextErrors.cardName = "Name on card is required";
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      nextErrors.cardNumber = "Enter a valid 16-digit card number";
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) nextErrors.expiry = "Use MM/YY format";
    if (cvv.length < 3) nextErrors.cvv = "Enter a valid CVV";
    if (!billingZip.trim()) nextErrors.billingZip = "Billing postal code is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const isSignedIn = localStorage.getItem("isAuthenticated") === "true";
    if (!isSignedIn) {
      navigate("/user-signup");
      return;
    }

    if (typeof addCompletedStep === "function") {
      addCompletedStep(6);
    }

    if (typeof addAircraft === "function") {
      addAircraft({
        name: aircraftLabel !== "Aircraft details pending" ? aircraftLabel : "Unnamed aircraft",
        aircraftType: registrationData.aircraftType || "Not provided",
        serialNum: registrationData.serialNum || "Not provided",
        homeBase: registrationData.homeBase || "Not provided",
        flightPurpose: registrationData.flightPurpose || "Not provided",
        coverageTier: quoteSummary.tier,
        hullValue: registrationData.hullValue || 450000,
        picture: registrationData.aircraftType || "single",
      });
    }

    if (typeof resetRegistrationFlow === "function") {
      resetRegistrationFlow();
    }

    navigate("/dashboard");
  };

  return (
    <Box className="signup-container">
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
        <Button className="back-btn" variant="text" onClick={() => navigate("/quote")} size="small">
          <span className="arrow">‹</span> Back
        </Button>
        <div className="autosave-status">
          <span className="green-dot"></span> Progress saved automatically
        </div>
      </div>

      <Card className="wizard-card">
        <Typography variant="h5" className="wizard-title">
          Payment Details
        </Typography>
        <Typography variant="body2" className="wizard-subtitle">
          Secure checkout for your aircraft insurance policy.
        </Typography>

        <Box className="payment-layout">
          <Box className="payment-form-column">
            <Box className="payment-section-heading">
              <CreditCardIcon sx={{ color: "#0284c7", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Card Information
              </Typography>
            </Box>

            <Box className="payment-field">
              <Typography className="payment-field-label">Name on Card</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Jane Pilot"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                error={Boolean(errors.cardName)}
                helperText={errors.cardName}
              />
            </Box>

            <Box className="payment-field">
              <Typography className="payment-field-label">Card Number</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                error={Boolean(errors.cardNumber)}
                helperText={errors.cardNumber}
              />
            </Box>

            <Box className="payment-field-row">
              <Box className="payment-field">
                <Typography className="payment-field-label">Expiry Date</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  error={Boolean(errors.expiry)}
                  helperText={errors.expiry}
                />
              </Box>

              <Box className="payment-field">
                <Typography className="payment-field-label">CVV</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  error={Boolean(errors.cvv)}
                  helperText={errors.cvv}
                />
              </Box>
            </Box>

            <Box className="payment-field">
              <Typography className="payment-field-label">Billing Postal Code</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="8001"
                value={billingZip}
                onChange={(e) => setBillingZip(e.target.value)}
                error={Boolean(errors.billingZip)}
                helperText={errors.billingZip}
              />
            </Box>

            <Box className="payment-secure-note">
              <LockIcon sx={{ fontSize: 16, color: "#64748b" }} />
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Your payment information is encrypted and processed securely.
              </Typography>
            </Box>
          </Box>

          <Box className="payment-summary-column">
            <Card variant="outlined" className="payment-summary-card">
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                Order Summary
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>Aircraft</Typography>
                  <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{aircraftLabel}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>Coverage Tier</Typography>
                  <Chip
                    icon={<CheckCircleIcon sx={{ color: "#fff !important", fontSize: 14 }} />}
                    label={quoteSummary.tier}
                    size="small"
                    sx={{ bgcolor: "#ea580c", color: "#fff", fontWeight: 700, fontSize: "12px" }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>Deductible</Typography>
                  <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{quoteSummary.deductible}</Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Due Today</Typography>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: "baseline" }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {quoteSummary.monthlyLabel}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>{quoteSummary.period}</Typography>
                </Stack>
              </Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
                Annual total: {quoteSummary.annualLabel || "R4,560/year"}
              </Typography>
            </Card>
          </Box>
        </Box>

        <footer className="action-footer">
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="wizard-primary-btn"
            sx={{ bgcolor: "#ea580c !important", "&:hover": { bgcolor: "#c2410c !important" } }}
          >
            Confirm & Pay {quoteSummary.monthlyLabel}
          </Button>
        </footer>
      </Card>
    </Box>
  );
}

