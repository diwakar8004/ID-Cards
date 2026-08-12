"use client";

import React, { useState, useEffect, useCallback } from "react";
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
      <path d="M18 60 Q17 42 16 30 Q14 18 12 8" stroke="#0A5C2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M12 8 Q4 2 0 -2" stroke="#1A8040" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 8 Q10 0 13 -4" stroke="#1A8040" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 8 Q20 2 26 4" stroke="#1A8040" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 8 Q20 10 28 14" stroke="#1A8040" strokeWidth="1.5" strokeLinecap="round" fill="none" />
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
          backgroundSize: "20px 20px",
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
            color: "var(--forest)",
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
        <div style={{ height: "1px", background: "var(--divider)", marginBottom: "28px" }} />

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
              color: "var(--forest)",
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
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--pink)",
                color: "#fff",
                border: "2px solid #FF85CC",
                borderRadius: "5px",
                padding: "1px 7px",
                fontSize: "0.8rem",
                fontWeight: 900,
                lineHeight: 1.3,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
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
  const [qrReady, setQrReady] = useState(false);
  // Responsive card scale: shrink the visual card to fit the viewport
  // while the actual DOM node stays 340×540 px for crisp PNG export.
  const [cardScale, setCardScale] = useState(1);

  const computeScale = useCallback(() => {
    const availH = window.innerHeight;
    const availW = window.innerWidth / 2; // right half of split layout
    const CARD_H = 540;
    const CARD_W = 340;
    // Reserve space: header (122px) + buttons (~60px) + verify block (~80px) + margins (80px)
    const reservedH = 342;
    const reservedW = 80;
    const scaleH = (availH - reservedH) / CARD_H;
    const scaleW = (availW - reservedW) / CARD_W;
    setCardScale(Math.min(1, scaleH, scaleW));
  }, []);

  useEffect(() => {
    const runResize = () => requestAnimationFrame(computeScale);
    runResize();
    window.addEventListener("resize", runResize);
    return () => window.removeEventListener("resize", runResize);
  }, [computeScale]);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden select-none"
      style={{
        backgroundImage:    "url('/images/right_panel_bg.png')",
        backgroundSize:     "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Subtle dark overlay so UI elements stay readable over illustration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(3, 28, 14, 0.30) 0%, rgba(3, 28, 14, 0.55) 100%)",
        }}
      />

      {/* ── REAL PHYSICAL PASS CONTAINER ── */}
      <div className="relative z-10 mb-6"
        style={{
          // Scale the visual representation without affecting the DOM element size
          // so html-to-image still captures the full 340×540 px canvas
          transform:     `scale(${cardScale})`,
          transformOrigin: "center center",
          // Compensate layout space so siblings aren't pushed by original size
          marginTop:    `${(540 * (cardScale - 1)) / 2}px`,
          marginBottom: `${(540 * (cardScale - 1)) / 2}px`,
        }}
      >
        {/* Subtle 3-D floating tilt */}
        <div
          style={{
            transform:  "perspective(1200px) rotateY(-2deg) rotateX(2deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <PassPreview
            user={user as IDCardProps["user"]}
            verificationToken={user.verificationToken}
            onQrReady={() => setQrReady(true)}
            onCardRef={setCardRef}
          />
        </div>
      </div>

      {/* Download buttons */}
      {cardRef && (
        <div className="flex items-center justify-center gap-4 mb-6 relative z-20">
          <DownloadActions
            user={user as IDCardProps["user"]}
            cardRef={cardRef}
            ready={qrReady}
          />
        </div>
      )}

      {/* Verify block */}
      <div className="w-full max-w-[390px] relative z-20">
        <div
          className="rounded-2xl p-4"
          style={{
            background:     "rgba(3, 31, 16, 0.75)",
            border:         "1px solid rgba(245, 197, 24, 0.3)",
            backdropFilter: "blur(12px)",
            boxShadow:      "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p
                className="font-mono text-[0.6rem] uppercase tracking-widest mb-1"
                style={{ color: "rgba(245, 197, 24, 0.6)" }}
              >
                VERIFY THIS PASS
              </p>
              <p
                className="font-mono text-xs break-all"
                style={{ color: "rgba(253, 251, 247, 0.6)" }}
              >
                /verify/{user.uniqueId}
              </p>
            </div>
            <Link
              href={`/verify/${user.verificationToken}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider flex-shrink-0 px-4 py-2 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #F5C518 0%, #E6A800 100%)",
                color:      "#031F10",
                boxShadow:  "0 4px 12px rgba(245, 197, 24, 0.35)",
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
