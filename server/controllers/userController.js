import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import { v2 as cloudinary } from "cloudinary";
import Job from "../models/Job.js";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const auth = req.auth?.(); // safe fallback
    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated: Missing or invalid Clerk token",
      });
    }

    const user = await User.findById(auth.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        userId: auth.userId,
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const userId = req.auth().userId;
    // console.log(userId);
    const { jobId } = req.body;

    if (!jobId || !userId) {
      return res.json({
        success: false,
        message: "Job ID and User ID are required",
      });
    }

    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      jobId,
      userId,
    });
    if (existingApplication) {
      return res.json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.json({
        success: false,
        message: "Job Not Found",
      });
    }

    // Create new job application
    const jobApplication = await JobApplication.create({
      jobId,
      userId,
      companyId: jobData.companyId,
    });

    res.json({
      success: true,
      message: "Application submitted successfully",
      jobApplication,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const applications = await JobApplication.find({ userId })
      .populate({
        path: "companyId",
        select: "name email image",
      })
      .populate({
        path: "jobId",
        select: "title description location category level salary",
      })
      .exec();
    // .sort({ createdAt: -1 });

    if (!applications) {
      return res.json({
        success: false,
        message: "No job applications found for this user",
      });
    }

    res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user profile (only resume)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const resumeFile = req.file;

    //console.log(resumeFile)
    if (!resumeFile) {
      return res.json({
        success: false,
        message: "Resume URL or data is required",
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
    userData.resume = resumeUpload.secure_url;

    await userData.save();

    res.json({
      success: true,
      message: "Resume updated successfully",
      userData,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//DELETE /api/users/delete-application/:id

export const deleteJobApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.auth().userId;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Optional: Ensure user owns the application
    if (application.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await JobApplication.findByIdAndDelete(id);

    res.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
