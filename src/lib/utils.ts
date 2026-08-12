import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserStatus, OrganizationType } from "@/types";

// ============================================================
// Utility Functions
// ============================================================

/** Tailwind class merger (standard shadcn/ui utility) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date value to a human-readable string.
 */
export function formatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-IN", options).format(d);
  } catch {
    return "Invalid date";
  }
}

/**
 * Format a date to ISO date string (YYYY-MM-DD) for ID cards.
 */
export function formatDateISO(date: Date | string | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toISOString().split("T")[0];
  } catch {
    return "Invalid date";
  }
}

/**
 * Calculate expiry date from issue date + validity days.
 */
export function calculateExpiryDate(
  issueDate?: Date,
  validityDays?: number
): Date {
  if (validityDays) {
    const expiry = new Date(issueDate || new Date());
    expiry.setDate(expiry.getDate() + validityDays);
    return expiry;
  }
  return new Date("2026-10-31T23:59:59.999Z");
}

/**
 * Check if a given date is in the past (expired).
 */
export function isExpired(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

/**
 * Generate a human-readable relative time string.
 */
export function relativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    return formatter.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 30) return formatter.format(diffDays, "day");
  if (Math.abs(diffDays) < 365) {
    return formatter.format(Math.round(diffDays / 30), "month");
  }
  return formatter.format(Math.round(diffDays / 365), "year");
}

/**
 * Get status badge CSS class based on user status.
 */
export function getStatusBadgeClass(status: UserStatus): string {
  const map: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "badge-active",
    [UserStatus.PENDING]: "badge-pending",
    [UserStatus.APPROVED]: "badge-pending",
    [UserStatus.EXPIRED]: "badge-expired",
    [UserStatus.REVOKED]: "badge-revoked",
    [UserStatus.REJECTED]: "badge-rejected",
  };
  return map[status] ?? "badge-rejected";
}

/**
 * Get a human-readable label for user status.
 */
export function getStatusLabel(status: UserStatus | string): string {
  const map: Record<string, string> = {
    [UserStatus.ACTIVE]: "Active",
    [UserStatus.PENDING]: "Pending Review",
    [UserStatus.APPROVED]: "Approved",
    [UserStatus.EXPIRED]: "Expired",
    [UserStatus.REVOKED]: "Revoked",
    [UserStatus.REJECTED]: "Rejected",
  };
  return map[status] ?? status;
}

/**
 * Get a human-readable label for organization type.
 */
export function getOrgTypeLabel(type: OrganizationType | string): string {
  return type;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Generate a URL-safe filename from a string.
 */
export function toSafeFilename(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get initials from a full name (max 2 chars).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

/**
 * Format file size in bytes to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Sanitize a MongoDB query string to prevent injection.
 */
export function sanitizeMongoQuery(input: string): string {
  return input.replace(/[$\.]/g, "");
}

/**
 * Safely parse JSON without throwing.
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
