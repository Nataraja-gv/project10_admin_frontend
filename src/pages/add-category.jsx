import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addCategory } from "../services/category";

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category_name: "",
    category_description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // CLEAN UP PREVIEW URL
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

    if (!form.category_name || !form.image) {
      toast.error("Category name and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", form.category_name);
    formData.append("category_description", form.category_description);
    formData.append("category_image", form.image);

    try {
      setLoading(true);
      const res = await addCategory(formData);
      if (res) {
        toast.success("Category added successfully");
        navigate("/category");
      }
    } catch (error) {
      // handled in service
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Add Category
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Category Name"
            name="category_name"
            value={form.category_name}
            onChange={handleChange}
            margin="normal"
            required
          />

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

          {/* IMAGE UPLOAD */}
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {/* IMAGE PREVIEW */}
            {preview && (
              <Box mt={2}>
                <Typography variant="body2" mb={1}>
                  Preview:
                </Typography>
                <Box
                  component="img"
                  src={preview}
                  alt="Category Preview"
                  sx={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #ddd",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box display="flex" gap={2} mt={4}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : "Save"}
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

export default AddCategory;
