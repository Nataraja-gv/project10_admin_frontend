import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { AuthProfile } from "../services/profile";
import { setIsAuthenticated, setUser } from "../feature/user-slice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // If already authenticated → do nothing
    if (isAuthenticated && user) return;

    const fetchProfile = async () => {
      try {
        const res = await AuthProfile();

        if (res?.data) {
          dispatch(setUser(res.data));
          dispatch(setIsAuthenticated(true));
        } else {
          navigate("/sign-in", { replace: true });
        }
      } catch (error) {
       
        navigate("/sign-in", { replace: true });
      }
    };

    fetchProfile();
  }, [dispatch, navigate, isAuthenticated, user]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <Navbar />

      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
