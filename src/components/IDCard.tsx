"use client";

import React, { forwardRef } from "react";
import { Shield } from "lucide-react";
import { formatDateISO } from "@/lib/utils";
import { UserStatus } from "@/types";

export interface IDCardProps {
  user: {
    fullName: string;
    photoUrl: string;
    uniqueId: string;
    designation: string;
    department: string;
    organizationName: string;
    issueDate: Date | string | null;
    expiryDate: Date | string | null;
    status: UserStatus;
  };
  qrCodeDataUrl: string;
  className?: string;
}

export const IDCard = forwardRef<HTMLDivElement, IDCardProps>(
  ({ user, qrCodeDataUrl, className = "" }, ref) => {
    // Exact CR80 aspect ratio (2.125 x 3.375). We use fixed pixel dimensions
    // to ensure html-to-image captures it perfectly without layout shifts.
    const width = 340;
    const height = 540;

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden bg-white ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
          borderRadius: "16px",
          fontFamily: "var(--font-geist-sans), sans-serif",
          // Ensure it's a solid block for HTML to Canvas
          transform: "translateZ(0)",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Background Patterns / Gradients */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 100% 0%, #1E40AF 0%, transparent 50%), radial-gradient(circle at 0% 100%, #1E40AF 0%, transparent 50%)"
          }}
        />

        {/* Header - Brand */}
        <div className="absolute top-0 left-0 right-0 h-[100px] bg-accent-navy flex flex-col items-center justify-center text-white"
             style={{ borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-white" />
            <span className="font-heading font-bold tracking-widest text-lg uppercase">
              HACKER गोवा HOUSE
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-widest uppercase opacity-80">
            Builder Social Card
          </span>
        </div>

        {/* User Photo */}
        <div className="absolute top-[60px] left-1/2 -translate-x-1/2">
          <div className="w-[120px] h-[120px] rounded-full bg-white p-1.5 shadow-md">
            <div className="w-full h-full rounded-full overflow-hidden bg-surface-raised relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={user.photoUrl || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} 
                alt={user.fullName}
                className="w-full h-full object-cover"
                crossOrigin="anonymous" // Important for html-to-image
              />
            </div>
          </div>
        </div>

        {/* Body - User Details */}
        <div className="absolute top-[195px] left-0 right-0 px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-ink leading-tight mb-1 truncate">
            {user.fullName}
          </h2>
          <p className="text-sm font-semibold text-accent-navy uppercase tracking-wide truncate">
            {user.designation}
          </p>
          {user.department && (
            <p className="text-xs text-ink-secondary mt-0.5 truncate">
              {user.department}
            </p>
          )}

          {user.organizationName !== "HACKER गोवा HOUSE" && (
            <div className="mt-3 inline-block px-3 py-1 bg-surface-raised rounded-full border border-divider">
              <p className="text-[11px] font-medium text-ink-secondary truncate max-w-[250px]">
                {user.organizationName}
              </p>
            </div>
          )}
        </div>

        {/* Status Badge (if not active) */}
        {user.status !== UserStatus.ACTIVE && (
          <div className="absolute top-[310px] left-0 right-0 flex justify-center">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase
              ${user.status === UserStatus.REVOKED ? 'bg-status-revoked-bg text-status-revoked' : ''}
              ${user.status === UserStatus.EXPIRED ? 'bg-status-expired-bg text-status-expired' : ''}
              ${user.status === UserStatus.PENDING ? 'bg-status-pending-bg text-status-pending' : ''}
            `}>
              {user.status}
            </div>
          </div>
        )}

        {/* Footer - QR and Metadata */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-[9px] font-bold text-ink-secondary uppercase tracking-widest mb-0.5">
                PASS ID
              </p>
              <p className="font-mono text-sm font-bold text-ink">
                {user.uniqueId || "PENDING"}
              </p>
            </div>
            
            <div className="flex gap-4">
              <div>
                <p className="text-[9px] font-bold text-ink-secondary uppercase tracking-widest mb-0.5">
                  Issued
                </p>
                <p className="text-[11px] font-medium text-ink">
                  {formatDateISO(user.issueDate)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-ink-secondary uppercase tracking-widest mb-0.5">
                  Valid Thru
                </p>
                <p className="text-[11px] font-medium text-ink">
                  {formatDateISO(user.expiryDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 p-1.5 bg-white rounded-xl shadow-sm border border-divider">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrCodeDataUrl} 
              alt="Verification QR" 
              className="w20 h-20"
              style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>
    );
  }
);

IDCard.displayName = "IDCard";
