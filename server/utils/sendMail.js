// utils/sendMail.js
import nodemailer from "nodemailer";

const sendMail = async (to, subject, text) => {
  //console.log(process.env.MAIL_USER, process.env.MAIL_PASS); // TEMP only

  const transporter = nodemailer.createTransport({
    service: "Gmail", // or Mailtrap for dev
    auth: {
      user: process.env.COMPANY_MAIL,
      pass: process.env.COMPANY_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.COMPANY_MAIL,
    to,
    subject,
    text,
  });
};

export default sendMail;
