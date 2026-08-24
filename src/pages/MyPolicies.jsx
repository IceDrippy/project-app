import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";
import SecurityIcon from "@mui/icons-material/Security";
import ShieldIcon from "@mui/icons-material/Shield";
import { useNavigate } from "react-router-dom";
import AppBarNav from "../AppBarNav";
import "./MyPolicies.css";

const COVERAGE_TIERS = {
  smooth: {
    label: "Smooth Skies",
    color: "#0284c7",
    bg: "#e0f2fe",
    features: ["Hull Coverage", "Liability R1M", "Medical R100K"],
  },
  crosswind: {
    label: "Crosswind",
    color: "#7c3aed",
    bg: "#ede9fe",
    features: ["Hull Coverage", "Liability R2M", "Medical R250K", "Ground Risk"],
  },
  fullthrottle: {
    label: "Full Throttle",
    color: "#ea580c",
    bg: "#fff7ed",
    features: ["Hull Coverage", "Liability R5M", "Medical R500K", "Ground Risk", "Worldwide"],
  },
};

const SUMMARY_CARDS = [
  {
    label: "ACTIVE POLICIES",
    icon: <ShieldIcon />,
    color: "#22c55e",
    getValue: (aircrafts) => aircrafts.length,
    suffix: "aircraft covered",
  },
  {
    label: "TOTAL HULL VALUE",
    icon: <NavigationIcon />,
    color: "#0284c7",
    getValue: (aircrafts) =>
      `R${aircrafts.reduce((sum, a) => sum + (a.hullValue || 0), 0).toLocaleString()}`,
    suffix: "insured value",
  },
  {
    label: "COVERAGE STATUS",
    icon: <SecurityIcon />,
    color: "#7c3aed",
    getValue: () => "Active",
    suffix: "all policies current",
  },
];

