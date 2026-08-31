import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AppBarNav from "../AppBarNav";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../global";
import "./ClaimReview.css";

const isOpen = (status) => ["pending", "in review", "under review"].includes(String(status || "").trim().toLowerCase());

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(value))
    : "Not provided";

const formatAmount = (value) => `R${Number(value || 0).toLocaleString()}`;

export default function ClaimReview({ claims = [], resolveQueueItem }) {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const [apiClaim, setApiClaim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!claimId) return;

    const fetchClaim = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/claims/${claimId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setApiClaim(data.claim || data);
        }
      } catch {
     
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [claimId, token]);

  const fallbackClaim = useMemo(
    () => claims.find((item) => String(item.id) === String(claimId) || item.reference === claimId || item.claim_reference === claimId),
    [claims, claimId]
  );

  const claim = useMemo(() => {
    if (apiClaim) {
      return {
        id: apiClaim.id,
        reference: apiClaim.claim_reference || `CLM-${apiClaim.id}`,
        aircraft: apiClaim.aircraft?.aircraft_type || apiClaim.aircraft?.registration || (apiClaim.aircraft_id ? `Aircraft #${apiClaim.aircraft_id}` : "Not provided"),
        aircraftId: apiClaim.aircraft_id,
        type: apiClaim.incident_type || apiClaim.incident_description || "Hull Damage",
        incidentDate: apiClaim.incident_date,
        location: apiClaim.incident_location || "Not specified",
        description: apiClaim.incident_description || "No description provided.",
        pilot: apiClaim.user?.name || apiClaim.pilot || "Registered pilot",
        amount: apiClaim.claim_amount || 0,
        submittedAt: apiClaim.submitted_at || apiClaim.created_at,
        status: apiClaim.status || "Pending",
        documentCount: apiClaim.documents?.length || 0,
        isApi: true,
      };
    }
    return fallbackClaim;
  }, [apiClaim, fallbackClaim]);

  const handleDecision = async (decision) => {
    if (!claim || !isOpen(claim.status)) return;

    const actionStatus = decision === "approve" ? "Approved" : "Denied";
    setActionLoading(true);

    try {
      if (token) {
        const response = await fetch(`${API_URL}/review-logs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_task_id: claim.id,
            action: actionStatus,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || errData.error || "Failed to submit review decision.");
        }
      }

      resolveQueueItem?.({
        source: "claim",
        id: claim.id,
        status: actionStatus,
        entry: {
          id: `${claim.id}-${Date.now()}`,
          applicationId: claim.reference,
          pilot: claim.pilot,
          aircraft: claim.aircraft,
          type: "Claim",
          action: actionStatus,
          time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
        },
      });

      setNotification({
        open: true,
        message: `Claim ${claim.reference} has been ${actionStatus.toLowerCase()} successfully.`,
        severity: actionStatus === "Approved" ? "success" : "info",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1200);
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || "Failed to process claim decision.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="ag-page claim-review-page">
        <AppBarNav />
        <Container maxWidth="md" className="claim-review-body" sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading claim details...</Typography>
        </Container>
      </Box>
    );
  }

  if (!claim) {
    return (
      <Box className="ag-page claim-review-page">
        <AppBarNav />
        <Container maxWidth="md" className="claim-review-body">
          <Alert severity="warning">This claim could not be found.</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin")} sx={{ mt: 2 }}>
            Back to Admin
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="ag-page claim-review-page">
      <AppBarNav />
      <Container maxWidth="lg" className="claim-review-body">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin")} className="claim-review-back">
          Back to Admin Queue
        </Button>

        <Box className="claim-review-header">
          <Box>
            <Typography component="p" className="claim-review-eyebrow">CLAIM REVIEW</Typography>
            <h1 className="ag-page-title">{claim.reference}</h1>
            <p className="ag-page-subtitle">Review the incident details and supporting information before making a decision.</p>
          </Box>
          <Chip label={claim.status || "Pending"} className={`ag-status ag-status--${String(claim.status || "Pending").toLowerCase().replace(/\s/g, "-")}`} />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" className="claim-review-card">
              <CardContent>
                <Box className="claim-review-card-heading">
                  <GavelOutlinedIcon />
                  <h2>Incident Details</h2>
                </Box>
                <Grid container spacing={2.5} className="claim-detail-grid">
                  <Grid size={{ xs: 12, sm: 6 }}><p className="claim-detail-label">Aircraft / Tail Number</p><p className="claim-detail-value">{claim.aircraft || "Not provided"}</p></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><p className="claim-detail-label">Incident Type</p><p className="claim-detail-value">{claim.type || "Not provided"}</p></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><p className="claim-detail-label">Incident Date</p><p className="claim-detail-value">{formatDate(claim.incidentDate)}</p></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><p className="claim-detail-label">Incident Location</p><p className="claim-detail-value">{claim.location || "Not provided"}</p></Grid>
                  <Grid size={{ xs: 12 }}><p className="claim-detail-label">Description</p><p className="claim-detail-value claim-detail-description">{claim.description || "No description provided."}</p></Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined" className="claim-review-card">
              <CardContent>
                <Box className="claim-review-card-heading">
                  <DescriptionOutlinedIcon />
                  <h2>Supporting Documents</h2>
                </Box>
                <Typography className="claim-document-count">
                  {claim.documentCount || 0} supporting {claim.documentCount === 1 ? "document" : "documents"} submitted with this claim.
                </Typography>
                <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
                  Document previews and verification tasks are tracked in the Review Task system.
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" className="claim-review-card claim-review-summary">
              <CardContent>
                <h2>Claim Summary</h2>
                <Stack spacing={2.25} divider={<Divider flexItem />}>
                  <Box><p className="claim-detail-label">Claimant</p><p className="claim-detail-value">{claim.pilot || "Registered pilot"}</p></Box>
                  <Box><p className="claim-detail-label">Claim Amount</p><p className="claim-amount">{formatAmount(claim.amount)}</p></Box>
                  <Box><p className="claim-detail-label">Submitted</p><p className="claim-detail-value">{formatDate(claim.submittedAt)}</p></Box>
                </Stack>
                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleOutlinedIcon />}
                    disabled={!isOpen(claim.status) || actionLoading}
                    onClick={() => handleDecision("approve")}
                    className="claim-approve-button"
                  >
                    {actionLoading ? "Processing..." : "Approve Claim"}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    disabled={!isOpen(claim.status) || actionLoading}
                    onClick={() => handleDecision("deny")}
                  >
                    Deny Claim
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
