import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useNavigate } from "react-router-dom";
import AppBarNav from "../AppBarNav";
import "./Admin.css";

const SUMMARY_CARDS = [
  { key: "Application", label: "New Applications", color: "blue", icon: <FlightTakeoffIcon /> },
  { key: "Claim", label: "Claims to Review", color: "orange", icon: <GavelOutlinedIcon /> },
  { key: "Document", label: "Documents Awaiting Verification", color: "purple", icon: <DescriptionOutlinedIcon /> },
  { key: "approved", label: "Approved Today", color: "green", icon: <TaskAltOutlinedIcon /> },
];

const WORKFLOW_TYPES = [
  { type: "Application", label: "Applications Processing", color: "blue", icon: <FlightTakeoffIcon fontSize="small" /> },
  { type: "Claim", label: "Claims Review", color: "orange", icon: <GavelOutlinedIcon fontSize="small" /> },
  { type: "Document", label: "Document Verification", color: "purple", icon: <DescriptionOutlinedIcon fontSize="small" /> },
  { type: "Medical", label: "Medical Review", color: "green", icon: <LocalHospitalOutlinedIcon fontSize="small" /> },
];

const TYPE_ICONS = {
  Application: <FlightTakeoffIcon />,
  Claim: <GavelOutlinedIcon />,
  Document: <DescriptionOutlinedIcon />,
  Medical: <LocalHospitalOutlinedIcon />,
};

const SIDEBAR_SECTIONS = [
  {
    heading: "OPERATIONS",
    links: [
      { label: "Overview", icon: <DashboardOutlinedIcon fontSize="small" />, filter: "All" },
      { label: "Applications", icon: <InboxOutlinedIcon fontSize="small" />, filter: "Application" },
      { label: "Claims", icon: <GavelOutlinedIcon fontSize="small" />, filter: "Claim" },
      { label: "Documents", icon: <DescriptionOutlinedIcon fontSize="small" />, filter: "Document" },
      { label: "Medical Reviews", icon: <LocalHospitalOutlinedIcon fontSize="small" />, filter: "Medical" },
    ],
  },
  {
    headings : `Welcome Captain ${fullname}`
  }
];

const isOpen = (status) => ["pending", "in review"].includes(String(status || "").trim().toLowerCase());

const QUEUE_PAGE_SIZE = 5;

const relativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export default function Admin({
  aircrafts = [],
  claims = [],
  reviewItems = [],
  reviewLog = [],
  resolveQueueItem,
  clearReviewLog,
}) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const applications = useMemo(() => {
    const fromAircraft = aircrafts.map((aircraft) => ({
      source: "aircraft",
      id: aircraft.id,
      reference: aircraft.reference,
      pilot: aircraft.pilot,
      aircraft: aircraft.name,
      tier: aircraft.coverageTier,
      type: "Application",
      status: aircraft.status,
      submitted: relativeTime(aircraft.submittedAt),
      submittedAt: aircraft.submittedAt,
    }));

    const fromClaims = claims.map((claim) => ({
      source: "claim",
      id: claim.id,
      reference: claim.reference,
      pilot: claim.pilot,
      aircraft: claim.aircraft,
      tier: claim.type,
      type: "Claim",
      status: claim.status,
      submitted: relativeTime(claim.submittedAt),
      submittedAt: claim.submittedAt,
    }));

    const fromReviews = reviewItems.map((item) => ({
      source: "review",
      id: item.id,
      reference: item.reference,
      pilot: item.pilot,
      aircraft: item.aircraft,
      tier: item.detail,
      type: item.kind,
      status: item.status,
      submitted: relativeTime(item.submittedAt),
      submittedAt: item.submittedAt,
    }));

    return [...fromAircraft, ...fromClaims, ...fromReviews].sort(
      (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
    );
  }, [aircrafts, claims, reviewItems]);

  const handleAction = (app, action) => {
    const status = action === "approve" ? "Approved" : "Denied";

    resolveQueueItem?.({
      source: app.source,
      id: app.id,
      status,
      entry: {
        id: `${app.id}-${Date.now()}`,
        applicationId: app.reference,
        pilot: app.pilot,
        aircraft: app.aircraft,
        type: app.type,
        action: status,
        time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      },
    });
  };

  const activity = reviewLog;

  const filteredApplications = useMemo(
    () => (filter === "All" ? applications : applications.filter((app) => app.type === filter)),
    [applications, filter]
  );

  const visibleApplications = filteredApplications.slice(0, QUEUE_PAGE_SIZE);

  const summary = useMemo(() => {
    const openByType = (type) => applications.filter((app) => app.type === type && isOpen(app.status)).length;

    return {
      Application: openByType("Application"),
      Claim: openByType("Claim"),
      Document: openByType("Document"),
      approved: activity.filter((entry) => entry.action === "Approved").length,
    };
  }, [applications, activity]);

  const workflowHealth = useMemo(
    () =>
      WORKFLOW_TYPES.map((item) => {
        const items = applications.filter((app) => app.type === item.type);
        return {
          ...item,
          current: items.filter((app) => !isOpen(app.status)).length,
          total: items.length,
        };
      }),
    [applications]
  );

  return (
    <Box className="ag-page ag-admin">
      <AppBarNav />

      <Box className="ag-admin-layout">
        <Box component="nav" className="ag-sidebar">
          <Box className="ag-sidebar-brand">
            <DashboardOutlinedIcon className="ag-sidebar-brand-icon" />
            <h1 className="ag-sidebar-brand-name">Dashboard</h1>
          </Box>

          {SIDEBAR_SECTIONS.map((section) => (
            <Box key={section.heading} className="ag-sidebar-section">
              <h2 className="ag-sidebar-heading">{section.heading}</h2>
              {section.links.map((link) => (
                <Box
                  key={link.label}
                  component="button"
                  disabled={!link.filter}
                  className={`ag-sidebar-link ${link.filter === filter ? "ag-sidebar-link--active" : ""} ${!link.filter ? "ag-sidebar-link--static" : ""}`}
                  onClick={() => link.filter && setFilter(link.filter)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box component="main" className="ag-admin-content">
         
          <Grid container spacing={3} className="ag-summary-cards">
            {SUMMARY_CARDS.map((card) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
                <Card variant="outlined" className={`ag-summary-card ag-summary-card--${card.color}`}>
                  <CardContent>
                    <Box className="ag-summary-icon">{card.icon}</Box>
                    <p className="ag-summary-value">{summary[card.key]}</p>
                    <p className="ag-summary-label">{card.label}</p>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 9 }}>
              <Box component="section" className="ag-admin-panel">
                <Box component="header" className="ag-admin-panel-header">
                  <Box className="ag-panel-heading">
                    <InboxOutlinedIcon className="ag-panel-icon" />
                    <h2 className="ag-panel-title">Underwriting Queue</h2>
                    {filter !== "All" && (
                      <Chip
                        label={filter}
                        size="small"
                        onDelete={() => setFilter("All")}
                        className={`ag-type ag-type--${filter.toLowerCase()}`}
                      />
                    )}
                  </Box>
                  <Box className="ag-panel-actions">
                    <p className="ag-queue-count">
                      Showing {visibleApplications.length} of {filteredApplications.length}
                    </p>
                    <Button variant="text" className="ag-btn-link" onClick={() => navigate("/aircrafts")}>
                      View all →
                    </Button>
                  </Box>
                </Box>

                <Table className="ag-admin-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Application</TableCell>
                      <TableCell>Pilot</TableCell>
                      <TableCell>Aircraft</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <p className="ag-activity-empty">No items in this queue.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      visibleApplications.map((app) => (
                        <TableRow
                          key={app.id}
                          hover
                          onClick={() => app.type === "Claim" && navigate(`/admin/claims/${app.id}`)}
                          sx={{ cursor: app.type === "Claim" ? "pointer" : "default" }}
                        >
                          <TableCell>
                            <p className="ag-cell-primary">{app.reference}</p>
                            <p className="ag-cell-secondary">{app.submitted}</p>
                          </TableCell>
                          <TableCell>{app.pilot}</TableCell>
                          <TableCell>
                            <p className="ag-cell-primary">{app.aircraft}</p>
                            {app.tier && <Chip label={app.tier} size="small" className="ag-meta-chip" />}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={TYPE_ICONS[app.type]}
                              label={app.type}
                              size="small"
                              className={`ag-type ag-type--${app.type.toLowerCase()}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={app.status} size="small" className={`ag-status ag-status--${app.status.toLowerCase().replace(/\s/g, "-")}`} />
                          </TableCell>
                          <TableCell align="right">
                            <FormControl size="small" className="ag-action-select" disabled={!isOpen(app.status)}>
                              <Select
                                displayEmpty
                                value=""
                                onChange={(event) => {
                                  event.stopPropagation();
                                  handleAction(app, event.target.value);
                                }}
                                onClick={(event) => event.stopPropagation()}
                                renderValue={() => (isOpen(app.status) ? "Review" : "Closed")}
                              >
                                <MenuItem value="approve">Approve</MenuItem>
                                <MenuItem value="deny">Deny</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 3 }}>
              <Box component="section" className="ag-admin-panel ag-workflow-panel">
                <Box component="header" className="ag-admin-panel-header">
                  <Box className="ag-panel-heading">
                    <MonitorHeartOutlinedIcon className="ag-panel-icon" />
                    <h2 className="ag-panel-title">Workflow Health</h2>
                  </Box>
                </Box>

                <Box className="ag-workflow-list">
                  {workflowHealth.map((item) => (
                    <Box key={item.label} className="ag-workflow-item">
                      <Box className="ag-workflow-header">
                        <Box className={`ag-workflow-icon ag-workflow-icon--${item.color}`}>{item.icon}</Box>
                        <p className="ag-workflow-label">{item.label}</p>
                        <p className="ag-workflow-count">{item.current}/{item.total}</p>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.total ? (item.current / item.total) * 100 : 0}
                        className={`ag-workflow-bar ag-workflow-bar--${item.color}`}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box component="section" className="ag-admin-panel">
                <Box component="header" className="ag-admin-panel-header">
                  <Box className="ag-panel-heading">
                    <HistoryOutlinedIcon className="ag-panel-icon" />
                    <h2 className="ag-panel-title">Recent Activity</h2>
                  </Box>
                  {activity.length > 0 && (
                    <Button variant="text" className="ag-btn-link" onClick={clearReviewLog}>
                      Clear
                    </Button>
                  )}
                </Box>

                {activity.length === 0 ? (
                  <p className="ag-activity-empty">
                    No actions taken yet. Approve or deny an application to see it here.
                  </p>
                ) : (
                  <Box className="ag-activity-list">
                    {activity.map((entry) => (
                      <Box key={entry.id} className="ag-activity-item">
                        <Box className={`ag-activity-icon ag-activity-icon--${entry.action.toLowerCase()}`}>
                          {entry.action === "Approved" ? <CheckCircleOutlinedIcon /> : <HighlightOffIcon />}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <p className="ag-activity-text">
                            <strong>{entry.applicationId}</strong> {entry.action.toLowerCase()} — {entry.pilot}, {entry.aircraft}
                          </p>
                        </Box>
                        <Chip
                          icon={TYPE_ICONS[entry.type]}
                          label={entry.type}
                          size="small"
                          className={`ag-type ag-type--${entry.type.toLowerCase()}`}
                        />
                        <p className="ag-activity-time">{entry.time}</p>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}