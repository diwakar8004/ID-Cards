import mongoose, { Schema, Document, Model } from "mongoose";
import { UserStatus, VerificationResult } from "@/types";

// ============================================================
// Verification Log Mongoose Model
// ============================================================

export interface IVerificationLogDocument extends Document {
  verificationToken: string;
  uniqueId: string;
  timestamp: Date;
  result: VerificationResult;
  status: UserStatus | "INVALID";
  // Deliberately omitting: IP, user-agent, personal info
}

const VerificationLogSchema = new Schema<IVerificationLogDocument>(
  {
    verificationToken: {
      type: String,
      required: true,
      index: true,
    },
    uniqueId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    result: {
      type: String,
      enum: Object.values(VerificationResult),
      required: true,
    },
    status: {
      type: String,
      enum: [...Object.values(UserStatus), "INVALID"],
      required: true,
    },
  },
  {
    timestamps: false, // We use our own timestamp field for clarity
    toJSON: {
      transform: (_doc, ret: { [key: string]: unknown }) => {
        delete ret.__v;
        const id = ret._id as { toString(): string } | undefined;
        ret.id = id?.toString();
        return ret;
      },
    },
  }
);

// --- Indexes ---
VerificationLogSchema.index({ timestamp: -1 });
VerificationLogSchema.index({ verificationToken: 1, timestamp: -1 }); // Compound for per-token history
VerificationLogSchema.index({ uniqueId: 1, timestamp: -1 });

// Auto-expire logs after 90 days (privacy-preserving TTL)
VerificationLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// Prevent model recompilation in Next.js hot reload
const VerificationLog: Model<IVerificationLogDocument> =
  (mongoose.models.VerificationLog as Model<IVerificationLogDocument>) ||
  mongoose.model<IVerificationLogDocument>(
    "VerificationLog",
    VerificationLogSchema
  );

export default VerificationLog;
