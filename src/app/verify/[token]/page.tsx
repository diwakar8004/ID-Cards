"use client";

import { useEffect, useState, use } from "react";
import { UserStatus } from "@/types";
import { formatDateISO } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface VerifyPageProps {
  params: Promise<{ token: string }>;
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const { token } = use(params);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/verify/${token}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setResult(json.data);
        else setError(json.error || "Verification failed");
      })
      .catch(() => setError("Network error during verification."))
      .finally(() => setLoading(false));
  }, [token]);

  // ── LOADING ────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-paper paper-texture flex flex-col">
        {/* Nav strip */}
        <div className="border-b border-divider bg-paper">
          <div className="section-container">
            <div className="h-14 flex items-center">
              <span className="section-label">PASS VERIFICATION / HACKER गोवा HOUSE</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <Loader2 className="w-6 h-6 animate-spin text-forest" />
          <p className="section-label">AUTHENTICATING SECURE TOKEN…</p>
        </div>
      </main>
    );
  }

  // ── NOT FOUND / ERROR ──────────────────────────────────────
  if (error || !result) {
    return (
      <main className="min-h-screen bg-paper paper-texture flex flex-col">
        <div className="border-b border-divider bg-paper">
          <div className="section-container">
            <div className="h-14 flex items-center justify-between">
              <span className="section-label">PASS VERIFICATION</span>
              <Link href="/" className="section-label hover:text-forest transition-fast flex items-center gap-1.5">
                <ArrowLeft className="w-3 h-3" /> HOME
              </Link>
            </div>
          </div>
        </div>

        <div className="section-container py-20">
          <div className="max-w-sm">
            <p className="section-label mb-4" style={{ color: "var(--pink)" }}>— VERIFICATION RESULT</p>
            <h1
              className="font-heading font-black uppercase tracking-tight leading-none mb-4"
              style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: "var(--pink)" }}
            >
              INVALID
              <br />PASS
            </h1>
            <p className="text-sm text-ink-secondary leading-relaxed mb-8">
              {error || "This pass token could not be found or is not valid."}
            </p>
            <Link href="/" className="btn-secondary">
              RETURN TO HOME
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { status, user, verifiedAt } = result;

  const isActive = status === UserStatus.ACTIVE;
  const isRevoked = status === UserStatus.REVOKED;
  const isExpired = status === UserStatus.EXPIRED;

  const statusLabel = isActive
    ? "VERIFIED"
    : isRevoked
    ? "REVOKED"
    : isExpired
    ? "EXPIRED"
    : status.toUpperCase();

  const statusColor = isActive
    ? "var(--status-active)"
    : isRevoked
    ? "var(--pink)"
    : isExpired
    ? "var(--status-expired)"
    : "var(--ink-secondary)";

  return (
    <main className="min-h-screen bg-paper paper-texture flex flex-col">

      {/* ── Top nav strip ── */}
      <div className="border-b border-divider bg-paper">
        <div className="section-container">
          <div className="h-14 flex items-center justify-between">
            <span className="section-label">PASS VERIFICATION / HACKER गोवा HOUSE</span>
            <Link href="/" className="section-label hover:text-forest transition-fast flex items-center gap-1.5">
              <ArrowLeft className="w-3 h-3" /> HOME
            </Link>
          </div>
        </div>
      </div>

      <div className="section-container py-12 lg:py-20 flex-1">
        <div className="max-w-lg">

          {/* Status word mark */}
          <p className="section-label mb-3" style={{ color: statusColor }}>
            — VERIFICATION RESULT
          </p>
          <h1
            className="font-heading font-black uppercase tracking-tight leading-none mb-2"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 6rem)",
              color: statusColor,
            }}
          >
            {statusLabel}
          </h1>
          <p className="font-heading font-bold text-xl uppercase tracking-widest text-near-black mb-10">
            BUILDER PASS
          </p>

          <hr className="border-divider mb-10" />

          {/* User identity block */}
          <div className="flex gap-6 items-start mb-10">
            {/* Photo */}
            <div
              className="shrink-0 w-20 h-24 overflow-hidden border border-divider"
              style={{ filter: !isActive ? "grayscale(1) opacity(0.6)" : "none" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.photoUrl || ""}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-2xl font-bold text-near-black leading-tight mb-1 truncate">
                {user.fullName}
              </h2>
              <p className="section-label mb-1">{user.designation}</p>
              {user.organizationName !== "HACKER गोवा HOUSE" && (
                <p className="text-sm text-ink-secondary truncate">{user.organizationName}</p>
              )}
            </div>
          </div>

          {/* Metadata table */}
          <div className="border border-divider divide-y divide-divider">
            {[
              { label: "PASS ID", value: user.uniqueId || "PENDING", mono: true },
              { label: "AFFILIATION", value: "HACKER गोवा HOUSE" },
              { label: "ISSUED", value: formatDateISO(user.issueDate) || "—" },
              { label: "VALID THRU", value: formatDateISO(user.expiryDate) || "—" },
              { label: "VERIFIED AT", value: new Date(verifiedAt).toLocaleString("en-IN") },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3 gap-4">
                <span className="section-label shrink-0">{row.label}</span>
                <span
                  className={`text-sm font-medium text-right truncate ${row.mono ? "font-mono" : ""}`}
                  style={{ color: "var(--near-black)" }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <p className="section-label mt-8 text-center">
            SECURED BY HACKER गोवा HOUSE
          </p>
        </div>
      </div>
    </main>
  );
}
