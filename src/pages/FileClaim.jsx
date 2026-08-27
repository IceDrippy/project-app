import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AppBarNav from "../AppBarNav";
import { useNavigate } from "react-router-dom";
import "./FileClaim.css";
import { API_URL } from "../global";

const INCIDENT_TYPES = [
  "Bird strike",
  "Gear collapse",
  "Ground damage",
  "Hail damage",
  "Hard landing",
  "Hangar rash",
  "Avionics failure",
  "Engine failure",
  "Weather damage",
  "Theft/Vandalism",
  "Other",
];

export default function FileClaim({ addClaim }) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [claimReference, setClaimReference] = useState("");
  const [claim, setClaim] = useState({
    aircraft: "",
    incidentDate: "",
    incidentType: "",
    incidentLocation: "",
    description: "",
    amount: "",
  });

  const [policies, setPolicies] = useState([]);
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [documentError, setDocumentError] = useState("");
  const documentsRef = useRef(supportingDocuments);
  documentsRef.current = supportingDocuments;

  useEffect(() => {
    return () => {
      documentsRef.current.forEach((document) => URL.revokeObjectURL(document.preview));
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    const loadPolicies = async () => {
      try {
        const response = await fetch(`${API_URL}/policies`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Unable to load policies.");

        const data = await response.json();
        setPolicies(Array.isArray(data) ? data : data.policies || []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load policies.");
        }
      }
    };

    loadPolicies();
    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClaim((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/claims/policy/${claim.aircraft}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          incident_date: claim.incidentDate,
          incident_description: claim.description,
          incident_location: claim.incidentLocation,
          claim_amount: Number(claim.amount),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to submit claim.");

      const savedClaim = data.claim || data;
        setClaimReference(savedClaim.claim_reference || "Claim submitted");
        addClaim?.(savedClaim);
        setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to submit claim.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDocumentChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024
    );

    if (invalidFile) {
      setDocumentError("Each supporting document must be an image smaller than 10MB.");
      event.target.value = "";
      return;
    }

    setSupportingDocuments((current) => [
      ...current,
      ...selectedFiles.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    setDocumentError("");
    event.target.value = "";
  };

  const removeDocument = (preview) => {
    URL.revokeObjectURL(preview);
    setSupportingDocuments((current) => current.filter((document) => document.preview !== preview));
  };

  const isFormValid =
    claim.aircraft && claim.incidentDate && claim.incidentType && claim.description && claim.amount;

  return (
    <Box className="ag-page file-claim-page">
      <AppBarNav />
      <Container maxWidth="md" className="file-claim-body">
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <Box className="ag-page-head">
          <Box>
            <h1 className="ag-page-title">
              File a New Claim
            </h1>
            <p className="ag-page-subtitle">
              Submit a damage incident for adjuster review. Most claims are processed within 48 hours.
            </p>
          </Box>
        </Box>

        {submitted ? (
          <Card variant="outlined" className="file-claim-card file-claim-success-card">
            <CardContent>
              <Box className="file-claim-success-content">
                <Box className="file-claim-success-icon">
                  <CheckCircleIcon sx={{ fontSize: 64, color: "#22c55e" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
                  Claim Submitted Successfully
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 3, maxWidth: 400, mx: "auto" }}>
                  Your claim has been received and assigned to an adjuster. You'll receive an email
                  confirmation shortly with your claim reference number.
                </Typography>
                <Chip
                  label={`Claim #${claimReference}`}
                  sx={{
                    bgcolor: "#f0f9ff",
                    color: "#0284c7",
                    fontWeight: 700,
                    fontSize: "14px",
                    mb: 3,
                  }}
                />
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="outlined" onClick={() => navigate("/claims")}>
                    View All Claims
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSubmitted(false);
                      setClaim({
                        aircraft: "",
                        incidentDate: "",
                        incidentType: "",
                        incidentLocation: "",
                        description: "",
                        amount: "",
                      });
                      setSupportingDocuments([]);
                    }}
                    sx={{ bgcolor: "#0c1220 !important" }}
                  >
                    File Another Claim
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card variant="outlined" className="file-claim-card">
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} className="file-claim-form">
                {/* Section: Aircraft & Incident Info */}
                <Box className="file-claim-section">
                  <p className="file-claim-section-title">
                    <DescriptionOutlinedIcon sx={{ fontSize: 20, mr: 1, verticalAlign: "middle" }} />
                    Incident Information
                  </p>

                  <Box className="file-claim-grid">
                    {policies.length > 0 ? (
                      <FormControl fullWidth required>
                        <InputLabel>Policy / Aircraft</InputLabel>
                        <Select
                          name="aircraft"
                          value={claim.aircraft}
                          onChange={handleChange}
                          label="Policy / Aircraft"
                        >
                          {policies.map((policy) => {
                            const aircraft = policy.aircraft || {};
                            return (
                              <MenuItem key={policy.id} value={policy.id}>
                                {aircraft.name || `${aircraft.make || ""} ${aircraft.model || ""}`.trim() || "Unnamed aircraft"} — {aircraft.serial_number || "N/A"}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        label="Aircraft / Tail Number"
                        name="aircraft"
                        value={claim.aircraft}
                        onChange={handleChange}
                        required
                        fullWidth
                        placeholder="N12345"
                        helperText="Create a policy to select an aircraft"
                      />
                    )}
                    <TextField
                      label="Incident Date"
                      name="incidentDate"
                      type="date"
                      value={claim.incidentDate}
                      onChange={handleChange}
                      required
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Box>

                  <Box className="file-claim-grid">
                    <FormControl fullWidth required>
                      <InputLabel>Incident Type</InputLabel>
                      <Select
                        name="incidentType"
                        value={claim.incidentType}
                        onChange={handleChange}
                        label="Incident Type"
                      >
                        {INCIDENT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Incident Location"
                      name="incidentLocation"
                      value={claim.incidentLocation}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Airport code or address"
                    />
                  </Box>

                  <TextField
                    label="Estimated Claim Amount"
                    name="amount"
                    type="number"
                    value={claim.amount}
                    onChange={handleChange}
                    required
                    fullWidth
                    slotProps={{
                      input: {
                        inputProps: { min: 0 },
                        startAdornment: <InputAdornment position="start">R</InputAdornment>,
                      },
                    }}
                    helperText="Estimated cost of repairs or replacement"
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Section: Description */}
                <Box className="file-claim-section">
                  <p className="file-claim-section-title">Incident Details</p>
                  <TextField
                    label="Description of Incident"
                    name="description"
                    value={claim.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    minRows={5}
                    placeholder="Please describe what happened, including weather conditions, time of day, and any contributing factors..."
                    helperText="Provide as much detail as possible to help expedite your claim"
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Section: Supporting Documents */}
                <Box className="file-claim-section">
                  <Box className="supporting-documents">
                    <Box className="supporting-documents-header">
                      <Box>
                        <p className="supporting-documents-title">
                          Supporting Documents
                        </p>
                        <p className="supporting-documents-help">
                          Upload photos of damage, repair estimates, or related evidence.
                        </p>
                      </Box>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        className="supporting-documents-button"
                      >
                        Upload Images
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleDocumentChange}
                        />
                      </Button>
                    </Box>

                    {documentError && (
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {documentError}
                      </Alert>
                    )}

                    {supportingDocuments.length > 0 && (
                      <Box className="supporting-documents-grid">
                        {supportingDocuments.map((document) => (
                          <Box key={document.preview} className="supporting-document-item">
                            <Box
                              component="img"
                              src={document.preview}
                              alt={document.file.name}
                              className="supporting-document-preview"
                            />
                            <p className="supporting-document-name">
                              {document.file.name}
                            </p>
                            <Button
                              type="button"
                              size="small"
                              color="error"
                              onClick={() => removeDocument(document.preview)}
                              sx={{ fontSize: "12px" }}
                            >
                              Remove
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {supportingDocuments.length === 0 && (
                      <Box className="supporting-documents-empty">
                        <CloudUploadIcon sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }} />
                        <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                          No documents uploaded yet
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: "12px" }}>
                          Drag and drop or click Upload Images above
                        </Typography>
                      </Box>
                    )}

                    <p className="supporting-documents-limit">
                      Accepted formats: JPG, PNG, GIF, WebP. Maximum 10MB per image.
                    </p>
                  </Box>
                </Box>

                {/* Actions */}
                <Box className="file-claim-actions">
                  <Button variant="outlined" type="button" onClick={() => navigate("/claims")}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isFormValid || loading}
                    sx={{
                      bgcolor: "#ea580c !important",
                      "&:hover": { bgcolor: "#c2410c !important" },
                      "&.Mui-disabled": { bgcolor: "#94a3b8 !important", color: "#fff !important" },
                    }}
                  >
                    {loading ? "Submitting..." : "Submit Claim"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
