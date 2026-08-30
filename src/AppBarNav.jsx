import { AppBar, Avatar, Badge, Box, Divider, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import femaleLogo from "./assets/female-logo.png";
import maleLogo from "./assets/male-logo.avif";
import "./AppBarNav.css";

const NAV_LINKS = ["Dashboard", "Plans", "Claims", "My Policies", "Aircraft"];

const NAV_ROUTES = {
  Dashboard: "/dashboard",
  Plans: "/plan-compare",
  Claims: "/claims",
  "My Policies": "/my-policies",
  Aircraft: "/aircrafts",
};

export default function AppBarNav({ gender = "" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const storedGender = localStorage.getItem("selectedGender") || "";
  const storedName = localStorage.getItem("fullname") || "Captain";
  const userRole = localStorage.getItem("role") || "";
  const isAdmin = String(userRole).toUpperCase() === "ADMIN";
  const currentGender = gender || storedGender;
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    handleClose();
    navigate("/");
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} className="ag-appbar">
      <Toolbar className="ag-toolbar">
        <Box className="ag-brand" onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
          <Box className="ag-logo-mark" />
          <p className="ag-brand-name">AVIAGUARD</p>
        </Box>

        {!isAdmin && (
          <Box className="ag-nav">
            {NAV_LINKS.map((label) => (
              <p
                key={label}
                className={`ag-nav-link ${pathname === NAV_ROUTES[label] ? "ag-nav-link--active" : ""}`}
                onClick={() => navigate(NAV_ROUTES[label])}
              >
                {label}
              </p>
            ))}
          </Box>
        )}

        <Badge
          color="error"
          overlap="circular"
          onClick={handleAvatarClick}
          sx={{ cursor: "pointer", ml: isAdmin ? "auto" : undefined }}
        >
          <Avatar
            alt="User Avatar"
            src={currentGender === "female" ? femaleLogo : maleLogo}
            className="ag-avatar"
          />
        </Badge>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 3,
              className: "ag-user-menu",
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                overflow: "visible",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 20,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>{storedName}</Typography>
            <Typography sx={{ fontSize: 13, color: "#64748b" }}>
              {isAdmin ? "Administrator Account" : "Pilot Account"}
            </Typography>
          </Box>
          <Divider />

          <MenuItem onClick={handleLogout} sx={{ py: 1.25, gap: 1.5, color: "#dc2626" }}>
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <LogoutIcon fontSize="small" sx={{ color: "#dc2626" }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: 14 }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
