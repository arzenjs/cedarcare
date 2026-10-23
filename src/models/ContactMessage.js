import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);
