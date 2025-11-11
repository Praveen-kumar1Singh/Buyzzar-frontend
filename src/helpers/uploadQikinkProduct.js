import axiosInstance from "./api";

export const uploadProductToQikink = async (productData) => {
  try {
    const res = await axiosInstance.post('/upload-product', productData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
