import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Avatar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { editCategory } from "../services/category";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    category_name: "",
    category_description: "",
    status: true,
    image: null, // FILE only
  });

  const [preview, setPreview] = useState(null); // new image preview
  const [oldImage, setOldImage] = useState(null); // existing image URL

  // ✅ SET DATA FROM LOCATION STATE
  useEffect(() => {
    if (state && Object.keys(state).length > 0) {
      setForm({
        category_name: state.category_name || "",
        category_description: state.category_description || "",
        status: state.status ?? true,
        image: null,
      });

      setOldImage(state?.category_image?.image_link || null);
    }

    setFetching(false);
  }, [state]);

  // ✅ CLEAN PREVIEW URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // STATUS CHANGE
  const handleStatusChange = (e) => {
    setForm((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category_name) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", form.category_name);
    formData.append("category_description", form.category_description);
    formData.append("status", form.status);

    if (form.image) {
      formData.append("category_image", form.image);
    }

    try {
      setLoading(true);
      await editCategory(formData, id);
      toast.success("Category updated successfully");
      navigate("/category");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Edit Category
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <TextField
            fullWidth
            label="Category Name"
            name="category_name"
            value={form.category_name}
            onChange={handleChange}
            margin="normal"
            required
          />

          {/* DESCRIPTION */}
          <TextField
            fullWidth
            label="Description"
            name="category_description"
            value={form.category_description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          {/* STATUS */}
          <FormControlLabel
            control={
              <Switch checked={form.status} onChange={handleStatusChange} />
            }
            label={form.status ? "Active" : "Inactive"}
          />

          {/* IMAGE */}
          <Box mt={3}>
            <Typography variant="body2" mb={1}>
              Category Image
            </Typography>

            {(preview || oldImage) && (
              <Avatar
                src={preview || oldImage}
                variant="rounded"
                sx={{ width: 120, height: 120 }}
              />
            )}

            <Box mt={2}>
              <Button variant="outlined" component="label">
                Change Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
          </Box>

          {/* ACTIONS */}
          <Box display="flex" gap={2} mt={4}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : "Update"}
            </Button>

            <Button variant="outlined" onClick={() => navigate("/category")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditCategory;
