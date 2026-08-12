"use client";

import React, { forwardRef } from "react";
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

// ─── STATUS BADGE COLORS ─────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  [UserStatus.REVOKED]:  { bg: "rgba(220,38,38,0.22)",   text: "#FF6B6B", border: "rgba(220,38,38,0.55)"  },
  [UserStatus.EXPIRED]:  { bg: "rgba(217,119,6,0.22)",   text: "#FBBF24", border: "rgba(217,119,6,0.55)"  },
  [UserStatus.PENDING]:  { bg: "rgba(124,58,237,0.22)",  text: "#C4B5FD", border: "rgba(124,58,237,0.55)" },
  [UserStatus.REJECTED]: { bg: "rgba(100,116,139,0.22)", text: "#CBD5E1", border: "rgba(100,116,139,0.55)"},
};

// ─── CARD DIMENSIONS & COORDINATES ───────────────────────────────────────────
const W = 340;
const H = 540;

// Header / Divider top line
const HEADER_DIVIDER_Y = 124;

// Photo sits comfortably in the upper-middle section below header (UNTOUCHED)
const PHOTO_D     = 104;
const PHOTO_TOP   = 138;
const PHOTO_BOTTOM= PHOTO_TOP + PHOTO_D; // 242px

// Identity block starts 12px below photo (UNTOUCHED)
const IDENTITY_TOP = PHOTO_BOTTOM + 12;   // 254px

// Footer divider line (EXACTLY AS IT WAS - UNTOUCHED)
const DIVIDER_Y   = H - 128; // 412px
const DATA_BOTTOM = 18;

