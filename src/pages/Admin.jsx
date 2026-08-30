import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import AppBarNav from "../AppBarNav";
import {
  fetchAdminReviewData,
  isOpen,
  normalizeActivityLogs,
  normalizeQueueTasks,
  QUEUE_PAGE_SIZE,
  SIDEBAR_SECTIONS,
  submitReviewAction,
  SUMMARY_CARDS,
  TYPE_ICONS,
  WORKFLOW_TYPES,
} from "./adminHelpers";
import "./Admin.css";

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
  const [apiTasks, setApiTasks] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [apiAircrafts, setApiAircrafts] = useState([]);
  const [apiClaims, setApiClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { tasks, logs, aircrafts: fetchedAircrafts, claims: fetchedClaims } =
        await fetchAdminReviewData(token);
      setApiTasks(tasks);
      setApiLogs(logs);
      setApiAircrafts(fetchedAircrafts);
      setApiClaims(fetchedClaims);
    } catch {
      
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const queueTasks = useMemo(
    () =>
      normalizeQueueTasks({
        apiTasks,
        aircrafts: apiAircrafts.length > 0 ? apiAircrafts : aircrafts,
        claims: apiClaims.length > 0 ? apiClaims : claims,
        reviewItems,
      }),
    [apiTasks, apiAircrafts, aircrafts, apiClaims, claims, reviewItems]
  );

  const activityList = useMemo(
    () => normalizeActivityLogs({ apiLogs, reviewLog }),
    [apiLogs, reviewLog]
  );

  const handleAction = async (task, selectedAction) => {
    let actionLabel = "In Review";
    if (selectedAction === "approve" || selectedAction === "Approved") actionLabel = "Approved";
    if (selectedAction === "deny" || selectedAction === "Denied") actionLabel = "Denied";
    if (selectedAction === "in_review" || selectedAction === "In Review") actionLabel = "In Review";

    setActionLoadingId(task.id);

    try {
      // Only rows backed by a real ReviewTask can be posted to /review-logs.
      if (token && task.source === "api") {
        await submitReviewAction({ taskId: task.id, action: actionLabel, token });
        setApiTasks((current) =>
          current.map((t) => (t.id === task.id ? { ...t, review_status: actionLabel } : t))
        );
        loadData();
      } else if (token) {
        throw new Error(
          `${task.reference} has no review task on record yet. Refresh once the backend creates it.`
        );
      }

      resolveQueueItem?.({
        source: task.source,
        id: task.id,
        status: actionLabel,
        entry: {
          id: `${task.id}-${Date.now()}`,
          applicationId: task.reference,
          pilot: task.pilot,
          aircraft: task.aircraft,
          type: task.type,
          action: actionLabel,
          time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
        },
      });

      setNotification({
        open: true,
        message: `${task.reference} marked as ${actionLabel}.`,
        severity: actionLabel === "Approved" ? "success" : actionLabel === "Denied" ? "error" : "info",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || "An error occurred while saving.",
        severity: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === "All") return queueTasks;
    return queueTasks.filter(
      (task) => String(task.type).toLowerCase() === String(filter).toLowerCase()
    );
  }, [queueTasks, filter]);

  const visibleTasks = filteredTasks.slice(0, QUEUE_PAGE_SIZE);

  const summary = useMemo(() => {
    const openByType = (type) =>
      queueTasks.filter((t) => String(t.type).toLowerCase() === type.toLowerCase() && isOpen(t.status)).length;

    return {
      Application: openByType("Application"),
      Claim: openByType("Claim"),
      approved: activityList.filter((entry) => entry.action === "Approved").length,
    };
  }, [queueTasks, activityList]);

  const workflowHealth = useMemo(
    () =>
      WORKFLOW_TYPES.map((item) => {
        const items = queueTasks.filter(
          (t) => String(t.type).toLowerCase() === item.type.toLowerCase()
        );
        const resolved = items.filter((t) => !isOpen(t.status)).length;
        return {
          ...item,
          current: resolved,
          total: items.length,
          percentage: items.length ? Math.round((resolved / items.length) * 100) : 0,
        };
      }),
    [queueTasks]
  );

  return (
    <Box className="ag-page ag-admin">
      <AppBarNav />

      <Box className="ag-admin-layout">
        
        <Box component="nav" className="ag-sidebar">
          <Box className="ag-sidebar-brand">
            <DashboardOutlinedIcon className="ag-sidebar-brand-icon" />
            <h1 className="ag-sidebar-brand-name">Admin Portal</h1>
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
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={card.label}>
                <Card variant="outlined" className={`ag-summary-card ag-summary-card--${card.color}`}>
                  <CardContent>
                    <Box className="ag-summary-icon">{card.icon}</Box>
                    <p className="ag-summary-value">{summary[card.key] ?? 0}</p>
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
                    <h2 className="ag-panel-title">Underwriting & Review Queue</h2>
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
                      Showing {visibleTasks.length} of {filteredTasks.length}
                    </p>
                    <Tooltip title="Refresh Tasks">
                      <IconButton size="small" onClick={loadData} disabled={loading}>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Button variant="text" className="ag-btn-link" onClick={() => navigate("/aircrafts")}>
                      View fleet →
                    </Button>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress size={36} />
                  </Box>
                ) : (
                  <Table className="ag-admin-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Task Reference</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Decision</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visibleTasks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <p className="ag-activity-empty">No tasks in this queue.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        visibleTasks.map((task) => {
                          const isProcessing = actionLoadingId === task.id;
                          const taskTypeLower = String(task.type || "application").toLowerCase();
                          const taskStatusLower = String(task.status || "pending").toLowerCase().replace(/\s/g, "-");

                          return (
                            <TableRow
                              key={task.rowKey || task.id}
                              hover
                              onClick={() => task.claimId && navigate(`/admin/claims/${task.claimId}`)}
                              sx={{ cursor: task.claimId ? "pointer" : "default" }}
                            >
                              <TableCell>
                                <p className="ag-cell-primary">{task.reference}</p>
                                <p className="ag-cell-secondary">{task.submitted}</p>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={TYPE_ICONS[task.type] || <FlightTakeoffIcon fontSize="small" />}
                                  label={task.type}
                                  size="small"
                                  className={`ag-type ag-type--${taskTypeLower}`}
                                />
                              </TableCell>
                              <TableCell>
                                <p className="ag-cell-primary">{task.details}</p>
                                <p className="ag-cell-secondary">
                                  {task.pilot} • {task.aircraft}
                                </p>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={task.status}
                                  size="small"
                                  className={`ag-status ag-status--${taskStatusLower}`}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {isProcessing ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <FormControl size="small" className="ag-action-select" disabled={!isOpen(task.status)}>
                                    <Select
                                      displayEmpty
                                      value=""
                                      onChange={(event) => {
                                        event.stopPropagation();
                                        handleAction(task, event.target.value);
                                      }}
                                      onClick={(event) => event.stopPropagation()}
                                      renderValue={() => (isOpen(task.status) ? "Review" : task.status)}
                                    >
                                      <MenuItem value="approve">Approve</MenuItem>
                                      <MenuItem value="deny">Deny</MenuItem>
                                      <MenuItem value="in_review">In Review</MenuItem>
                                    </Select>
                                  </FormControl>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
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
                        <p className="ag-workflow-count">
                          {item.current}/{item.total}
                        </p>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
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
                    <h2 className="ag-panel-title">Recent Review Activity</h2>
                  </Box>
                  {activityList.length > 0 && clearReviewLog && (
                    <Button variant="text" className="ag-btn-link" onClick={clearReviewLog}>
                      Clear
                    </Button>
                  )}
                </Box>

                {activityList.length === 0 ? (
                  <p className="ag-activity-empty">
                    No actions logged yet. Approve, deny, or place a task in review to generate logs.
                  </p>
                ) : (
                  <Box className="ag-activity-list">
                    {activityList.slice(0, 8).map((entry) => {
                      const actionLower = String(entry.action || "").toLowerCase();
                      const isApproved = actionLower === "approved";
                      const isDenied = actionLower === "denied";

                      return (
                        <Box key={entry.id} className="ag-activity-item">
                          <Box
                            className={`ag-activity-icon ${
                              isApproved
                                ? "ag-activity-icon--approved"
                                : isDenied
                                ? "ag-activity-icon--denied"
                                : "ag-activity-icon--in-review"
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircleOutlinedIcon />
                            ) : isDenied ? (
                              <HighlightOffIcon />
                            ) : (
                              <HourglassEmptyOutlinedIcon fontSize="small" />
                            )}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <p className="ag-activity-text">
                              <strong>{entry.applicationId}</strong> set to{" "}
                              <span style={{ fontWeight: 600 }}>{entry.action}</span>
                              {entry.pilot ? ` — ${entry.pilot}` : ""}
                              {entry.aircraft ? `, ${entry.aircraft}` : ""}
                            </p>
                          </Box>
                          {entry.type && (
                            <Chip
                              icon={TYPE_ICONS[entry.type] || <FlightTakeoffIcon fontSize="small" />}
                              label={entry.type}
                              size="small"
                              className={`ag-type ag-type--${String(entry.type).toLowerCase()}`}
                            />
                          )}
                          <p className="ag-activity-time">{entry.time}</p>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}