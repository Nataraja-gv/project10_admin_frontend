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
