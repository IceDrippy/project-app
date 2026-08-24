import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Checkbox, Chip, Divider, Stack, Typography } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { buildQuoteSummary } from "./quoteCalculator";
import "./WizardPage.css";

export function Quote({ compSteps = [], addCompletedStep, registrationData = {}, updateRegistrationData }) {
  const navigate = useNavigate();
  const label = { slotProps: { input: { "aria-label": "Checkbox demo", readOnly: true } } };
  const steps = [
    { number: 1, label: "Aircraft", active: false },
    { number: 2, label: "Use Case", active: false },
    { number: 3, label: "Pilot", active: false },
    { number: 4, label: "Coverage", active: false },
    { number: 5, label: "Quote", active: true },
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

  const aircraftLabel = [registrationData.year, registrationData.make, registrationData.model]
    .filter(Boolean)
    .join(" ") || "Aircraft details pending";
  const aircraftType = registrationData.aircraftType
    ? registrationData.aircraftType.charAt(0).toUpperCase() + registrationData.aircraftType.slice(1)
    : "Aircraft type pending";

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
              <Button className="back-btn" variant="text" onClick={() => navigate("/coverage")} size="small">
                <span className="arrow">‹</span> Back
              </Button>
              <div className="autosave-status">
                <span className="green-dot"></span> Progress saved automatically
              </div>
            </div>
      

      <Card className="wizard-card">
        <Typography variant="h5" className="wizard-title">
          Your Insurance Quote
        </Typography>
        <Typography variant="body2" className="wizard-subtitle">
          Based on your aircraft, pilot record, and coverage selections.
        </Typography>

        <Box
          sx={{
            background: "linear-gradient(135deg, #0c1220 0%, #1e3a5f 100%)",
            borderRadius: 3,
            p: 4,
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: "#60a5fa", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}>
              Estimated Premium
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "baseline" }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                {quoteSummary.monthlyLabel}
              </Typography>
              <Typography variant="body1" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                {quoteSummary.period}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
              Annual total: {quoteSummary.annualLabel || "R4,560/year"}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Chip
              icon={<CheckCircleIcon sx={{ color: "#fff !important", fontSize: 16 }} />}
              label={quoteSummary.tier}
              sx={{
                bgcolor: "#ea580c",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                height: 32,
                "& .MuiChip-icon": { ml: 1 },
              }}
            />
            <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 1 }}>
              Coverage Tier
            </Typography>
          </Box>
        </Box>


        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }}>
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2,
              borderColor: "#e5e7eb",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#0284c7", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>
              Hull Value
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mt: 1 }}>
              {quoteSummary.hullValue}
            </Typography>
          </Card>

          <Card
            variant="outlined"
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2,
              borderColor: "#e5e7eb",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#0284c7", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>
              Liability Limit
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mt: 1 }}>
              {quoteSummary.liability}
            </Typography>
          </Card>

          <Card
            variant="outlined"
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 2,
              borderColor: "#e5e7eb",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#0284c7", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>
              Deductible
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mt: 1 }}>
              {quoteSummary.deductible}
            </Typography>
          </Card>
        </Stack>

        <Divider sx={{ mb: 3 }} />

  
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              borderColor: "#e5e7eb",
              bgcolor: "#fafafa",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <NavigationIcon sx={{ color: "#0284c7", fontSize: 20, transform: "rotate(45deg)" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Aircraft Details
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Type</Typography>
                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{aircraftType}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Model</Typography>
                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{aircraftLabel}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>N-Number</Typography>
                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{registrationData.serialNum || "Not provided"}</Typography>
              </Box>
            </Stack>
          </Card>

          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              borderColor: "#e5e7eb",
              bgcolor: "#fafafa",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PersonIcon sx={{ color: "#0284c7", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Pilot Profile
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Certificate</Typography>
                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{registrationData.pilotCert || "PPL License"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Medical</Typography>
                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{registrationData.medicalStatus || "First Class - Active"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Total Hours</Typography>
                <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 600 }}>{Number(registrationData.hours?.total) || 0} hrs</Typography>
              </Box>
            </Stack>
          </Card>
        </Box>

        <footer className="action-footer">
          <Button
            variant="contained"
            onClick={() => {
              const isSignedIn =
                localStorage.getItem("isAuthenticated") === "true" &&
                Boolean(localStorage.getItem("fullname")?.trim());

              if (!isSignedIn) {
                localStorage.removeItem("isAuthenticated");
                navigate("/user-signup");
                return;
              }

              if (typeof addCompletedStep === "function") {
                addCompletedStep(5);
              }
              updateRegistrationData?.({ quoteSummary });
              navigate("/payment");
            }}
            className="wizard-primary-btn"
            sx={{ bgcolor: "#ea580c !important", "&:hover": { bgcolor: "#c2410c !important" } }}
          >
            Continue to Payment
          </Button>
        </footer>
      </Card>
    </Box>
  );
}
