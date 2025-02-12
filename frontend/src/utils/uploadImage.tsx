import axiosInstance from "./axiosInstance"
import { API_PATHS } from "./helper"

const uplaodImage = async (imageFile: File) => {
  const formData = new FormData()

  formData.append("image", imageFile)

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log(response.data)

    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default uplaodImage