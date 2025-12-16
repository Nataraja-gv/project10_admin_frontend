 import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsAuthenticated, setUser } from "../feature/user-slice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // MENU OPEN
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // MENU CLOSE
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // NAVIGATION HANDLER
  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // LOGOUT
  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(setIsAuthenticated(false));
    localStorage.removeItem("token");
    navigate("/sign-in", { replace: true });
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        {/* MENU ICON */}
        <IconButton
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        {/* MENU ITEMS */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleNavigate("/category")}>
            Category
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/products")}>
            Products
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/orders")}>
            Orders List
          </MenuItem>
        </Menu>

        {/* TITLE */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>

        {/* LOGOUT */}
        {user && (
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
