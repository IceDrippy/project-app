import { Box, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppBarNav from "../AppBarNav";
import SingleEngineImage from "../assets/single-engine.jpg";
import TwinEngineImage from "../assets/twin-engine.jpg";
import LightJetImage from "../assets/light-jet.jpg";
import HelicopterImage from "../assets/helicopter.jpg";
import "./Aircrafts.css";

const FOOTER_COLUMNS = [
  { heading: "PLATFORM", links: ["Fleet Underwriting", "Risk Assessment", "Compliance Portal"] },
  { heading: "RESOURCES", links: ["Compliance Guides", "Aviation Act Act", "Claims Support"] },
  { heading: "COMPANY", links: ["About Us", "Partners", "Contact"] },
];

const imageByType = {
  single: SingleEngineImage,
  twin: TwinEngineImage,
  jet: LightJetImage,
  helicopter: HelicopterImage,
};

export default function Aircrafts({ aircrafts = [] }) {
  const navigate = useNavigate();

  return (
    <Box className="ag-page aircrafts-page">
      <AppBarNav />

      <Container maxWidth="lg" className="aircrafts-body">
        <Box className="aircrafts-header">
          <Box>
            <h1 className="ag-page-title">ALL AIRCRAFT</h1>
            <p className="ag-page-subtitle">Every aircraft registered in your fleet.</p>
          </Box>
          <Button variant="outlined" onClick={() => navigate("/aircraft")}>+ Add Aircraft</Button>
        </Box>

        <Box className="aircrafts-list">
          {aircrafts.map((aircraft) => (
            <Card key={aircraft.id} variant="outlined" className="aircraft-list-card">
              <Box component="img" src={imageByType[aircraft.picture] || imageByType.single} alt={aircraft.name} className="aircraft-list-image" />
              <CardContent className="aircraft-list-content">
                <p className="aircraft-list-title">{aircraft.name}</p>
                <p className="aircraft-list-type">{aircraft.aircraftType}</p>
                <Box className="aircraft-list-details">
                  <p><strong>Serial number:</strong> {aircraft.serialNum}</p>
                  <p><strong>Home base:</strong> {aircraft.homeBase}</p>
                  <p><strong>Usage:</strong> {aircraft.flightPurpose}</p>
                  <p><strong>Coverage tier:</strong> {aircraft.coverageTier}</p>
                </Box>
              </CardContent>
            </Card>
          ))}
          {aircrafts.length === 0 && (
            <Card variant="outlined" className="aircraft-empty-card">
              <p>No aircraft registered yet.</p>
              <Button variant="contained" onClick={() => navigate("/aircraft")}>Register aircraft</Button>
            </Card>
          )}
        </Box>
      </Container>

      <Box component="footer" className="ag-footer">
        <Container maxWidth="lg">
          <Box className="aircrafts-footer-grid">
            <Box>
              <Box className="ag-footer-brand">
                <Box className="aircrafts-footer-mark" aria-hidden="true" />
                <p className="ag-footer-name">AVIAGUARD</p>
              </Box>
              <p className="ag-footer-tagline">
                Enterprise aviation insurance underwriting, real-time risk compliance, and fleet protection tracking.
              </p>
            </Box>

            {FOOTER_COLUMNS.map((column) => (
              <Box key={column.heading}>
                <p className="ag-footer-heading">{column.heading}</p>
                {column.links.map((link) => (
                  <p className="ag-footer-link" key={link}>{link}</p>
                ))}
              </Box>
            ))}
          </Box>
          <Box className="ag-footer-bottom">
            <p className="ag-footer-copy">© 2026 AVIAGUARD Insurance & Risk Solutions. All rights reserved.</p>
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
