import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios-instance";

export const deleteProduct = async (product_id) => {
  const config = {
    method: "DELETE",
    maxBodyLength: Infinity,
    url: `/product/delete/${product_id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const addProduct = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "/product/add",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const editProduct = async (data, product_id) => {
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `/product/edit/${product_id}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
