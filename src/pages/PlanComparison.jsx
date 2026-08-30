import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import AppBarNav from "../AppBarNav";
import { API_URL } from "../global";
import "./PlanComparison.css";

const FALLBACK_PLANS = [
  {
    id: "standard",
    name: "Standard",
    shieldCount: 1,
    price: "R1,450",
    period: "month",
    description: "Perfect for single piston aircraft operators needing basic liability limits & hull coverage.",
    features: [
      "R1M Standard Liability Protection",
      "R100k per passenger sublimit restriction",
      "Full ground/transit risk inclusion",
      "Digital credentialing log vaults",
      "AIG Aerospace co-secured backing",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    shieldCount: 2,
    price: "R3,240",
    period: "month",
    badge: "POPULAR",
    active: true,
    description: "Comprehensive protection for multi-engine turboprops and private light jet fleets.",
    features: [
      "R2M Professional Liability (No passenger cap)",
      "Premium Hull Replacement coverage options",
      "Global real-time transit transponder logs",
      "Manual underwriter reviews included",
      "Active fleet compliance profiles",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    shieldCount: 3,
    price: "R5,999",
    period: "month",
    description: "Premium comprehensive coverage with priority support and maximum liability limits for demanding operations.",
    features: [
      "R5M Premium Liability Protection",
      "Priority claims handling & 24/7 support",
      "All-risk hull & equipment coverage included",
      "Unlimited passenger & crew liability",
      "Executive risk team & loss prevention services",
    ],
  },
];

const FOOTER_COLUMNS = [
  {
    heading: "PLATFORM",
    links: ["Fleet Underwriting", "Risk Assessment", "Compliance Portal"],
  },
  {
    heading: "RESOURCES",
    links: ["Compliance Guides", "Aviation Act Act", "Claims Support"],
  },
  {
    heading: "COMPANY",
    links: ["About Us", "Partners", "Contact"],
  },
];

export default function CurrentPlan() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPlans = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/plans`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        const planList = Array.isArray(data) ? data : data.plans || [];
        setPlans(planList.length > 0 ? planList : FALLBACK_PLANS);
      } else {
        setPlans(FALLBACK_PLANS);
      }
    } catch (err) {
      // Offline or API endpoint not present - fallback gracefully
      setPlans(FALLBACK_PLANS);
      if (err.name !== "AbortError") {
        setError(err.message || "Unable to fetch live plans.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  return (
    <Box className="ag-page">
      <AppBarNav />

      <Box className="ag-body">
        <Container maxWidth="lg">
          <Box sx={{ marginBottom: 5 }}>
            <h1 className="ag-page-title">PLAN COMPARISON</h1>
            <p className="ag-page-subtitle">
              Compare standard aviation liability models, modify structural hull limits, and select active fleet structures.
            </p>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ marginBottom: 8 }}>
              {plans.map((plan) => {
                const shieldCount = Number(plan.shieldCount) || (plan.id === "premium" ? 3 : plan.id === "professional" ? 2 : 1);
                const features = Array.isArray(plan.features) ? plan.features : [];

                return (
                  <Grid key={plan.id || plan.name} size={{ xs: 12, md: 4 }}>
                    <Card
                      variant="outlined"
                      className={`ag-plan-card ${plan.active ? "ag-plan-card--active" : ""}`}
                    >
                      {plan.badge && (
                        <Box className="ag-plan-badge">
                          <span className="ag-plan-badge-text">{plan.badge}</span>
                        </Box>
                      )}

                      <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <Box sx={{ display: "flex", gap: "2px" }}>
                            {[...Array(shieldCount)].map((_, i) => (
                              <SecurityIcon key={i} sx={{ fontSize: "20px", color: "#ff6b35" }} />
                            ))}
                          </Box>
                          <h3 className="ag-plan-name">{plan.name}</h3>
                        </Box>

                        <p className="ag-plan-description">{plan.description}</p>

                        <Box className="ag-plan-features" sx={{ flex: 1, my: 2 }}>
                          {features.map((feature, idx) => (
                            <Box key={idx} className="ag-plan-feature" sx={{ display: "flex", alignItems: "flex-start", gap: 1, my: 1 }}>
                              <CheckCircleIcon sx={{ fontSize: 18, color: "#16a34a", mt: 0.2 }} />
                              <p className="ag-plan-feature-text" style={{ margin: 0, fontSize: 13.5 }}>
                                {feature}
                              </p>
                            </Box>
                          ))}
                        </Box>

                        <Box className="ag-plan-pricing" sx={{ marginTop: "auto", pt: 2, borderTop: "1px solid #f1f5f9" }}>
                          <p className="ag-plan-pricing-label" style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                            From
                          </p>
                          <Box sx={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                            <p className="ag-plan-price" style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                              {plan.price}
                            </p>
                            <p className="ag-plan-pricing-period" style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                              /{plan.period || "month"}
                            </p>
                          </Box>
                        </Box>

                        <Button
                          variant={plan.active ? "contained" : "outlined"}
                          onClick={() => navigate("/aircraft")}
                          fullWidth
                          sx={{
                            mt: 2.5,
                            bgcolor: plan.active ? "#ea580c !important" : undefined,
                            borderColor: !plan.active ? "#cbd5e1" : undefined,
                            color: plan.active ? "#ffffff" : "#0f172a",
                            "&:hover": {
                              bgcolor: plan.active ? "#c2410c !important" : "#f8fafc",
                            },
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            py: 1,
                          }}
                        >
                          Select {plan.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" className="ag-footer">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box className="ag-footer-brand">
                <NavigationIcon className="ag-footer-mark" />
                <p className="ag-footer-name">AVIAGUARD</p>
              </Box>
              <p className="ag-footer-tagline">
                Enterprise aviation insurance underwriting, real-time risk compliance, and fleet protection tracking.
              </p>
            </Grid>

            {FOOTER_COLUMNS.map((col) => (
              <Grid key={col.heading} size={{ xs: 6, md: 2.33 }}>
                <p className="ag-footer-heading">{col.heading}</p>
                {col.links.map((link) => (
                  <p className="ag-footer-link" key={link}>
                    {link}
                  </p>
                ))}
              </Grid>
            ))}
          </Grid>

          <Box className="ag-footer-bottom">
            <p className="ag-footer-copy">
              © 2026 AVIAGUARD Insurance & Risk Solutions. All rights reserved.
            </p>
            <Box className="ag-footer-legal">
              <p className="ag-footer-link ag-footer-link--inline">Privacy Policy</p>
              <p className="ag-footer-link ag-footer-link--inline">Terms of Use</p>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
