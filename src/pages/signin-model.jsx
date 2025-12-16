import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AuthSingup, ResendOTP, verifyOtp } from "../services/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setUser } from "../feature/user-slice";
import { useNavigate } from "react-router-dom";

const SignupPageModel = ({ closeModal }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_name: "",
    email: "",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const modalRef = useRef(null);

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [closeModal]);

  // SIGNUP
  const handleSignup = async () => {
    if (!form.user_name || !form.email) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await AuthSingup(form);
      if (res) {
        toast.success("OTP sent successfully");
        setStep(2);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // OTP INPUT
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // VERIFY OTP → REDIRECT HOME
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 4) {
      toast.error("Please enter full OTP");
      return;
    }

    try {
      setOtpLoading(true);
      const res = await verifyOtp({
        email: form.email,
        otp: finalOtp,
      });

      if (res) {
        toast.success("OTP Verified");

        dispatch(setUser(res?.data));
        dispatch(setIsAuthenticated(true));
        navigate("/");
        closeModal();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const res = await ResendOTP(form.email);
      if (res) toast.success("OTP resent");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      {/* CLOSE */}
      <IconButton
        onClick={closeModal}
        sx={{ position: "absolute", top: 24, right: 24, color: "#fff" }}
      >
        <CloseIcon />
      </IconButton>

      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            width: 420,
            borderRadius: 4,
            p: 4,
            boxShadow: 24,
          }}
        >
          {/* IMAGE */}
          <Box display="flex" justifyContent="center" mb={3}>
            <Avatar
              src="/images/auth-banner.png"
              sx={{ width: 90, height: 90 }}
            />
          </Box>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Typography variant="h5" align="center" fontWeight={600}>
                Login / Signup
              </Typography>

              <Typography align="center" color="text.secondary" mb={3}>
                Enter your details to continue
              </Typography>

              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                value={form.user_name}
                onChange={(e) =>
                  setForm({ ...form, user_name: e.target.value })
                }
              />

              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Continue"}
              </Button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Typography variant="h5" align="center" fontWeight={600}>
                Verify OTP
              </Typography>

              <Typography align="center" color="text.secondary" mb={3}>
                Code sent to {form.email}
              </Typography>

              <Box display="flex" justifyContent="center" gap={2} mb={3}>
                {[0, 1, 2, 3].map((i) => (
                  <TextField
                    key={i}
                    inputRef={(el) => (inputRefs.current[i] = el)}
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: 20 },
                    }}
                    sx={{ width: 56 }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleVerifyOtp}
                disabled={otpLoading}
              >
                {otpLoading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>

              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2 }}
                onClick={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? "Sending again..." : "Resend OTP"}
              </Button>
            </>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default SignupPageModel;
