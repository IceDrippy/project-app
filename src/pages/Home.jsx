import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import PieChartIcon from "@mui/icons-material/PieChart";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import NavigationIcon from "@mui/icons-material/Navigation";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["About", "Plans", "Get a Quote", "Contact Us"];
const NAV_ROUTES = {
  About: "#capabilities",
  Plans: "/plans",
  "Get a Quote": "/aircraft",
  "Contact Us": "#footer",
};

const CAPABILITIES = [
  {
    icon: <GpsFixedIcon fontSize="small" />,
    title: "Aircraft Tracking",
    body: "Real-time transponder monitoring paired with global atmospheric alerts to secure active transit profiles.",
  },
  {
    icon: <PieChartIcon fontSize="small" />,
    title: "Risk Assessment",
    body: "Algorithmic indexing evaluating airframe fatigue, operational history, and crew safety ratings instantly.",
  },
  {
    icon: <BadgeOutlinedIcon fontSize="small" />,
    title: "Credentialing",
    body: "Secure digital document vaults certifying pilot ratings, medical clearance, and aircraft logs dynamically.",
  },
  {
    icon: <VerifiedUserOutlinedIcon fontSize="small" />,
    title: "Coverage Overview",
    body: "Clean, granular policies mapped explicitly across airframes, third-party liability, and regional hangars.",
  },
];

const STATS = [
  { value: "500+", label: "AIRCRAFT MONITORED" },
  { value: "99.8%", label: "COMPLIANCE RATE" },
  { value: "24/7", label: "UNDERWRITING SUPPORT" },
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
    links: ["About Us ", " Partners", "Contact", "Coverage","Settings"],
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box className="ag-page">

      <AppBar position="static" color="inherit" elevation={0} className="ag-appbar">
        <Toolbar className="ag-toolbar">
          <Box className="ag-brand" sx={{ cursor: 'pointer' }}>
            <Box className="ag-logo-mark" />
            <p className="ag-brand-name">AVIAGUARD</p>
          </Box>

          <Box className="ag-nav">
            {NAV_LINKS.map((label) => (
              <p key={label} className={`ag-nav-link ${label === "Dashboard" ? "ag-nav-link--active" : ""}`} onClick={() => { const route = NAV_ROUTES[label]; if (route.startsWith("#")) { document.querySelector(route)?.scrollIntoView({ behavior: "smooth" }); } else { navigate(route); } }}>
                {label}
              </p>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="contained" onClick={() => navigate('/user-signup')} >Sign Up</Button>
            <Button variant="text" onClick={() => navigate('/login')} >Login</Button>

          </Box>
        </Toolbar>
      </AppBar>


      <Container maxWidth="lg" className="ag-hero">
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <h1 className="ag-hero-title">
              AVIATION RISK MANAGEMENT, SIMPLIFIED
            </h1>
            <p className="ag-hero-subtitle">
              Protecting your global fleets, ensuring active regulatory compliance,
              and unlocking smart premiums with advanced real-time diagnostic risk
              profiles.
            </p>
            <Box className="ag-hero-actions">
              <Button variant="contained" disableElevation className="ag-btn-primary" onClick={() => navigate('/user-signup')}>
                Get Started
              </Button>
              <Button variant="outlined" className="ag-btn-secondary" onClick={() => navigate('/plans')}>
                View Pricing
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              className="ag-hero-image"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop)",
              }}
            />
          </Grid>
        </Grid>
      </Container>


      <Box id="capabilities" className="ag-capabilities">
        <Container maxWidth="lg">
          <p className="ag-eyebrow">ENTERPRISE CAPABILITIES</p>
          <h2 className="ag-section-title">
            ENGINEERED FOR MODERN FLEET SAFETY
          </h2>

          <Grid container spacing={3} className="ag-capabilities-grid">
            {CAPABILITIES.map((cap) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cap.title}>
                <Card variant="outlined" className="ag-capability-card">
                  <CardContent>
                    <Box className="ag-capability-icon">{cap.icon}</Box>
                    <p className="ag-capability-title">{cap.title}</p>
                    <p className="ag-capability-body">{cap.body}</p>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats band */}
      <Box className="ag-stats">
        <Container maxWidth="lg">
          <Grid container>
            {STATS.map((stat) => (
              <Grid size={{ xs: 12, sm: 4 }} key={stat.label} className="ag-stat">
                <p className="ag-stat-value">{stat.value}</p>
                <p className="ag-stat-label">{stat.label}</p>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box id="footer" component="footer" className="ag-footer">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box className="ag-footer-brand">
                <NavigationIcon className="ag-footer-mark" />
                <p className="ag-footer-name">AVIAGUARD</p>
              </Box>
              <p className="ag-footer-tagline">
                Enterprise aviation insurance underwriting, real-time risk
                compliance, and fleet protection tracking.
              </p>
            </Grid>

            {FOOTER_COLUMNS.map((col) => (
              <Grid size={{ xs: 6, md: 2.33 }} key={col.heading}>
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
