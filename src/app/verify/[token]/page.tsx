"use client";

import { useEffect, useState, use } from "react";
import { Shield, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { UserStatus } from "@/types";
import { formatDateISO } from "@/lib/utils";
import Link from "next/link";

interface VerifyPageProps {
  params: Promise<{ token: string }>;
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const { token } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // We add a minimum 1.5s delay to the animation to make the scanning feel "thorough"
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/verify/${token}`);
        const json = await res.json();
        
        if (res.ok && json.success) {
          setResult(json.data);
        } else {
          setError(json.error || "Verification failed");
        }
      } catch (err) {
        setError("Network error occurred during verification.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Radar-like scanning animation background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-[120vw] h-[120vw] border-[1px] border-accent-navy rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-[80vw] h-[80vw] border-[1px] border-accent-navy rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        </div>

        <div className="text-center z-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-divider relative">
            <Shield className="w-10 h-10 text-accent-navy" />
            <div className="absolute inset-0 border-2 border-accent-navy border-t-transparent rounded-full animate-spin" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-ink mb-2">Verifying Pass</h1>
          <p className="text-ink-secondary text-sm">Authenticating secure token...</p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm card-base p-8 text-center animate-fade-in-up border-status-revoked/20">
          <div className="w-20 h-20 bg-status-revoked-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-status-revoked" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-ink mb-2">Invalid Pass</h1>
          <p className="text-ink-secondary text-sm mb-8">{error || "This pass could not be found or is completely invalid."}</p>
          <Link href="/" className="btn-secondary w-full justify-center">
            Return to Homepage
          </Link>
        </div>
      </main>
    );
  }

  const { isValid, status, user, verifiedAt } = result;

  const getStatusConfig = () => {
    switch (status) {
      case UserStatus.ACTIVE:
        return { icon: CheckCircle2, color: "text-status-active", bg: "bg-status-active-bg", title: "Valid Pass" };
      case UserStatus.EXPIRED:
        return { icon: AlertTriangle, color: "text-status-expired", bg: "bg-status-expired-bg", title: "Expired Pass" };
      case UserStatus.REVOKED:
        return { icon: XCircle, color: "text-status-revoked", bg: "bg-status-revoked-bg", title: "Revoked Pass" };
      case UserStatus.PENDING:
        return { icon: AlertTriangle, color: "text-status-pending", bg: "bg-status-pending-bg", title: "Pending Approval" };
      default:
        return { icon: XCircle, color: "text-status-revoked", bg: "bg-status-revoked-bg", title: "Invalid Pass" };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <main className="min-h-screen bg-canvas pb-12">
      {/* Dynamic Status Header */}
      <div className={`px-6 py-12 text-center transition-colors duration-500 ${config.bg}`}>
        <div className="animate-fade-in-up">
          <Icon className={`w-16 h-16 mx-auto mb-4 ${config.color}`} />
          <h1 className={`font-heading text-4xl font-bold mb-2 ${config.color}`}>{config.title}</h1>
          <p className={`text-sm font-medium opacity-80 ${config.color}`}>
            Verified on {new Date(verifiedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-10 animate-fade-in-up stagger-1">
        <div className="card-base p-6 shadow-lg">
          {/* User Photo */}
          <div className="flex justify-center -mt-16 mb-4">
            <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-raised relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.photoUrl || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} 
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="text-center mb-8 border-b border-divider pb-6">
            <h2 className="font-heading text-2xl font-bold text-ink mb-1">{user.fullName}</h2>
            <p className="text-sm font-semibold text-accent-navy uppercase tracking-wide">
              {user.designation}
            </p>
            {user.organizationName !== "HACKER गोवा HOUSE" && (
              <p className="text-sm text-ink-secondary mt-1">
                {user.organizationName}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-divider/50">
              <span className="text-sm text-ink-secondary font-medium">Pass ID</span>
              <span className="font-mono text-sm font-bold text-ink">{user.uniqueId || "PENDING"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-divider/50">
              <span className="text-sm text-ink-secondary font-medium">Affiliation</span>
              <span className="text-sm font-medium text-ink text-right max-w-[60%] truncate">
                HACKER गोवा HOUSE
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-divider/50">
              <span className="text-sm text-ink-secondary font-medium">Issued</span>
              <span className="text-sm font-medium text-ink">
                {formatDateISO(user.issueDate)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-ink-secondary font-medium">Valid Thru</span>
              <span className="text-sm font-medium text-ink">
                {formatDateISO(user.expiryDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-ink-secondary text-xs font-medium opacity-60">
          <Shield className="w-4 h-4" />
          Secured by HACKER गोवा HOUSE
        </div>
      </div>
    </main>
  );
}
