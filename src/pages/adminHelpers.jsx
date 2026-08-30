import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { API_URL } from "../global";

export const QUEUE_PAGE_SIZE = 10;

export const SUMMARY_CARDS = [
  { key: "Application", label: "Applications", color: "blue", icon: <FlightTakeoffIcon /> },
  { key: "Claim", label: "Claims to Review", color: "orange", icon: <GavelOutlinedIcon /> },
];

export const WORKFLOW_TYPES = [
  { type: "Application", label: "Applications Processing", color: "blue", icon: <FlightTakeoffIcon fontSize="small" /> },
  { type: "Claim", label: "Claims Review", color: "orange", icon: <GavelOutlinedIcon fontSize="small" /> },
];

export const TYPE_ICONS = {
  Application: <FlightTakeoffIcon fontSize="small" />,
  Claim: <GavelOutlinedIcon fontSize="small" />,
};

export const SIDEBAR_SECTIONS = [
  {
    heading: "OPERATIONS",
    links: [
      { label: "Overview", icon: <DashboardOutlinedIcon fontSize="small" />, filter: "All" },
      { label: "Applications", icon: <FlightTakeoffIcon fontSize="small" />, filter: "Application" },
      { label: "Claims", icon: <GavelOutlinedIcon fontSize="small" />, filter: "Claim" },
    ],
  },
];

export const isOpen = (status) =>
  ["pending", "in review"].includes(String(status || "").trim().toLowerCase());

