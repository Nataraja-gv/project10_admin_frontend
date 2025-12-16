 
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios-instance";

export const AuthProfile = async (data) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `/auth/profile`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
     console.log(error)
  }
};
