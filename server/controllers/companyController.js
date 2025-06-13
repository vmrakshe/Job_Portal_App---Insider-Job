import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js"; // You'll need a mail utility

//Resister a new company

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Details are Missing" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({
        success: false,
        message: "Company already registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
      message: "Successfully registered!",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//company login

export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
      message: "Successfully signed in",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get company data

export const getCompanyData = async (req, res) => {
  try {
    // req.company is set by authenticateCompany middleware
    const company = req.company;
    //const company = await Company.findById(req.company._id).select("-password");
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Post a new job

export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category, postedAt } =
    req.body;
  const companyId = req.company._id;
  //console.log(companyId,{ title, description, location, salary})

  try {
    if (
      !title ||
      !description ||
      !location ||
      !companyId ||
      !salary ||
      !level ||
      !category
    ) {
      return res.json({
        success: false,
        message: "Required fields are missing",
      });
    }
    // Create new  job
    const newjob = new Job({
      title,
      description,
      location,
      salary,
      level,
      category,
      postedAt,
      companyId,
    });

    await newjob.save();
    res.json({
      success: true,
      message: "New job posted successfully!",
      newjob,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get company Job Applicants

export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;
    //find the job applications for the user and populate the related data
    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();

    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get company Posted jobs

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    // adding no of applicants info in data
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );
    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//change jog Application status (accept or reject)

export const changeJobApplicationsStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Application ID and status are required.",
      });
    }

    // Find job application and update status, return the updated document
    const updatedApplication = await JobApplication.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res
        .status(404)
        .json({ success: false, message: "Job application not found." });
    }

    res.json({
      success: true,
      message: "Status changed successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//change jog visibility

export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.companyId.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized: You can only change visibility of your own jobs",
      });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, message: "Job visibility updated", job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// route: POST /api/company/forgot-password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    // Generate reset token valid for 15 minutes
    const resetToken = jwt.sign(
      { id: company._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "5m",
      }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await sendMail(
      company.email,
      "Reset Your Password",
      `Click the link to reset your password: ${resetUrl}\n\n Note: This link will expire in five minutes.`
    );

    return res.json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// route: POST /api/company/reset-password/:token

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Company.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

//DELETE /api/user/delete
export const deleteAccount = async (req, res) => {
  try {
    const companyId = req?.company?._id;

    // Delete all jobs
    await Job.deleteMany({ companyId });

    // Delete all job applications related to this company
    await JobApplication.deleteMany({ companyId });

    // Delete the company
    await Company.findByIdAndDelete(companyId);

    return res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};