export default function MyPolicies({ aircrafts = [] }) {
  const navigate = useNavigate();

  return (
    <Box className="ag-page">
      <AppBarNav />

      <Box className="ag-body">
        <Container maxWidth="lg">
          {/* Page Header */}
          <Box className="ag-page-head">
            <Box>
              <h1 className="ag-page-title">
                My Policies
              </h1>
              <p className="ag-page-subtitle">
                View and manage insurance coverage for your registered aircraft.
              </p>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/aircraft")}
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "#ea580c !important",
                "&:hover": { bgcolor: "#c2410c !important" },
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1.25,
                borderRadius: 2,
              }}
            >
              Add Aircraft
            </Button>
          </Box>

          {/* Summary Cards */}
          <Box className="policies-summary-grid">
            {SUMMARY_CARDS.map((card) => (
              <Card key={card.label} variant="outlined" className="policies-summary-card">
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p className="policies-summary-label">{card.label}</p>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: `${card.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography className="policies-summary-value" sx={{ mt: 1 }}>
                    {card.getValue(aircrafts)}
                  </Typography>
                  <Typography className="policies-summary-suffix" sx={{ mt: 0.5 }}>
                    {card.suffix}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Policies Table */}
          <Card variant="outlined" className="policies-table-card">
            <Box className="policies-table-header">
              <p className="policies-table-title">Aircraft Coverage</p>
              <p className="policies-table-count">
                {aircrafts.length} {aircrafts.length === 1 ? "policy" : "policies"}
              </p>
            </Box>

            {aircrafts.length > 0 ? (
              <Table className="ag-table policies-table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "22%" }}>Aircraft</TableCell>
                    <TableCell sx={{ width: "15%" }}>Serial Number</TableCell>
                    <TableCell sx={{ width: "15%" }}>Home Base</TableCell>
                    <TableCell sx={{ width: "13%" }}>Hull Value</TableCell>
                    <TableCell sx={{ width: "20%" }}>Coverage Tier</TableCell>
                    <TableCell sx={{ width: "15%" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aircrafts.map((aircraft) => {
                    const tier = COVERAGE_TIERS[aircraft.coverageTier] || COVERAGE_TIERS.smooth;
                    return (
                      <TableRow key={aircraft.id} sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                        <TableCell>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                              {aircraft.name || `${aircraft.make} ${aircraft.model}`}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                              {aircraft.aircraftType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={aircraft.serialNum || "N/A"}
                            size="small"
                            sx={{
                              bgcolor: "#f1f5f9",
                              color: "#475569",
                              fontWeight: 600,
                              fontFamily: "monospace",
                              fontSize: "12px",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#64748b" }}>
                          {aircraft.homeBase || "—"}
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                            R{(aircraft.hullValue || 0).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tier.label}
                            size="small"
                            sx={{
                              bgcolor: tier.bg,
                              color: tier.color,
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                            label="Active"
                            size="small"
                            sx={{
                              bgcolor: "#dcfce7",
                              color: "#16a34a",
                              fontWeight: 600,
                              fontSize: "12px",
                              "& .MuiChip-icon": { color: "#16a34a" },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Box className="policies-empty-state">
                <Box className="policies-empty-icon">
                  <ShieldIcon sx={{ fontSize: 48, color: "#cbd5e1" }} />
                </Box>
                <p className="policies-empty-title">No policies yet</p>
                <p className="policies-empty-desc">
                  Register an aircraft to get coverage quotes and activate your first policy.
                </p>
                <Button
                  variant="contained"
                  onClick={() => navigate("/aircraft")}
                  sx={{
                    mt: 2,
                    bgcolor: "#ea580c !important",
                    "&:hover": { bgcolor: "#c2410c !important" },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Register Aircraft
                </Button>
              </Box>
            )}
          </Card>

          {/* Coverage Details for each aircraft */}
          {aircrafts.length > 0 && (
            <Box className="policies-details-section">
              <p className="policies-details-heading">Coverage Details</p>
              <Box className="policies-details-grid">
                {aircrafts.map((aircraft) => {
                  const tier = COVERAGE_TIERS[aircraft.coverageTier] || COVERAGE_TIERS.smooth;
                  return (
                    <Card key={aircraft.id} variant="outlined" className="policies-detail-card">
                      <CardContent>
                        <Box className="policies-detail-header">
                          <Box>
                            <p className="policies-detail-name">
                              {aircraft.name || `${aircraft.make} ${aircraft.model}`}
                            </p>
                            <p className="policies-detail-serial">
                              S/N: {aircraft.serialNum || "N/A"}
                            </p>
                          </Box>
                          <Chip
                            label={tier.label}
                            size="small"
                            sx={{
                              bgcolor: tier.bg,
                              color: tier.color,
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                        <Box className="policies-detail-features">
                          {tier.features.map((feature) => (
                            <Box key={feature} className="policies-detail-feature">
                              <CheckCircleIcon sx={{ fontSize: 16, color: "#22c55e" }} />
                              <p>{feature}</p>
                            </Box>
                          ))}
                        </Box>
                        <Box className="policies-detail-footer">
                          <Box>
                            <p className="policies-detail-label">Hull Value</p>
                            <p className="policies-detail-value">
                              R{(aircraft.hullValue || 0).toLocaleString()}
                            </p>
                          </Box>
                          <Box>
                            <p className="policies-detail-label">Annual Premium</p>
                            <p className="policies-detail-value policies-detail-premium">
                              R{Math.round((aircraft.hullValue || 0) * 0.012).toLocaleString()}/yr
                            </p>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" className="ag-footer">
        <Container maxWidth="lg">
          <Box className="ag-footer-grid">
            <Box>
              <Box className="ag-footer-brand">
                <NavigationIcon className="ag-footer-mark" />
                <p className="ag-footer-name">AVIAGUARD</p>
              </Box>
              <p className="ag-footer-tagline">
                Enterprise aviation insurance underwriting, real-time risk compliance, and fleet protection tracking.
              </p>
            </Box>
            <Box>
              <p className="ag-footer-heading">PLATFORM</p>
              <p className="ag-footer-link">Fleet Underwriting</p>
              <p className="ag-footer-link">Risk Assessment</p>
              <p className="ag-footer-link">Compliance Portal</p>
            </Box>
            <Box>
              <p className="ag-footer-heading">RESOURCES</p>
              <p className="ag-footer-link">Compliance Guides</p>
              <p className="ag-footer-link">Aviation Act</p>
              <p className="ag-footer-link">Claims Support</p>
            </Box>
            <Box>
              <p className="ag-footer-heading">COMPANY</p>
              <p className="ag-footer-link">About Us</p>
              <p className="ag-footer-link">Partners</p>
              <p className="ag-footer-link">Contact</p>
            </Box>
          </Box>
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
