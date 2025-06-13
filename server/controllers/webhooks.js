import { Webhook } from "svix";
import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString(); // raw Buffer
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const event = webhook.verify(payload, headers);
    const { data, type } = event;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          resume: "",
        };
        await User.create(userData);
        return res
          .status(200)
          .json({ success: true, message: "User created " });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData);

        return res
          .status(200)
          .json({ success: true, message: "User data updated" });
      }

      case "user.deleted": {
        await JobApplication.deleteMany({ userId: data.id });

        await User.findByIdAndDelete(data.id);

        return res.status(200).json({ success: true, message: "User deleted" });
      }

      default: {
        console.log("Unhandled Clerk event type:", type);
        return res.status(200).json({});
      }
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: "Webhook Error" });
  }
};
