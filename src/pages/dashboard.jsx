import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { useNavigate } from "react-router-dom";

const MainDashboard = () => {
  const navigate = useNavigate();

  const statCards = [
    { label: "Categories", value: "0", icon: <CategoryIcon sx={{ fontSize: 40 }} /> },
    { label: "Products", value: "0", icon: <InventoryIcon sx={{ fontSize: 40 }} /> },
    { label: "Orders", value: "0", icon: <ShoppingCartIcon sx={{ fontSize: 40 }} /> },
  ];

  const quickActions = [
    { label: "View Categories", path: "/category", icon: <ListIcon /> },
    { label: "Add Category", path: "/category/add", icon: <AddIcon /> },
    { label: "View Products", path: "/products", icon: <ListIcon /> },
    { label: "Add Product", path: "/product/add", icon: <AddIcon /> },
    { label: "View Orders", path: "/orders", icon: <ShoppingCartIcon /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Page header */}
      <Typography variant="h5" fontWeight={600} mb={0.5}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Overview of your admin panel
      </Typography>

      {/* Stat cards row */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ color: "primary.main" }}>{card.icon}</Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {card.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Quick actions section */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Quick actions
      </Typography>
      <Grid container spacing={2}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.path + action.label}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{ py: 1.5, justifyContent: "flex-start" }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MainDashboard;