export const relativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const dateObj = typeof timestamp === "string" ? new Date(timestamp) : new Date(Number(timestamp));
  if (isNaN(dateObj.getTime())) return "Recently";
  const minutes = Math.floor((Date.now() - dateObj.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export const formatLogTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const dateObj = typeof timestamp === "string" ? new Date(timestamp) : new Date(Number(timestamp));
  if (isNaN(dateObj.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(dateObj);
};

export async function fetchAdminReviewData(token) {
  if (!token) return { tasks: [], logs: [], aircrafts: [], claims: [] };
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const [tasksRes, logsRes, aircraftsRes, claimsRes] = await Promise.allSettled([
    fetch(`${API_URL}/review-tasks`, { headers }),
    fetch(`${API_URL}/review-logs`, { headers }),
    fetch(`${API_URL}/aircrafts`, { headers }),
    fetch(`${API_URL}/claims`, { headers }),
  ]);

  let tasks = [];
  let logs = [];
  let aircrafts = [];
  let claims = [];

  if (tasksRes.status === "fulfilled" && tasksRes.value.ok) {
    const data = await tasksRes.value.json();
    tasks = Array.isArray(data) ? data : data.tasks || [];
  }

  if (logsRes.status === "fulfilled" && logsRes.value.ok) {
    const data = await logsRes.value.json();
    logs = Array.isArray(data) ? data : data.logs || [];
  }

  if (aircraftsRes.status === "fulfilled" && aircraftsRes.value.ok) {
    const data = await aircraftsRes.value.json();
    aircrafts = Array.isArray(data) ? data : data.aircrafts || [];
  }

  if (claimsRes.status === "fulfilled" && claimsRes.value.ok) {
    const data = await claimsRes.value.json();
    claims = Array.isArray(data) ? data : data.claims || [];
  }

  return { tasks, logs, aircrafts, claims };
}

export async function submitReviewAction({ taskId, action, token }) {
  if (!token) return null;
  const res = await fetch(`${API_URL}/review-logs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      review_task_id: taskId,
      action,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || "Failed to update review status.");
  }

  return res.json();
}


export function normalizeQueueTasks({ apiTasks = [], aircrafts = [], claims = [], reviewItems = [] }) {
  const taskAircraftIds = new Set(apiTasks.map((t) => String(t.aircraft_id)).filter(Boolean));
  const taskClaimIds = new Set(apiTasks.map((t) => String(t.claim_id)).filter(Boolean));

  const fromTasks = apiTasks.map((task) => {
    const kindNormalized =
      task.kind?.charAt(0).toUpperCase() + task.kind?.slice(1).toLowerCase();
    const pilotName =
      task.pilot ||
      task.user?.fullname ||
      task.user?.name ||
      (task.admin_id ? `Admin #${task.admin_id}` : "Registered Pilot");
    const aircraftName =
      task.aircraft?.name ||
      task.aircraft ||
      (task.aircraft?.make && task.aircraft?.model ? `${task.aircraft.make} ${task.aircraft.model}` : null) ||
      (task.aircraft_id ? `Aircraft #${task.aircraft_id}` : "Aircraft N/A");

    return {
      id: task.id,
      rowKey: `task-${task.id}`,
      reference: task.reference || `REV-${task.id}`,
      type: kindNormalized || "Application",
      details: task.details || task.aircraft?.aircraft_type || "Pending verification",
      pilot: pilotName,
      aircraft: aircraftName,
      claimId: task.claim_id,
      aircraftId: task.aircraft_id,
      status: task.review_status || task.status || "Pending",
      submitted: relativeTime(task.submitted_at),
      submittedAt: task.submitted_at ? new Date(task.submitted_at).getTime() : Date.now(),
      source: "api",
    };
  });

  const fromAircraft = aircrafts
    .filter((aircraft) => !taskAircraftIds.has(String(aircraft.id)))
    .map((aircraft) => ({
      source: "aircraft",
      id: aircraft.id,
      rowKey: `aircraft-${aircraft.id}`,
      reference: aircraft.reference || `APP-${String(aircraft.id).slice(0, 8).toUpperCase()}`,
      pilot: aircraft.pilot || aircraft.user?.fullname || "Registered Pilot",
      aircraft: aircraft.name || `${aircraft.make || ""} ${aircraft.model || ""}`.trim() || aircraft.aircraft_type || "Aircraft",
      details: aircraft.selected_tier || aircraft.coverageTier || "Aircraft Application",
      type: "Application",
      status: aircraft.status || "Pending",
      submitted: relativeTime(aircraft.submitted_at || aircraft.submittedAt),
      submittedAt: aircraft.submitted_at
        ? new Date(aircraft.submitted_at).getTime()
        : aircraft.submittedAt || Date.now(),
    }));

 
  const fromClaims = claims
    .filter((claim) => !taskClaimIds.has(String(claim.id)))
    .map((claim) => ({
      source: "claim",
      id: claim.id,
      rowKey: `claim-${claim.id}`,
      claimId: claim.id,
      reference: claim.reference || claim.claim_reference || `CLM-${String(claim.id).slice(0, 8).toUpperCase()}`,
      pilot: claim.pilot || claim.user?.name || claim.user?.fullname || "Registered Pilot",
      aircraft:
        claim.aircraft?.name ||
        `${claim.aircraft?.make || ""} ${claim.aircraft?.model || ""}`.trim() ||
        claim.aircraft?.aircraft_type ||
        (claim.aircraft_id ? `Aircraft #${claim.aircraft_id}` : "Aircraft"),
      details: claim.incident_description || claim.type || "Claim Review",
      type: "Claim",
      status: claim.status || "Pending",
      submitted: relativeTime(claim.submitted_at || claim.submittedAt || claim.incident_date),
      submittedAt: claim.submitted_at
        ? new Date(claim.submitted_at).getTime()
        : claim.submittedAt || (claim.incident_date ? new Date(claim.incident_date).getTime() : Date.now()),
    }));

  const fromReviews = reviewItems.map((item) => ({
    source: "review",
    id: item.id,
    rowKey: `review-${item.id}`,
    reference: item.reference,
    pilot: item.pilot,
    aircraft: item.aircraft,
    details: item.detail || "Verification item",
    type: item.kind,
    status: item.status || "Pending",
    submitted: relativeTime(item.submittedAt),
    submittedAt: item.submittedAt,
  }));

  return [...fromTasks, ...fromAircraft, ...fromClaims, ...fromReviews].sort(
    (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
  );
}

export function normalizeActivityLogs({ apiLogs = [], reviewLog = [] }) {
  if (apiLogs.length > 0) {
    return apiLogs.map((log) => ({
      id: log.id,
      taskId: log.review_task_id,
      applicationId: log.review_task?.reference || `TASK #${log.review_task_id}`,
      action: log.action,
      type: log.review_task?.kind || "Review",
      time: formatLogTime(log.review_date || log.created_at),
      adminId: log.admin_id,
    }));
  }
  return reviewLog;
}
