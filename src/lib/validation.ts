import { z } from "zod";
import { OrganizationType, UserStatus } from "@/types";

// ============================================================
// Zod Validation Schemas
// ============================================================

// --- User Registration ---

export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be under 100 characters"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must be under 20 characters")
    .regex(/^[+\d\s\-()]+$/, "Phone number contains invalid characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be under 200 characters"),
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Organization name must be under 100 characters"),
  organizationType: z.nativeEnum(OrganizationType, {
    errorMap: () => ({ message: "Please select a valid organization type" }),
  }),
  department: z
    .string()
    .min(1, "Department is required")
    .max(100, "Department must be under 100 characters"),
  designation: z
    .string()
    .min(1, "Designation/role is required")
    .max(100, "Designation must be under 100 characters"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

// --- Admin Login ---

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// --- User Update (Admin) ---

export const userUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50)
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50)
    .optional(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+\d\s\-()]+$/)
    .optional(),
  address: z.string().min(5).max(200).optional(),
  organizationName: z.string().min(1).max(100).optional(),
  organizationType: z.nativeEnum(OrganizationType).optional(),
  department: z.string().min(1).max(100).optional(),
  designation: z.string().min(1).max(100).optional(),
  expiryDate: z.string().datetime({ message: "Invalid expiry date" }).optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

// --- User Approve ---

export const approveUserSchema = z.object({
  validityDays: z
    .number()
    .int("Must be a whole number")
    .min(1, "Validity must be at least 1 day")
    .max(3650, "Validity cannot exceed 10 years")
    .default(365),
});

export type ApproveUserInput = z.infer<typeof approveUserSchema>;

// --- Reject User ---

export const rejectUserSchema = z.object({
  reason: z
    .string()
    .max(500, "Reason must be under 500 characters")
    .optional(),
});

export type RejectUserInput = z.infer<typeof rejectUserSchema>;

// --- Organization Settings ---

export const organizationSettingsSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .max(100),
  organizationAddress: z.string().max(200).optional().default(""),
  organizationPhone: z
    .string()
    .max(20)
    .regex(/^[+\d\s\-()]*$/, "Invalid phone format")
    .optional()
    .default(""),
  organizationEmail: z.string().email("Invalid email").optional().or(z.literal("")).default(""),
  organizationWebsite: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .default(""),
  defaultValidityDays: z
    .number()
    .int()
    .min(1)
    .max(3650)
    .default(365),
  showPhoneOnCard: z.boolean().default(false),
  showEmailOnCard: z.boolean().default(false),
  showAddressOnCard: z.boolean().default(false),
  cardTheme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").default("#1E40AF"),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#0F172A"),
    headerBgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#1E40AF"),
    headerTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  }).default({}),
});

export type OrganizationSettingsInput = z.infer<typeof organizationSettingsSchema>;

// --- Filter/Search Validation ---

export const userFilterSchema = z.object({
  search: z.string().max(100).optional(),
  status: z.union([z.nativeEnum(UserStatus), z.literal("ALL")]).optional(),
  organizationType: z
    .union([z.nativeEnum(OrganizationType), z.literal("ALL")])
    .optional(),
  department: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type UserFilterInput = z.infer<typeof userFilterSchema>;

// --- Manual Verify ---

export const manualVerifySchema = z.object({
  query: z
    .string()
    .min(1, "Please enter a Unique ID or verification code")
    .max(100, "Query is too long"),
});

export type ManualVerifyInput = z.infer<typeof manualVerifySchema>;
