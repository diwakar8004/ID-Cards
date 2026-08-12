import mongoose, { Schema, Document, Model } from "mongoose";

// ============================================================
// Admin Mongoose Model
// ============================================================

export interface IAdminDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, "Email must be under 100 characters"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Never return passwordHash in queries by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must be under 100 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: { [key: string]: unknown }) => {
        // NEVER expose passwordHash in API responses
        delete ret.passwordHash;
        delete ret.__v;
        const id = ret._id as { toString(): string } | undefined;
        ret.id = id?.toString();
        return ret;
      },
    },
  }
);

// --- Indexes ---
// NOTE: email index is created by `unique: true` on the schema field above;
// no redundant AdminSchema.index({ email: 1 }) needed.


// Prevent model recompilation in Next.js hot reload
const Admin: Model<IAdminDocument> =
  (mongoose.models.Admin as Model<IAdminDocument>) ||
  mongoose.model<IAdminDocument>("Admin", AdminSchema);

export default Admin;
