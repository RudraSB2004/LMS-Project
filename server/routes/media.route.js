import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

router.post("/upload-video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("Uploaded File:", req.file); // Debugging
    const result = await uploadMedia(req.file.buffer, "video"); // Ensure the resource type is "video"
    console.log("Cloudinary Response:", result); // Debugging
    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      data: {
        url: result.secure_url, // Ensure this is videoUrl
        public_id: result.public_id, // Ensure this is publicId
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

export default router;
