import { Router } from "express";
import { getuser, login, register } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const authroute = Router();

authroute.post("/register", register);

authroute.post("/login", login);

authroute.get("/getuser", protect, getuser);

authroute.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file upload" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    return res.status(500).json({ error })
  }
});

export default authroute;
