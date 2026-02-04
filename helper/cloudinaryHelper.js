import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dsvhbwxwy",
  api_key: "765513725191429",
  api_secret: "6XeRHBrhc1M0NpFj9zuPspzZTQc", // Click 'View API Keys' above to copy your API secret
});

const uploadImageOnCloudinary = async (filePath, folderName) => {
  try {
    // uploading image from server
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    // delete image from server
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log("Faild to delete image from server", error);
    }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteImageOnCloudinary = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    if (res.result !== "ok") {
      throw new Error("Image not Found");
    }

    return res;
  } catch (error) {
    throw error;
  }
};

export { uploadImageOnCloudinary, deleteImageOnCloudinary };
