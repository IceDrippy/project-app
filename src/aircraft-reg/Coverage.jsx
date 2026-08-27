import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Checkbox, Chip, Slider, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./WizardPage.css";

export function Coverage({ compSteps = [], addCompletedStep, updateRegistrationData }) {
  const navigate = useNavigate();

  const [hullValue, setHullValue] = useState(450000);
  const [selectedTier, setSelectedTier] = useState("professional");
  const label = { slotProps: { input: { 'aria-label': 'Checkbox demo', 'readOnly': true } } };
  const steps = [
    { number: 1, label: 'Aircraft', active: false},
    { number: 2, label: 'Use Case', active: false },
    { number: 3, label: 'Pilot', active: false  },
    { number: 4, label: 'Coverage', active: true},
    { number: 5, label: 'Quote', active: false  },
  ];


  const tiers = [
    {
      value: "standard",
      title: "Standard",
      description: "R1,000,000 Total Limit / R100,000 per-passenger sub-limit restriction.",
      price: "From R280/mo",
    },
    {
      value: "professional",
      title: "Professional",
      description: "R1,000,000 comprehensive limit with zero per-passenger sub-limits.",
      price: "From R380/mo",
    },
    {
      value: "premium",
      title: "Premium",
      description: "Custom commercial liability coverage limits scalable up to R10,000,000+.",
      price: "Custom quote",
    },
  ];

  return (
    <Box className="signup-container">
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
              <Button className="back-btn" onClick={() => navigate("/pilot")} variant="text" size="small">
                <span className="arrow">‹</span> Back 
              </Button>
              <div className="autosave-status">
                <span className="green-dot"></span> Progress saved automatically
              </div>
            </div>

      <Card className="wizard-card">
        <Typography variant="h5" className="wizard-title">
          Select Your Coverage Limits
        </Typography>
        <Typography variant="body2" className="wizard-subtitle">
          Customize your structural policy tiers and hull damage valuation.
        </Typography>

  
        <Box sx={{ 
          bgcolor: "#f8fafc", 
          borderRadius: 2, 
          p: 3, 
          mb: 4,
          border: "1px solid #e5e7eb"
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Insured Hull Value
            </Typography>
            <Chip 
              label={`R${hullValue.toLocaleString()} ZAR`}
              sx={{ 
                bgcolor: "#0284c7", 
                color: "#fff", 
                fontWeight: 700,
                fontSize: "14px",
                height: 32
              }} 
            />
          </Box>

          <Slider
            value={hullValue}
            min={100000}
            max={1000000}
            step={25000}
            onChange={(_, value) => setHullValue(value)}
            sx={{
              height: 8,
              color: "#0284c7",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 22,
                height: 22,
                backgroundColor: "#fff",
                border: "3px solid currentColor",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(2, 132, 199, 0.16)",
                },
              },
              "& .MuiSlider-rail": {
                bgcolor: "#e2e8f0",
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
              R100,000
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
              R1,000,000
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
          Liability Protection Tiers
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
          {tiers.map((tier) => (
            <Card
              key={tier.value}
              variant="outlined"
              onClick={() => setSelectedTier(tier.value)}
              sx={{
                p: 2.5,
                borderRadius: 2,
                cursor: "pointer",
                position: "relative",
                borderColor: selectedTier === tier.value ? "#0284c7" : "#e2e8f0",
                bgcolor: selectedTier === tier.value ? "#f0f9ff" : "#fff",
                borderWidth: selectedTier === tier.value ? 2 : 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: selectedTier === tier.value ? "#0284c7" : "#94a3b8",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {tier.badge && (
                <Chip
                  label={tier.badge}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: 12,
                    bgcolor: "#0284c7",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    height: 22,
                  }}
                />
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    {selectedTier === tier.value && (
                      <CheckCircleIcon sx={{ color: "#0284c7", fontSize: 20 }} />
                    )}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      {tier.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", maxWidth: 400 }}>
                    {tier.description}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#0284c7", whiteSpace: "nowrap" }}>
                  {tier.price}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>

        

        <footer className="action-footer">
          <Button
            className="submit-btn"
            variant="contained"
            sx={{ bgcolor: "#ea580c !important", "&:hover": { bgcolor: "#c2410c !important" } }}
            onClick={() => {
              updateRegistrationData?.({ hullValue, selectedTier });
              if (typeof addCompletedStep === "function") {
                addCompletedStep(4);
              }
              navigate("/quote");
            }}
          >
            Generate a Quote
          </Button>
        </footer>
       
      </Card>
    </Box>
  );
}
