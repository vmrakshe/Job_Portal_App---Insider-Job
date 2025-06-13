import express from "express";
import { requireAuth } from "@clerk/express";

import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
  deleteJobApplication,
} from "../controllers/userController.js";

import uploadPdfFile from "../config/multer.js";

const router = express.Router();

// Get user data
router.get("/user", requireAuth(), getUserData);

//Apply for a job
router.post("/apply", applyForJob);

//Get applied job data
router.get("/applications", getUserJobApplications);

//delete applied job application
router.delete("/delete-application/:id", deleteJobApplication);

//Update user profile (resume)
router.post("/update-resume", uploadPdfFile.single("resume"), updateUserResume);

export default router;
