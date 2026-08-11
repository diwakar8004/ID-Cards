import mongoose, { Schema, Document, Model } from "mongoose";

// ============================================================
// Organization Settings Mongoose Model
// ============================================================

export interface ICardTheme {
  primaryColor: string;
  accentColor: string;
  headerBgColor: string;
  headerTextColor: string;
}

export interface IOrganizationDocument extends Document {
  organizationName: string;
  organizationLogoUrl: string;
  organizationAddress: string;
  organizationPhone: string;
  organizationEmail: string;
  organizationWebsite: string;
  defaultValidityDays: number;
  cardTheme: ICardTheme;
  showPhoneOnCard: boolean;
  showEmailOnCard: boolean;
  showAddressOnCard: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CardThemeSchema = new Schema<ICardTheme>(
  {
    primaryColor: { type: String, default: "#1E40AF" },
    accentColor: { type: String, default: "#0F172A" },
    headerBgColor: { type: String, default: "#1E40AF" },
    headerTextColor: { type: String, default: "#FFFFFF" },
  },
  { _id: false }
);

const OrganizationSchema = new Schema<IOrganizationDocument>(
  {
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      maxlength: [100, "Organization name must be under 100 characters"],
      default: "HACKER गोवा HOUSE",
    },
    organizationLogoUrl: {
      type: String,
      default: "",
    },
    organizationAddress: {
      type: String,
      trim: true,
      maxlength: [200, "Address must be under 200 characters"],
      default: "",
    },
    organizationPhone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone must be under 20 characters"],
      default: "",
    },
    organizationEmail: {
      type: String,
      lowercase: true,
      trim: true,
      maxlength: [100, "Email must be under 100 characters"],
      default: "",
    },
    organizationWebsite: {
      type: String,
      trim: true,
      default: "",
    },
    defaultValidityDays: {
      type: Number,
      default: 365,
      min: [1, "Validity must be at least 1 day"],
      max: [3650, "Validity cannot exceed 10 years"],
    },
    cardTheme: {
      type: CardThemeSchema,
      default: () => ({
        primaryColor: "#1E40AF",
        accentColor: "#0F172A",
        headerBgColor: "#1E40AF",
        headerTextColor: "#FFFFFF",
      }),
    },
    showPhoneOnCard: { type: Boolean, default: false },
    showEmailOnCard: { type: Boolean, default: false },
    showAddressOnCard: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

// There should only ever be one Organization settings document.
// Use findOneAndUpdate with upsert to enforce this.

// Prevent model recompilation in Next.js hot reload
const Organization: Model<IOrganizationDocument> =
  (mongoose.models.Organization as Model<IOrganizationDocument>) ||
  mongoose.model<IOrganizationDocument>("Organization", OrganizationSchema);

export default Organization;
