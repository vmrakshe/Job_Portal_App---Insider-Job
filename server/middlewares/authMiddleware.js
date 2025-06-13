import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const authenticateCompany = async (req, res, next) => {
  //   const token = req.headers.authorization?.split(" ")[1];
  //console.log(req.headers.token);
  const token = req.headers.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, Login again " });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const company = await Company.findById(decoded.id).select("-password");

    if (!company) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Company not found" });
    }

    req.company = company;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
