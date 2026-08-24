import React from "react";
import {
  Box,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonIcon from "@mui/icons-material/Person";
import NavigationIcon from "@mui/icons-material/Navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBarNav from "../AppBarNav";
import SingleEngineImage from "../assets/single-engine.jpg";
import TwinEngineImage from "../assets/twin-engine.jpg";
import LightJetImage from "../assets/light-jet.jpg";
import HelicopterImage from "../assets/helicopter.jpg";
import "./Dashboard.css";

const AIRCRAFT_IMAGES = {
  single: SingleEngineImage,
  twin: TwinEngineImage,
  jet: LightJetImage,
  helicopter: HelicopterImage,
};

const FOOTER_COLUMNS = [
  { heading: "PLATFORM", links: ["Fleet Underwriting", "Risk Assessment", "Compliance Portal"] },
  { heading: "RESOURCES", links: ["Compliance Guides", "Aviation Act Act", "Claims Support"] },
  { heading: "COMPANY", links: ["About Us", "Partners", "Contact"] },
];

export default function Dashboard({ aircrafts = [] }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const gender = state?.gender || localStorage.getItem("selectedGender") || "";
  const fullname = state?.fullname || localStorage.getItem("fullname") || "";
  const totalAircraftValue = aircrafts.reduce(
    (total, aircraft) => total + Number(aircraft.hullValue || 0),
    0,
  );

  return (
    <Box className="ag-page">
      <AppBarNav gender={gender} />

      <Container maxWidth="lg" className="ag-body">
        <Box className="ag-page-head">
          <Box>
            <h1 className="ag-page-title">
              WELCOME BACK {fullname}
            </h1>
            
            <p className="ag-page-subtitle">
              Fleet overview for {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date())}.
            </p>
          </Box>
        </Box>

        <Grid container spacing={2.5} className="ag-top-panels">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" className="ag-head-panel">
              <CardContent>
                <p className="ag-panel-title">COVERAGE SUMMARY</p>
                <Box className="ag-head-panel-value">
                  <ShieldOutlinedIcon className="ag-detail-icon" />
                  <p className="ag-detail-value">
                    {aircrafts.length ? `${aircrafts.length} active policies` : "0 active policies"}
                  </p>
                </Box>
                <Chip
                  label={aircrafts.length ? "In progress" : "Not started"}
                  size="small"
                  className={aircrafts.length ? "ag-chip-positive" : "ag-chip-muted"}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" className="ag-head-panel">
              <CardContent>
                <p className="ag-panel-title">RECENT CLAIM</p>
                <Box className="ag-head-panel-value">
                  <DescriptionOutlinedIcon className="ag-detail-icon" />
                  <p className="ag-detail-value">No claims filed</p>
                </Box>
                <Chip label="Clear" size="small" className="ag-chip-positive" />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" className="ag-head-panel">
              <CardContent>
                <p className="ag-panel-title">PILOT DETAILS</p>
                <Box className="ag-head-panel-value">
                  <PersonIcon className="ag-detail-icon" />
                  <p className="ag-detail-value">{fullname || "Profile pending"}</p>
                </Box>
                <p className="ag-detail-meta">Certification pending</p>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" className="ag-head-panel">
              <CardContent>
                <p className="ag-panel-title">TOTAL AIRCRAFT VALUE</p>
                <Box className="ag-head-panel-value">
                  <NavigationIcon className="ag-detail-icon" />
                  <p className="ag-detail-value">
                    R{totalAircraftValue.toLocaleString()}
                  </p>
                </Box>
                <Chip
                  label={aircrafts.length ? `${aircrafts.length} registered` : "No aircraft yet"}
                  size="small"
                  className={aircrafts.length ? "ag-chip-positive" : "ag-chip-muted"}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2.5} className="ag-main-grid">
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" className="ag-panel">
              <CardContent>
                <p className= "ag-page-div">
                  <span className="ag-panel-title">My Aircrafts</span>
                  <Button variant="outlined" size="small" onClick={() => navigate("/aircraft")} className="ag-panel-btn">+ Add Aircraft</Button>
                </p>

                <Table className="ag-table">

                  <TableBody>
                    {aircrafts.map((aircraft) => (
                      <TableRow key={aircraft.id}>
                        <TableCell>
                          <Box
                            component="img"
                            src={AIRCRAFT_IMAGES[aircraft.picture] || AIRCRAFT_IMAGES.single}
                            alt={`${aircraft.aircraftType} aircraft`}
                            className="ag-aircraft-table-image"
                          />
                        </TableCell>
                        <TableCell>Aircraft: {aircraft.aircraftType}</TableCell>
                        <TableCell>Home Base: {aircraft.homeBase}</TableCell>
                        <TableCell>Usage: {aircraft.flightPurpose}</TableCell>
                        <TableCell>Coverage Tier: {aircraft.coverageTier}</TableCell>
                      </TableRow>
                    ))}
                    {aircrafts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="ag-empty-cell">No aircraft registered yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Box
                  component={Link}
                  to="/aircrafts"
                  className="ag-aircrafts-link"
                  sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: "#0f172a", textDecoration: "none", cursor: "pointer" }}
                >
                  View all aircrafts
                  <ArrowForwardIcon fontSize="small" aria-hidden="true" />
                </Box>

                
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>

      <Box component="footer" className="ag-footer">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box className="ag-footer-brand">
                <NavigationIcon className="ag-footer-mark" />
                <p className="ag-footer-name">AVIAGUARD</p>
              </Box>
              <p className="ag-footer-tagline">
                Enterprise aviation insurance underwriting, real-time risk compliance, and fleet
                protection tracking.
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
              <p className="ag-footer-link ag-footer-link--inline">Privacy Policy</p>
              <p className="ag-footer-link ag-footer-link--inline">Terms of Use</p>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
