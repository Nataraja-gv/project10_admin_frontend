import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-instance";

export const allCategory = async (currentPage, limit) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `/category/all`,
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      page: currentPage,
      page_size: limit,
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const addCategory = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/category/add`,
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

export const editCategory = async (data, id) => {
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `/category/update/${id}`,
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

export const deleteCategory = async (category_id) => {
  const config = {
    method: "DELETE",
    maxBodyLength: Infinity,
    url: `/category/delete/${category_id}`,
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
