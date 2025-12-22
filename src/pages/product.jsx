import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Chip,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { allProducts } from "../services/product/getProducts";
import { deleteProduct } from "../services/product/product";

const ProductDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async (currentPage = page) => {
    try {
      setLoading(true);
      const res = await allProducts(currentPage, limit);
      setProducts(res?._payload || []);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await deleteProduct(deleteId);
      toast.success("Product deleted successfully");
      setDeleteId(null);
      fetchProducts(page);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box p={3}>
      {/* HEADER */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Inventory2OutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Product List
            </Typography>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/product/add")}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Add Product
          </Button>
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Image",
                  "Product Name",
                  "Category",
                  "Price",
                  "MRP",
                  "Stock",
                  "Status",
                  "Action",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{ fontWeight: 600, bgcolor: "#f9fafb" }}
                    align={head === "Action" ? "center" : "left"}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((prod) => (
                  <TableRow
                    key={prod._id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Avatar
                        src={prod.product_images?.[0]?.image_link}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {prod.product_name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {prod.category?.category_name || "-"}
                    </TableCell>

                    <TableCell>₹ {prod.product_price}</TableCell>
                    <TableCell>₹ {prod.mrp}</TableCell>

                    <TableCell>
                      <Chip
                        label={prod.stock}
                        size="small"
                        color={prod.stock > 0 ? "success" : "error"}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={prod.status ? "Active" : "Inactive"}
                        size="small"
                        color={prod.status ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        sx={{ bgcolor: "#f0f4ff", mr: 1 }}
                        onClick={() =>
                          navigate(`/product/edit/${prod._id}`, {
                            state: prod,
                          })
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        sx={{ bgcolor: "#fff0f0" }}
                        onClick={() => setDeleteId(prod._id)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <Box display="flex" justifyContent="center" py={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>

      {/* DELETE DIALOG */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle fontWeight={600}>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductDashboard;
