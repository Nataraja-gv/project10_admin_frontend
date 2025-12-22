import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios-instance";

export const allProducts = async (currentPage, limit) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `/product/all`,
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