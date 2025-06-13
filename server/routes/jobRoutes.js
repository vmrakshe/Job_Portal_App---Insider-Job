import express from "express";
import {
  getJobById,
  getJobs,
  deleteJobById,
} from "../controllers/jobController.js";
import { authenticateCompany } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Routes to ger all jobs data
router.get("/", getJobs);

//Route to get a single job by id
router.get("/:id", getJobById);

//delete the job by id
router.delete("/delete-job/:id", authenticateCompany, deleteJobById);

export default router;
