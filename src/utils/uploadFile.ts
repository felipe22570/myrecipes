import axios from "axios";
import FormData from "form-data";

export const uploadFile = async (
  file: File | string
): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("upload_preset", process.env.CLOUDINARY_PRESET);
  formData.append("file", file);

  try {
    const cloudinaryUrl = process.env.CLOUDINARY_URL ?? "";

    const upload = await axios.post(cloudinaryUrl, formData);

    return upload.data.secure_url;
  } catch (error) {
    console.error(error);
  }
};
