import mongoose, { Schema, Document, Model } from "mongoose";
import crypto from "crypto";
import { OrganizationType, UserStatus } from "@/types";

// ============================================================
// User Mongoose Model
// ============================================================

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organizationName: string;
  organizationType: OrganizationType;
  department: string;
  designation: string;
  photoUrl: string;
  uniqueId: string;
  issueDate: Date | null;
  expiryDate: Date | null;
  status: UserStatus;
  verificationToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name must be under 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name must be under 50 characters"],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, "Email must be under 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number must be under 20 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [200, "Address must be under 200 characters"],
    },
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      maxlength: [100, "Organization name must be under 100 characters"],
    },
    organizationType: {
      type: String,
      enum: Object.values(OrganizationType),
      required: [true, "Organization type is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [100, "Department must be under 100 characters"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: [100, "Designation must be under 100 characters"],
    },
    photoUrl: {
      type: String,
      default: "",
    },
    uniqueId: {
      type: String,
      unique: true,
      sparse: true, // Allow null during pending state before assignment
    },
    issueDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
      required: true,
    },
    verificationToken: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        // Remove virtuals and passwords if any existed
        return ret;
      },
    },
  }
);

// --- Indexes ---
UserSchema.index({ uniqueId: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ organizationName: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ status: 1, createdAt: -1 }); // Compound for filtered queries



// --- Static: Generate a unique ID in format ORG-YYYY-NNNNNN ---
UserSchema.statics.generateUniqueId = async function (
  prefix = "ID"
): Promise<string> {
  const year = new Date().getFullYear();
  const basePrefix = prefix.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);

  let uniqueId: string;
  let exists = true;

  while (exists) {
    // Generate a random 6-digit sequential-looking number
    const sequence = Math.floor(100000 + Math.random() * 900000);
    uniqueId = `${basePrefix}-${year}-${sequence}`;
    exists = !!(await this.findOne({ uniqueId }));
  }

  return uniqueId!;
};

// --- Static: Generate a cryptographically secure verification token ---
UserSchema.statics.generateVerificationToken = function (): string {
  return crypto.randomBytes(32).toString("hex");
};

// Prevent model recompilation in Next.js hot reload
const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", UserSchema);

export default User;
