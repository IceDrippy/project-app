import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  CircularProgress,
  TextField,
  IconButton,
  Tooltip,
  Stack,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import NavigationIcon from "@mui/icons-material/Navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import "./Claims.css";
import AppBarNav from "../AppBarNav";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../global";

const SUMMARY_CARDS = [
  {
    key: "total",
    label: "TOTAL CLAIMS",
    tag: "All registered incidents",
    tagType: "muted",
    icon: <TrendingUpIcon />,
    color: "#0284c7",
  },
  {
    key: "pending",
    label: "PENDING REVIEW",
    tag: "Awaiting adjuster",
    tagType: "alert",
    icon: <PendingIcon />,
    color: "#ea580c",
  },
  {
    key: "approved",
    label: "APPROVED",
    tag: "Settled claims",
    tagType: "success",
    icon: <CheckCircleIcon />,
    color: "#22c55e",
  },
  {
    key: "denied",
    label: "CLAIMS DENIED",
    tagType: "muted",
    icon: <WarningAmberIcon />,
    color: "#64748b",
  },
];

const FOOTER_COLUMNS = [
  {
    heading: "PLATFORM",
    links: ["Fleet Underwriting", "Risk Assessment", "Compliance Portal"],
  },
  {
    heading: "RESOURCES",
    links: ["Compliance Guides", "Aviation Act", "Claims Support"],
  },
  {
    heading: "COMPANY",
    links: ["About Us", "Partners", "Contact"],
  },
];

const STATUS_STYLES = {
  Approved: "ag-chip-approved",
  Processing: "ag-chip-processing",
  Pending: "ag-chip-under-review",
  "Under Review": "ag-chip-under-review",
  Denied: "ag-chip-urgent",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(value))
    : "—";

export default function Claims() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    const loadClaims = async () => {
      try {
        const response = await fetch(`${API_URL}/claims`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Unable to load claims.");

        const data = await response.json();
        setClaims(Array.isArray(data) ? data : data.claims || []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load claims.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
    return () => controller.abort();
  }, []);

  const rows = claims.map((claim) => ({
    id: claim.claim_reference || claim.id || "N/A",
    tail: claim.aircraft?.aircraft_type || claim.aircraft_id || "N/A",
    dateFiled: formatDate(claim.incident_date || claim.submitted_at),
    type: claim.incident_description || "Incident",
    amount: `R${Number(claim.claim_amount || 0).toLocaleString()}`,
    status: claim.status,
  }));

  const summaryValues = {
    total: claims.length,
    pending: claims.filter((claim) => claim.status === "Pending" || claim.status === "Under Review").length,
    approved: claims.filter((claim) => claim.status === "Approved").length,
    denied: claims.filter((claim) => claim.status === "Denied").length,
  };

  const query = searchQuery.toLowerCase();
  const filteredClaims = rows.filter(
    (claim) =>
      claim.id.toLowerCase().includes(query) ||
      claim.tail.toLowerCase().includes(query) ||
      claim.type.toLowerCase().includes(query)
  );

  return (
    <Box className="ag-page">
      <AppBarNav />

      <Box className="ag-body">
        <Container maxWidth="lg">
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {/* Page Header */}
          <Box className="ag-page-head">
            <Box>
              <h1 className="ag-page-title">
                Claims Management
              </h1>
              <p className="ag-page-subtitle">
                Track submitted damage incidents, register new structural events, and coordinate
                with adjusters.
              </p>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/file-claim")}
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
              File New Claim
            </Button>
          </Box>

          <Grid container spacing={2.5} sx={{ marginBottom: 4 }} className="ag-summary-grid">
            {SUMMARY_CARDS.map((card) => (
              <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card variant="outlined" className="ag-summary-card">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p className="ag-summary-label">{card.label}</p>
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
                    <Typography className="ag-summary-value" sx={{ mt: 1 }}>
                      {summaryValues[card.key]}
                    </Typography>
                    <Box sx={{ mt: 1, minHeight: 24 }}>
                      {card.tagType === "muted" && card.tag && (
                        <p className="ag-summary-muted">{card.tag}</p>
                      )}
                      {card.tagType === "alert" && (
                        <Chip
                          label={card.tag}
                          size="small"
                          className="ag-chip-urgent"
                        />
                      )}
                      {card.tagType === "success" && (
                        <Chip
                          label={card.tag}
                          size="small"
                          className="ag-chip-approved"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card variant="outlined" className="ag-panel">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 3,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography className="ag-panel-title" sx={{ mb: 0.5 }}>
                    CLAIMS REGISTER
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "13px" }}>
                    {filteredClaims.length} {filteredClaims.length === 1 ? "claim" : "claims"} found
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    size="small"
                    placeholder="Search claims..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      width: 260,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                      },
                    }}
                  />
                  <Tooltip title="Filter claims">
                    <IconButton
                      sx={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#f8fafc" },
                      }}
                    >
                      <FilterListIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress aria-label="Loading claims" />
                </Box>
              ) : filteredClaims.length > 0 ? (
                <Table className="ag-table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16%" }}>Claim ID</TableCell>
                      <TableCell sx={{ width: "12%" }}>Aircraft</TableCell>
                      <TableCell sx={{ width: "14%" }}>Date Filed</TableCell>
                      <TableCell sx={{ width: "18%" }}>Incident Type</TableCell>
                      <TableCell sx={{ width: "14%" }} align="right">Amount</TableCell>
                      <TableCell sx={{ width: "14%" }}>Status</TableCell>
                      <TableCell sx={{ width: "12%" }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClaims.map((row) => (
                      <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                        <TableCell className="ag-cell-strong">{row.id}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.tail}
                            size="small"
                            sx={{
                              bgcolor: "#f0f9ff",
                              color: "#0284c7",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#64748b" }}>{row.dateFiled}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell align="right" className="ag-cell-amount">
                          {row.amount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            className={STATUS_STYLES[row.status]}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View details">
                            <IconButton size="small" sx={{ color: "#64748b" }}>
                              <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Box className="ag-empty-state">
                  <SearchIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
                  <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                    No claims found
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "14px", mb: 2 }}>
                    {searchQuery
                      ? `No results for "${searchQuery}"`
                      : "You haven't filed any claims yet"}
                  </Typography>
                  {!searchQuery && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => navigate("/file-claim")}
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      File Your First Claim
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
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
                Enterprise aviation insurance underwriting, real-time risk compliance, and fleet
                protection tracking.
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
