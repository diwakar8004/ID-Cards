"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PassPreview, DownloadActions } from "@/components/PassPreview";
import type { IDCardProps } from "@/components/IDCard";

interface CardData {
  fullName: string;
  photoUrl: string;
  uniqueId: string;
  organizationName: string;
  organizationType: string;
  department: string;
  designation: string;
  issueDate: string | null;
  expiryDate: string | null;
  status: string;
  verificationToken: string;
}

// ─── Decorative tropical palm for LeftPanel ─────────────────────────────────
function TinyPalm() {
  return (
    <svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "40px", height: "60px", opacity: 0.18 }}>
      <path d="M18 60 Q17 42 16 30 Q14 18 12 8" stroke="#0A5C2E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M12 8 Q4 2 0 -2" stroke="#1A8040" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M12 8 Q10 0 13 -4" stroke="#1A8040" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M12 8 Q20 2 26 4" stroke="#1A8040" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M12 8 Q20 10 28 14" stroke="#1A8040" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ─── Left editorial panel ────────────────────────────────────────────────────
function LeftPanel() {
  return (
    <div
      className="h-screen flex flex-col justify-between py-16 px-8 lg:px-12 xl:px-16 relative overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      {/* Subtle dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(10,92,46,0.06) 1px, transparent 1px)",
          backgroundSize:  "20px 20px",
        }}
      />

      {/* Top-right decorative palm */}
      <div className="absolute top-4 right-4 pointer-events-none" aria-hidden="true">
        <TinyPalm />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="w-full max-w-md relative z-10">

        {/* Status pill */}
        <div className="flex items-center gap-2.5 mb-7">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--pink)" }}
          />
          <span
            className="font-mono text-[0.6rem] uppercase tracking-[0.2em] font-bold"
            style={{ color: "var(--pink)" }}
          >
            PASS GENERATED
          </span>
        </div>

        {/* Hero headline */}
        <h1
          className="font-heading font-black uppercase tracking-tight leading-[0.85] mb-8"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            color:    "var(--forest)",
          }}
        >
          YOUR
          <br />
          BUILDER
          <br />
          PASS IS
          <br />
          <span style={{ color: "var(--pink)" }}>READY.</span>
        </h1>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-8 max-w-sm"
          style={{ color: "var(--text-muted-green)" }}
        >
          Your Goa pass has been generated. Scan the QR code or open the
          verification page to confirm authenticity.
        </p>

        {/* Divider */}
        <div style={{ height:"1px", background:"var(--divider)", marginBottom:"28px" }} />

        {/* Event identity */}
        <div className="space-y-2">
          <p
            className="font-heading font-bold text-sm uppercase tracking-widest"
            style={{ color: "var(--forest)" }}
          >
            HACKER HOUSE GOA 2026
          </p>
          <p
            className="font-heading font-black uppercase tracking-tight leading-none"
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
              color:    "var(--forest)",
            }}
          >
            BUILD.{" "}
            <span style={{ color: "var(--pink)" }}>CONNECT.</span>{" "}
            SHIP.
          </p>
        </div>
      </div>

      {/* ── FOOTER BLOCK ── */}
      <div className="w-full max-w-md relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {/* गोवा wordmark */}
            <span
              className="font-heading font-black uppercase tracking-tight text-base"
              style={{ color: "var(--forest)" }}
            >
              HACKER
            </span>
            <span
              style={{
                display:         "inline-flex",
                alignItems:      "center",
                justifyContent:  "center",
                background:      "var(--pink)",
                color:           "#fff",
                border:          "2px solid #FF85CC",
                borderRadius:    "5px",
                padding:         "1px 7px",
                fontSize:        "0.8rem",
                fontWeight:      900,
                lineHeight:      1.3,
                fontFamily:      "var(--font-outfit), system-ui, sans-serif",
              }}
            >
              गोवा
            </span>
            <span
              className="font-heading font-black uppercase tracking-tight text-base"
              style={{ color: "var(--forest)" }}
            >
              HOUSE
            </span>
          </div>

          <p
            className="font-mono text-[0.6rem] uppercase tracking-widest"
            style={{ color: "var(--text-muted-green)" }}
          >
            BUILDER SOCIAL CARD GENERATOR
          </p>

          <div
            className="text-xs space-y-0.5"
            style={{ color: "var(--text-muted-green)" }}
          >
            <p>GOA, INDIA</p>
            <p>OCT 28 – 31, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right pass preview panel ────────────────────────────────────────────────
function RightPanel({ user }: { user: CardData }) {
  const [cardRef, setCardRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null);
  const [qrReady, setQrReady]   = useState(false);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(175deg, #073D1E 0%, #051F10 100%)" }}
    >
      {/* Tropical dot-grid bg */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(245,197,24,0.05) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
        }}
      />

      {/* Radial amber glow behind card */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top:       "50%",
          left:      "50%",
          width:     "420px",
          height:    "420px",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Card */}
      <div className="flex justify-center mb-8 relative z-10">
        <PassPreview
          user={user as IDCardProps["user"]}
          verificationToken={user.verificationToken}
          onQrReady={() => setQrReady(true)}
          onCardRef={setCardRef}
        />
      </div>

      {/* Download buttons */}
      {cardRef && (
        <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
          <DownloadActions
            user={user as IDCardProps["user"]}
            cardRef={cardRef}
            ready={qrReady}
          />
        </div>
      )}

      {/* Verify block */}
      <div className="w-full max-w-[390px] relative z-10">
        <div
          className="rounded-xl p-4"
          style={{
            background:  "rgba(7,61,30,0.6)",
            border:      "1px solid rgba(245,197,24,0.18)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p
                className="font-mono text-[0.6rem] uppercase tracking-widest mb-1"
                style={{ color: "rgba(245,197,24,0.5)" }}
              >
                VERIFY THIS PASS
              </p>
              <p
                className="font-mono text-xs break-all"
                style={{ color: "rgba(253,251,247,0.45)" }}
              >
                /verify/{user.uniqueId}
              </p>
            </div>
            <Link
              href={`/verify/${user.verificationToken}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider flex-shrink-0 px-4 py-2 rounded-lg transition-all"
              style={{
                background: "rgba(245,197,24,0.12)",
                border:     "1px solid rgba(245,197,24,0.3)",
                color:      "#F5C518",
              }}
            >
              OPEN VERIFY PAGE
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LeftPanel, RightPanel };
