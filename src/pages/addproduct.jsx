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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { allCategory } from "../services/category";
// import { addProduct } from "../services/product/product";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    mrp: "",
    stock: "",
    category: "",
  });

  /* ---------------- FETCH CATEGORY ---------------- */
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await allCategory(1, 100);
      setCategories(res?._payload || []);
    };
    fetchCategory();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (Number(form.product_price) > Number(form.mrp)) {
      return toast.error("Product price must be less than MRP");
    }

    if (images.length === 0) {
      return toast.error("At least one image is required");
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    images.forEach((img) => {
      formData.append("product_images", img);
    });

    try {
    //   await addProduct(formData);
      toast.success("Product added successfully");
      navigate("/product");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Add failed");
    }
  };

  /* ---------------- DISCOUNT ---------------- */
  const discount =
    form.mrp && form.product_price
      ? Math.round(
          ((form.mrp - form.product_price) / form.mrp) * 100
        )
      : 0;

  return (
    <Box p={3}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Add New Product
        </Typography>

        <Grid container spacing={3}>
          {/* PRODUCT NAME */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
            />
          </Grid>

          {/* CATEGORY */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
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
          </Grid>

          {/* DESCRIPTION */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Product Description"
              name="product_description"
              value={form.product_description}
              onChange={handleChange}
            />
          </Grid>

          {/* PRICE */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Product Price"
              name="product_price"
              value={form.product_price}
              onChange={handleChange}
            />
          </Grid>

          {/* MRP */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="MRP"
              name="mrp"
              value={form.mrp}
              onChange={handleChange}
            />
          </Grid>

          {/* STOCK */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </Grid>

          {/* DISCOUNT */}
          {discount > 0 && (
            <Grid item xs={12}>
              <Chip
                color="success"
                label={`Discount: ${discount}%`}
              />
            </Grid>
          )}

          {/* IMAGE UPLOAD */}
          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              Upload Product Images
              <input
                hidden
                multiple
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {images.length > 0 && (
              <Typography mt={1} variant="body2">
                {images.length} image(s) selected
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* ACTION BUTTONS */}
        <Stack direction="row" spacing={2} mt={4}>
          <Button variant="contained" onClick={handleSubmit}>
            Save Product
          </Button>
          <Button variant="outlined" onClick={() => navigate("/product")}>
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AddProduct;
