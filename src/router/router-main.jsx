import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/not-found";
import MainDashboard from "../pages/dashboard";
import Category from "../pages/category";
import SignupPageModel from "../pages/signin-model";
import MainLayout from "../layout/main-layout";
import AddCatgory from "../pages/add-category";
import EditCatgory from "../pages/edit-category";
import ProductDashboard from "../pages/product";
import AddEditProduct from "../pages/addproduct";

const RouterMain = () => {
  return (
    <Routes>
      {/* AUTH ROUTE (NO LAYOUT) */}
      <Route path="/sign-in" element={<SignupPageModel />} />

      {/* ROUTES WITH MAIN LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/add" element={<AddCatgory />} />
        <Route path="/category/edit/:id" element={<EditCatgory />} />

        <Route path="/products" element={<ProductDashboard />} />
        <Route path="/product/add" element={<AddEditProduct />} />
        <Route path="/product/edit/:_id" element={<AddEditProduct />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterMain;