// ─── BACKGROUND SVG ──────────────────────────────────────────────────────────
function CardBackgroundSVG() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        {/* Card body gradient */}
        <linearGradient id="cg-body" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%"   stopColor="#0D5C2C" />
          <stop offset="40%"  stopColor="#073D1E" />
          <stop offset="100%" stopColor="#031A0C" />
        </linearGradient>

        {/* Sun disc radial */}
        <radialGradient id="cg-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFF59D" />
          <stop offset="55%"  stopColor="#F5C518" />
          <stop offset="100%" stopColor="#E6A800" stopOpacity="0.9" />
        </radialGradient>

        {/* Sun glow halo */}
        <radialGradient id="cg-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#F5C518" stopOpacity="0.35" />
          <stop offset="60%"  stopColor="#F5C518" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#F5C518" stopOpacity="0"   />
        </radialGradient>

        {/* Pink corner glow */}
        <radialGradient id="cg-pink" cx="0%" cy="100%" r="60%">
          <stop offset="0%"   stopColor="#E91E8C" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#E91E8C" stopOpacity="0"   />
        </radialGradient>

        {/* Gold divider line gradient */}
        <linearGradient id="cg-gold-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#F5C518" stopOpacity="0"   />
          <stop offset="25%"  stopColor="#F5C518" stopOpacity="0.65"/>
          <stop offset="75%"  stopColor="#F5C518" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#F5C518" stopOpacity="0"   />
        </linearGradient>

        {/* Footer dark gradient */}
        <linearGradient id="cg-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#031A0C" stopOpacity="0"   />
          <stop offset="100%" stopColor="#010B05" stopOpacity="0.95"/>
        </linearGradient>

        {/* Vignette overlay */}
        <radialGradient id="cg-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="55%"  stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
        </radialGradient>

        <clipPath id="cg-clip">
          <rect x="0" y="0" width={W} height={H} rx="24" ry="24" />
        </clipPath>
      </defs>

      <g clipPath="url(#cg-clip)">

        {/* ── Card body background */}
        <rect x="0" y="0" width={W} height={H} fill="url(#cg-body)" />

        {/* ── Dot grid */}
        {Array.from({ length: 22 }).flatMap((_, r) =>
          Array.from({ length: 14 }).map((_, c) => (
            <circle key={`d${r}${c}`} cx={c * 26 + 13} cy={r * 26 + 13} r="0.85" fill="#F5C518" opacity="0.08" />
          ))
        )}

        {/* ── Bottom-left pink accent glow */}
        <ellipse cx="0" cy={H} rx="170" ry="170" fill="url(#cg-pink)" />

        {/* ──────────────────────────── SUN GRAPHIC ──────────────────────────── */}
        {/* Positioned at cy=34px as a radiant sun crown at the top center of the header */}
        <circle cx={W / 2} cy="34" r="55" fill="url(#cg-sun-glow)" />
        <circle cx={W / 2} cy="34" r="32" fill="#F5C518" fillOpacity="0.10" />
        <circle cx={W / 2} cy="34" r="18" fill="url(#cg-sun)" />
        {/* Rays radiating around sun crown */}
        {Array.from({ length: 16 }).map((_, i) => {
          const deg = i * 22.5;
          const rad = (deg * Math.PI) / 180;
          const long = i % 2 === 0;
          const r1 = 22, r2 = long ? 40 : 32;
          const cx = W / 2, cy = 34;
          return (
            <line
              key={`ray${i}`}
              x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
              stroke="#F5C518"
              strokeWidth={long ? 2 : 1.3}
              strokeLinecap="round"
              opacity={long ? 0.75 : 0.45}
            />
          );
        })}

        {/* ──────────────────────────── PALMS ─────────────────────────── */}
        {/* LEFT palm */}
        <path d="M -15 200 Q 12 145 28 100 Q 40 65 48 45"
          stroke="#186030" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M 48 45 Q 16 28 -4 12" stroke="#1E9448" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M 48 45 Q 28 20 32 0"  stroke="#1E9448" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.8"/>
        <path d="M 48 45 Q 64 25 78 18" stroke="#1E9448" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.75"/>
        <path d="M 48 45 Q 72 42 88 50" stroke="#1E9448" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.65"/>
        <circle cx="51" cy="50" r="4" fill="#6B3A1F" opacity="0.6"/>

        {/* RIGHT palm */}
        <path d="M 355 200 Q 328 145 312 100 Q 300 65 292 45"
          stroke="#186030" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M 292 45 Q 324 28 344 12" stroke="#1E9448" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M 292 45 Q 312 20 308 0"  stroke="#1E9448" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.8"/>
        <path d="M 292 45 Q 276 25 262 18" stroke="#1E9448" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.75"/>
        <path d="M 292 45 Q 268 42 252 50" stroke="#1E9448" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.65"/>
        <circle cx="289" cy="50" r="4" fill="#6B3A1F" opacity="0.6"/>

        {/* ──────────────────────────── WAVES ─────────────────────────── */}
        {/* Below top header line */}
        <path d={`M 0 ${HEADER_DIVIDER_Y + 6} Q ${W*.125} ${HEADER_DIVIDER_Y+1} ${W*.25} ${HEADER_DIVIDER_Y+6} Q ${W*.375} ${HEADER_DIVIDER_Y+11} ${W*.5} ${HEADER_DIVIDER_Y+6} Q ${W*.625} ${HEADER_DIVIDER_Y+1} ${W*.75} ${HEADER_DIVIDER_Y+6} Q ${W*.875} ${HEADER_DIVIDER_Y+11} ${W} ${HEADER_DIVIDER_Y+6}`}
          fill="none" stroke="#F5C518" strokeWidth="1.2" opacity="0.25"/>

        {/* Above footer data section */}
        <path d={`M 0 ${DIVIDER_Y+8} Q ${W*.125} ${DIVIDER_Y+2} ${W*.25} ${DIVIDER_Y+8} Q ${W*.375} ${DIVIDER_Y+14} ${W*.5} ${DIVIDER_Y+8} Q ${W*.625} ${DIVIDER_Y+2} ${W*.75} ${DIVIDER_Y+14} ${W} ${DIVIDER_Y+8}`}
          fill="none" stroke="#F5C518" strokeWidth="1.2" opacity="0.25"/>

        {/* ──────────────────────────── TROPICAL LEAF ACCENTS ─────────── */}
        {/* Left leaf accent */}
        <path d="M 10 330 Q -10 306 10 288 Q 30 270 48 292 Q 66 314 44 330 Q 28 340 10 330Z"
          fill="#186030" fillOpacity="0.2" stroke="#22A050" strokeWidth="1.5" opacity="0.4"/>
        {/* Right leaf accent */}
        <path d={`M ${W-10} 330 Q ${W+10} 306 ${W-10} 288 Q ${W-30} 270 ${W-48} 292 Q ${W-66} 314 ${W-44} 330 Q ${W-28} 340 ${W-10} 330Z`}
          fill="#186030" fillOpacity="0.2" stroke="#22A050" strokeWidth="1.5" opacity="0.4"/>

        {/* ──────────────────────────── SEPARATORS ────────────────────── */}
        {/* Top header divider */}
        <rect x="20" y={HEADER_DIVIDER_Y} width={W - 40} height="1" fill="url(#cg-gold-line)" />

        {/* Footer divider line (EXACTLY AS REQUIRED) */}
        <rect x="20" y={DIVIDER_Y} width={W - 40} height="1" fill="url(#cg-gold-line)" />

        {/* Footer dark background */}
        <rect x="0" y={DIVIDER_Y - 16} width={W} height={H - DIVIDER_Y + 16} fill="url(#cg-bottom)" />

        {/* ──────────────────────────── CORNER FESTIVAL MARKS ─────────── */}
        <path d="M 28 0 L 46 0 M 0 28 L 0 46" stroke="#F5C518" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        <path d={`M ${W-46} 0 L ${W-28} 0 M ${W} 28 L ${W} 46`} stroke="#F5C518" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        <path d={`M 28 ${H} L 46 ${H} M 0 ${H-28} L 0 ${H-46}`} stroke="#F5C518" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
        <path d={`M ${W-46} ${H} L ${W-28} ${H} M ${W} ${H-28} L ${W} ${H-46}`} stroke="#F5C518" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>

        {/* ──────────────────────────── BORDER & VIGNETTE ─────────────── */}
        <rect x="0" y="0" width={W} height={H} rx="24" ry="24" fill="none" stroke="rgba(245,197,24,0.28)" strokeWidth="1.5"/>
        <rect x="0" y="0" width={W} height={H} rx="24" ry="24" fill="url(#cg-vignette)"/>

      </g>
    </svg>
  );
}

