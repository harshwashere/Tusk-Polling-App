import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./helper";

const uploadImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, 
      formData, // Send formData correctly
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading the image: ", error);
    throw error;
  }
};

export default uploadImage;
