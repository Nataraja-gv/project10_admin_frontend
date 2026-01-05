import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Stack,
  Chip,
  Card,
  CardContent,
  Divider,
  Avatar,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { allCategory } from "../services/category";
import { addProduct, editProduct } from "../services/product/product";

const AddProduct = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isEdit = Boolean(state);

  const [categories, setCategories] = useState([]);

  // 🔥 IMAGE STATES (VERY IMPORTANT)
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [form, setForm] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    mrp: "",
    stock: "",
    category: "",
    status: true,
  });

  /* ---------------- FETCH CATEGORY ---------------- */
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await allCategory(1, 100);
      setCategories(res?._payload || []);
    };
    fetchCategory();
  }, []);

  /* ---------------- EDIT MODE PREFILL ---------------- */
  useEffect(() => {
    if (isEdit && state) {
      setForm({
        product_name: state.product_name,
        product_description: state.product_description,
        product_price: state.product_price,
        mrp: state.mrp,
        stock: state.stock,
        category: state.category?._id,
        status: state.status,
      });

      setExistingImages(state.product_images || []);
    }
  }, [isEdit, state]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setForm((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  // ✅ FIXED IMAGE ADD (APPEND)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setNewImages((prev) => {
      if (prev.length + files.length > 5) {
        toast.error("Maximum 5 images allowed");
        return prev;
      }
      return [...prev, ...files];
    });

    // 🔑 important to avoid clearing bug
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    const requiredFields = {
      product_name: "Product name",
      product_description: "Description",
      product_price: "Selling price",
      mrp: "MRP",
      stock: "Stock",
      category: "Category",
    };

    for (const key in requiredFields) {
      if (!form[key]) {
        return toast.error(`${requiredFields[key]} is required`);
      }
    }

    if (Number(form.product_price) > Number(form.mrp)) {
      return toast.error("Selling price must be less than MRP");
    }

    if (!isEdit && newImages.length === 0) {
      return toast.error("Upload at least one image");
    }

    if (isEdit && newImages.length === 0 && existingImages.length === 0) {
      return toast.error("At least one image is required");
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    if (newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append("product_images", file);
      });
    }

    if (
      existingImages?.map((img) =>
        formData.append("product_images", img.image_link)
      )
    )
      try {
        if (isEdit) {
          const res = await editProduct(formData, state._id);
          if (res) {
            toast.success("Product updated successfully");
            navigate("/products");
          }
        } else {
          const res = await addProduct(formData);
          if (res) {
            toast.success("Product added successfully");
            navigate("/products");
          }
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed");
      }
  };

  const discount =
    form.mrp && form.product_price
      ? Math.round(((form.mrp - form.product_price) / form.mrp) * 100)
      : 0;

  /* ---------------- UI ---------------- */
  return (
    <Box p={4} bgcolor="#f4f6f8" minHeight="100vh">
      <Typography variant="h4" fontWeight={700} mb={3}>
        {isEdit ? "Edit Product" : "Add Product"}
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Product Name"
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                />

                <TextField
                  select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  name="product_description"
                  value={form.product_description}
                  onChange={handleChange}
                />

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      label="Selling Price"
                      type="number"
                      name="product_price"
                      value={form.product_price}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="MRP"
                      type="number"
                      name="mrp"
                      value={form.mrp}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Stock"
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                {discount > 0 && (
                  <Chip label={`Discount ${discount}%`} color="success" />
                )}
                <FormControlLabel
                  sx={{ mt: 4 }}
                  control={
                    <Switch
                      checked={form.status}
                      onChange={handleStatusChange}
                    />
                  }
                  label={form.status ? "Active" : "Inactive"}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={600}>Product Images</Typography>

              <Box
                component="label"
                sx={{
                  border: "2px dashed #ccc",
                  p: 3,
                  borderRadius: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  mt: 2,
                }}
              >
                <CloudUploadOutlinedIcon fontSize="large" />
                <Typography>Click to upload</Typography>
                <input
                  hidden
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {existingImages.map((img, i) => (
                  <Grid item xs={4} key={`old-${i}`}>
                    <Box position="relative">
                      <Avatar
                        src={img.image_link}
                        variant="rounded"
                        sx={{ width: "100%", height: 100 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeExistingImage(i)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "white",
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}

                {newImages.map((img, i) => (
                  <Grid item xs={4} key={`new-${i}`}>
                    <Box position="relative">
                      <Avatar
                        src={URL.createObjectURL(img)}
                        variant="rounded"
                        sx={{ width: "100%", height: 100 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeNewImage(i)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "white",
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* STATUS */}

      {/* ACTION BAR */}
      <Paper
        sx={{
          mt: 4,
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          borderRadius: 3,
        }}
      >
        <Button variant="outlined" onClick={() => navigate("/products")}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? "Update Product" : "Save Product"}
        </Button>
      </Paper>
    </Box>
  );
};

export default AddProduct;