// ─── MAIN CARD COMPONENT ─────────────────────────────────────────────────────
export const IDCard = forwardRef<HTMLDivElement, IDCardProps>(
  ({ user, qrCodeDataUrl, className = "" }, ref) => {
    const statusColors = STATUS_COLORS[user.status];

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{
          width:        `${W}px`,
          height:       `${H}px`,
          borderRadius: "24px",
          fontFamily:   "var(--font-geist-sans), sans-serif",
          transform:    "translateZ(0)",
          background:   "#041508",
          boxShadow: [
            "0 0 0 1.5px rgba(245,197,24,0.28)",
            "0 4px 8px rgba(0,0,0,0.30)",
            "0 24px 56px rgba(0,0,0,0.55)",
            "0 0 90px rgba(10,92,46,0.30)",
          ].join(", "),
        }}
      >
        {/* ── LAYER 0: Background SVG (sun crown, palms, waves, leaves, grid) */}
        <CardBackgroundSVG />

        {/* ── LAYER 1: TOP HEADER BRANDING (y = 0 to 124px) ──────────── */}
        <div
          style={{
            position:       "absolute",
            top:            0,
            left:           0,
            right:          0,
            height:         `${HEADER_DIVIDER_Y}px`,
            zIndex:         10,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",   // Balanced vertical alignment across header
            paddingTop:     "4px",
          }}
        >
          {/* HOT PINK गोवा badge */}
          <div style={{ marginBottom: "5px" }}>
            <span style={{
              display:        "inline-flex",
              alignItems:     "center",
              justifyContent: "center",
              background:     "linear-gradient(135deg, #E91E8C 0%, #C2185B 100%)",
              color:          "#FFFFFF",
              border:         "2px solid rgba(255,133,204,0.75)",
              borderRadius:   "7px",
              padding:        "2px 9px",
              fontSize:       "13px",
              fontWeight:     900,
              lineHeight:     1.2,
              fontFamily:     "var(--font-outfit), system-ui, sans-serif",
              letterSpacing:  "-0.01em",
              boxShadow:      "0 2px 12px rgba(233,30,140,0.55), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
              गोवा
            </span>
          </div>

          {/* HACKER HOUSE Title */}
          <div style={{
            fontFamily:    "var(--font-outfit), system-ui, sans-serif",
            fontWeight:    900,
            fontSize:      "15px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color:         "#F5C518",
            lineHeight:    1,
            textShadow:    "0 0 20px rgba(245,197,24,0.65), 0 1px 4px rgba(0,0,0,0.9)",
          }}>
            HACKER HOUSE
          </div>

          {/* Subtitle tag */}
          <div style={{
            fontFamily:    "var(--font-geist-mono), monospace",
            fontSize:      "7.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(245,197,24,0.6)",
            marginTop:     "4px",
          }}>
            BUILDER SOCIAL CARD
          </div>
        </div>

        {/* ── LAYER 2: MIDDLE SECTION - PROFILE PHOTO (UNTOUCHED) ── */}
        <div
          style={{
            position:  "absolute",
            left:      "50%",
            transform: "translateX(-50%)",
            top:       `${PHOTO_TOP}px`,
            zIndex:    12,
          }}
        >
          {/* Conic festival ring */}
          <div style={{
            width:        `${PHOTO_D}px`,
            height:       `${PHOTO_D}px`,
            borderRadius: "50%",
            padding:      "3px",
            background:   "conic-gradient(from 0deg, #F5C518 0deg, #E91E8C 120deg, #22A050 230deg, #F5C518 360deg)",
            boxShadow:    "0 0 0 2px rgba(245,197,24,0.15), 0 0 28px rgba(245,197,24,0.28), 0 8px 32px rgba(0,0,0,0.65)",
          }}>
            {/* Dark gap ring */}
            <div style={{
              width:        "100%",
              height:       "100%",
              borderRadius: "50%",
              padding:      "2.5px",
              background:   "#041508",
            }}>
              {/* Photo */}
              <div style={{
                width:        "100%",
                height:       "100%",
                borderRadius: "50%",
                overflow:     "hidden",
                background:   "#0A5C2E",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.photoUrl || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}
                  alt={user.fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── LAYER 3: MIDDLE SECTION - IDENTITY BLOCK (UNTOUCHED) ── */}
        <div
          style={{
            position:  "absolute",
            left:      "16px",
            right:     "16px",
            top:       `${IDENTITY_TOP}px`,
            textAlign: "center",
            zIndex:    11,
          }}
        >
          {/* Full Name */}
          <h2 style={{
            fontFamily:    "var(--font-outfit), system-ui, sans-serif",
            fontSize:      "21px",
            fontWeight:    900,
            lineHeight:    1.15,
            letterSpacing: "-0.01em",
            color:         "#FDFBF7",
            margin:        "0 0 5px 0",
            whiteSpace:    "nowrap",
            overflow:      "hidden",
            textOverflow:  "ellipsis",
            textShadow:    "0 1px 12px rgba(0,0,0,0.7)",
          }}>
            {user.fullName}
          </h2>

          {/* Designation */}
          <p style={{
            fontFamily:    "var(--font-geist-sans), sans-serif",
            fontSize:      "11px",
            fontWeight:    700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color:         "#F5C518",
            margin:        "0 0 4px 0",
            whiteSpace:    "nowrap",
            overflow:      "hidden",
            textOverflow:  "ellipsis",
          }}>
            {user.designation}
          </p>

          {/* Department */}
          {user.department && (
            <p style={{
              fontFamily:   "var(--font-geist-sans), sans-serif",
              fontSize:     "10px",
              color:        "rgba(253,251,247,0.48)",
              margin:       "0",
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
            }}>
              {user.department}
            </p>
          )}

          {/* Organization / Event Badge */}
          <div style={{
            display:        "inline-flex",
            marginTop:      "10px",
            padding:        "4px 14px",
            background:     "rgba(245,197,24,0.09)",
            border:         "1px solid rgba(245,197,24,0.25)",
            borderRadius:   "999px",
          }}>
            <p style={{
              fontFamily:   "var(--font-geist-sans), sans-serif",
              fontSize:     "10px",
              fontWeight:   600,
              color:        "rgba(245,197,24,0.8)",
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
              maxWidth:     "230px",
              margin:       0,
            }}>
              {user.organizationName !== "HACKER गोवा HOUSE"
                ? user.organizationName
                : "GOA EDITION 2026"}
            </p>
          </div>

          {/* Status Badge (rendered inside identity flow if non-ACTIVE) */}
          {user.status !== UserStatus.ACTIVE && statusColors && (
            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
              <div style={{
                padding:       "3px 14px",
                borderRadius:  "999px",
                background:    statusColors.bg,
                border:        `1px solid ${statusColors.border}`,
                fontSize:      "9.5px",
                fontWeight:    700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         statusColors.text,
                fontFamily:    "var(--font-geist-sans), sans-serif",
                boxShadow:     `0 2px 10px ${statusColors.border}`,
              }}>
                {user.status}
              </div>
            </div>
          )}
        </div>

        {/* ── LAYER 4: FOOTER SECTION (EXACTLY AS IT WAS - UNTOUCHED) ─────────────── */}
        <div
          style={{
            position:       "absolute",
            left:           "18px",
            right:          "18px",
            bottom:         `${DATA_BOTTOM}px`,
            display:        "flex",
            alignItems:     "flex-end",
            justifyContent: "space-between",
            zIndex:         14,
          }}
        >
          {/* Left: PASS ID + dates */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* PASS ID */}
            <div>
              <p style={{
                fontFamily:    "var(--font-geist-mono), monospace",
                fontSize:      "7.5px",
                fontWeight:    700,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color:         "rgba(245,197,24,0.5)",
                margin:        "0 0 3px 0",
              }}>
                PASS ID
              </p>
              <p style={{
                fontFamily:    "var(--font-geist-mono), monospace",
                fontSize:      "12.5px",
                fontWeight:    700,
                color:         "#FDFBF7",
                letterSpacing: "0.04em",
                margin:        0,
              }}>
                {user.uniqueId || "PENDING"}
              </p>
            </div>

            {/* ISSUED / VALID THRU */}
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                <p style={{
                  fontFamily:    "var(--font-geist-mono), monospace",
                  fontSize:      "7px",
                  fontWeight:    700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(245,197,24,0.45)",
                  margin:        "0 0 3px 0",
                }}>
                  ISSUED
                </p>
                <p style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize:   "10.5px",
                  fontWeight: 600,
                  color:      "rgba(253,251,247,0.72)",
                  margin:     0,
                }}>
                  {formatDateISO(user.issueDate)}
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily:    "var(--font-geist-mono), monospace",
                  fontSize:      "7px",
                  fontWeight:    700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "rgba(245,197,24,0.45)",
                  margin:        "0 0 3px 0",
                }}>
                  VALID THRU
                </p>
                <p style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize:   "10.5px",
                  fontWeight: 600,
                  color:      "rgba(253,251,247,0.72)",
                  margin:     0,
                }}>
                  {formatDateISO(user.expiryDate)}
                </p>
              </div>
            </div>
          </div>

          {/* QR code */}
          <div style={{
            padding:      "5px",
            background:   "#FFFFFF",
            borderRadius: "10px",
            boxShadow:    "0 0 0 1.5px rgba(245,197,24,0.35), 0 4px 18px rgba(0,0,0,0.50)",
            flexShrink:   0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeDataUrl}
              alt="Verification QR"
              style={{
                width:          "76px",
                height:         "76px",
                display:        "block",
                imageRendering: "pixelated",
              }}
            />
          </div>
        </div>

      </div>
    );
  }
);

IDCard.displayName = "IDCard";
