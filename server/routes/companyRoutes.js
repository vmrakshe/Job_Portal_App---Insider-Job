import express from "express";
import {
  changeJobApplicationsStatus,
  changeVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
  forgotPassword,
  resetPassword,
  deleteAccount,
} from "../controllers/companyController.js";
import uploadImageFile from "../config/multer.js";
import { authenticateCompany } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Company registration and login
router.post("/register", uploadImageFile.single("image"), registerCompany);
router.post("/login", loginCompany);

//get company data
router.get("/company", authenticateCompany, getCompanyData);

//post a new job
router.post("/post-job", authenticateCompany, postJob);

//get applicants data of company
router.get("/applicants", authenticateCompany, getCompanyJobApplicants);

//get company jot list
router.get("/list-jobs", authenticateCompany, getCompanyPostedJobs);

// change Application status and visibility
router.post("/change-status", authenticateCompany, changeJobApplicationsStatus);
router.post("/change-visibility", authenticateCompany, changeVisibility);

//delete the company account
router.delete("/delete", authenticateCompany, deleteAccount);

//forgot password
router.post("/forgot-password", forgotPassword);

//reset password
router.post("/reset-password/:token", resetPassword);

export default router;
