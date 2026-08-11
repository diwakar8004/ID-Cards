// ============================================================
// IDVerify — TypeScript Type Definitions
// ============================================================

// --- Enums ---

export enum OrganizationType {
  COLLEGE = "College",
  UNIVERSITY = "University",
  COMPANY = "Company",
  SCHOOL = "School",
  ORGANIZATION = "Organization",
  OTHER = "Other",
}

export enum UserStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
  REJECTED = "REJECTED",
}

// --- Core User Type ---

export interface IUser {
  _id: string;
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
  issueDate: Date | string | null;
  expiryDate: Date | string | null;
  status: UserStatus;
  verificationToken: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Public-facing user data (safe to expose)
export interface IUserPublic {
  verificationStatus: UserStatus;
  photoUrl: string;
  fullName: string;
  uniqueId: string;
  organizationName: string;
  organizationType: OrganizationType;
  department: string;
  designation: string;
  issueDate: Date | string | null;
  expiryDate: Date | string | null;
  status: UserStatus;
}

// --- Admin Type ---

export interface IAdmin {
  _id: string;
  email: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// --- Organization Settings ---

export interface IOrganizationSettings {
  _id: string;
  organizationName: string;
  organizationLogoUrl: string;
  organizationAddress: string;
  organizationPhone?: string;
  organizationEmail?: string;
  organizationWebsite?: string;
  defaultValidityDays: number;
  cardTheme: CardTheme;
  showPhoneOnCard: boolean;
  showEmailOnCard: boolean;
  showAddressOnCard: boolean;
  updatedAt: Date | string;
}

export interface CardTheme {
  primaryColor: string;
  accentColor: string;
  headerBgColor: string;
  headerTextColor: string;
}

// --- Verification Log ---

export interface IVerificationLog {
  _id: string;
  verificationToken: string;
  uniqueId: string;
  timestamp: Date | string;
  result: VerificationResult;
  status: UserStatus | "INVALID";
}

export enum VerificationResult {
  FOUND = "FOUND",
  NOT_FOUND = "NOT_FOUND",
  ERROR = "ERROR",
}

// --- API Response Types ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- Dashboard Statistics ---

export interface DashboardStats {
  totalUsers: number;
  pendingApplications: number;
  activeIds: number;
  expiredIds: number;
  revokedIds: number;
  rejectedApplications: number;
  approvedIds: number;
  recentRegistrations: number;
}

// --- User Filter/Search Params ---

export interface UserFilterParams {
  search?: string;
  status?: UserStatus | "ALL";
  organizationType?: OrganizationType | "ALL";
  department?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// --- Registration Form ---

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  organizationName: string;
  organizationType: OrganizationType;
  department: string;
  designation: string;
  photo: File;
}

// --- Admin Form ---

export interface AdminLoginFormData {
  email: string;
  password: string;
}

// --- Session ---

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
}

// --- Verification Response ---

export interface VerificationResponse {
  isValid: boolean;
  status: UserStatus | "INVALID";
  user?: IUserPublic;
  verifiedAt: string;
}
