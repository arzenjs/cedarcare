import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    passwordHash: { type: String, required: true, select: false }, // never returned by default queries
    role: { type: String, enum: ["admin", "staff"], required: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
