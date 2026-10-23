import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
    tokenHash: { type: String, required: true, unique: true }, // only the hash is stored
    role: { type: String, enum: ["admin", "staff"], required: true },
    expiresAt: { type: Date, required: true },
    usedAt: Date, // set once, atomically, when accepted (single use)
    revokedAt: Date,
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    emailState: { type: String, enum: ["sent", "failed", "skipped"], default: "failed" },
  },
  { timestamps: true }
);

invitationSchema.index({ email: 1, createdAt: -1 });

export default mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema);
