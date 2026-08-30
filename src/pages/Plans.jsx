import React from "react";
import {
  AppBar,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Toolbar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";
import SecurityIcon from "@mui/icons-material/Security";

import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./PlanComparison.css";

const PLANS = [
  {
    id: "standard",
    name: "Standard",
    shieldCount: 1,
    price: "R1,450",
    period: "/ year per aircraft",
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
    period: "/ year per aircraft",
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
    period: "/ year per aircraft",
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

export default function Plans() {
    const navigate = useNavigate();

    return (
        <Box className="ag-page">
        <AppBar position="static" color="inherit" elevation={0} className="ag-appbar">
          <Toolbar className="ag-toolbar">
            <Box className="ag-brand" onClick={() => navigate("/")}>
              <Box className="ag-logo-mark" />
              <p className="ag-brand-name">AVIAGUARD</p>
            </Box>

            <Box className="ag-nav">
              {[
                ["About", "/#capabilities"],
                ["Plans", "/plans"],
                ["Get a Quote", "/aircraft"],
                ["Contact Us", "/#footer"],
              ].map(([label, route]) => (
                <p key={label} className={`ag-nav-link ${label === "Plans" ? "ag-nav-link--active" : ""}`} onClick={() => navigate(route)}>
                  {label}
                </p>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button variant="contained" onClick={() => navigate("/user-signup")} >
                Sign Up
              </Button>
              <Button variant="text" onClick={() => navigate("/login")} >
                Login
              </Button>
            </Box>
          </Toolbar>
        </AppBar>


        <Box className="ag-body">
            <Container maxWidth="lg">

            <Box sx={{ marginBottom: 6 }}>
                <h1 className="ag-page-title">
                PLAN COMPARISON
                </h1>
                <p className="ag-page-subtitle">
                Compare standard aviation liability models, modify structural hull limits, and select active fleet
                structures.
                </p>
            </Box>


            <Grid container spacing={3} sx={{ marginBottom: 8 }}>
                {PLANS.map((plan) => (
                <Grid key={plan.id} size={{ xs: 12, md: 4 }}>
                    <Card
                    variant="outlined"
                    className={`ag-plan-card ${plan.active ? "ag-plan-card--active" : ""}`}
                    >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Box sx={{ display: 'flex', gap: '2px' }}>
                                {[...Array(plan.shieldCount)].map((_, i) => (
                                    <SecurityIcon key={i} sx={{ fontSize: '20px', color: '#ff6b35' }} />
                                ))}
                            </Box>
                            <h3 className="ag-plan-name">{plan.name}</h3>
                        </Box>

                        <p className="ag-plan-description">{plan.description}</p>

                        <Box className="ag-plan-features" sx={{ flex: 1 }}>
                        {plan.features.map((feature, idx) => (
                            <Box key={idx} className="ag-plan-feature">
                            <CheckCircleIcon className="ag-plan-feature-icon" />
                            <p className="ag-plan-feature-text">{feature}</p>
                            </Box>
                        ))}
                        </Box>

                        <Box className="ag-plan-pricing" sx={{ marginTop: 'auto' }}>
                        <p className="ag-plan-pricing-label">From</p>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <p className="ag-plan-price">
                            {plan.price}
                            </p>
                            <p className="ag-plan-pricing-period">/month</p>
                        </Box>
                        </Box>
                    </CardContent>
                    </Card>
                </Grid>
                ))}
            </Grid>
            </Container>
        </Box>


        <Box component="footer" className="ag-footer">
            <Container maxWidth="lg">
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }}>
                <Box className="ag-footer-brand">
                    <NavigationIcon className="ag-footer-mark" />
                    <p className="ag-footer-name">AVIAGUARD</p>
                </Box>
                <p className="ag-footer-tagline">
                    Enterprise aviation insurance underwriting, real-time risk compliance, and fleet protection
                    tracking.
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
                <p className="ag-footer-link ag-footer-link--inline">
                    Privacy Policy
                </p>
                <p className="ag-footer-link ag-footer-link--inline">
                    Terms of Use
                </p>
                </Box>
            </Box>
            </Container>
        </Box>
    </Box>
    );
}
