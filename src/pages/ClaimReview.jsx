import { useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
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
import "./ClaimReview.css";

const isOpen = (status) => ["pending", "in review"].includes(String(status || "").trim().toLowerCase());

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(value))
    : "Not provided";

const formatAmount = (value) => `R${Number(value || 0).toLocaleString()}`;

export default function ClaimReview({ claims = [], resolveQueueItem }) {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const claim = useMemo(
    () => claims.find((item) => item.id === claimId || item.reference === claimId),
    [claims, claimId]
  );

  const handleDecision = (decision) => {
    if (!claim || !isOpen(claim.status)) return;

    const status = decision === "approve" ? "Approved" : "Denied";
    resolveQueueItem?.({
      source: "claim",
      id: claim.id,
      status,
      entry: {
        id: `${claim.id}-${Date.now()}`,
        applicationId: claim.reference,
        pilot: claim.pilot,
        aircraft: claim.aircraft,
        type: "Claim",
        action: status,
        time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      },
    });
    navigate("/admin");
  };

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
                  Document previews are not available in the admin portal yet.
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
                  <Button variant="contained" fullWidth startIcon={<CheckCircleOutlinedIcon />} disabled={!isOpen(claim.status)} onClick={() => handleDecision("approve")} className="claim-approve-button">
                    Approve Claim
                  </Button>
                  <Button variant="outlined" fullWidth color="error" startIcon={<HighlightOffIcon />} disabled={!isOpen(claim.status)} onClick={() => handleDecision("deny")}>
                    Deny Claim
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
