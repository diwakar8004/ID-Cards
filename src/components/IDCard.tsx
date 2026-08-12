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

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  [UserStatus.REVOKED]:  { bg: "rgba(220,38,38,0.28)",   text: "#FF6B6B", border: "rgba(220,38,38,0.65)"  },
  [UserStatus.EXPIRED]:  { bg: "rgba(217,119,6,0.28)",   text: "#FBBF24", border: "rgba(217,119,6,0.65)"  },
  [UserStatus.PENDING]:  { bg: "rgba(124,58,237,0.28)",  text: "#C4B5FD", border: "rgba(124,58,237,0.65)" },
  [UserStatus.REJECTED]: { bg: "rgba(100,116,139,0.28)", text: "#CBD5E1", border: "rgba(100,116,139,0.65)"},
};

// Fixed pixel dimensions
export const CARD_W = 340;
export const CARD_H = 540;

// ─── DECORATIVE SVG LAYER ─────────────────────────────────────────────────────
function CardDecoSVG() {
  return (
    <svg
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: "block", pointerEvents: "none",
      }}
    >
      <defs>
        {/* Dark tint */}
        <linearGradient id="deco-tint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#011008" stopOpacity="0.78" />
          <stop offset="42%"  stopColor="#011008" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#011008" stopOpacity="0.82" />
        </linearGradient>

        {/* Sun radial glow */}
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFE566" stopOpacity="0.95" />
          <stop offset="35%"  stopColor="#F5C518" stopOpacity="0.70" />
          <stop offset="70%"  stopColor="#F59018" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#F59018" stopOpacity="0"    />
        </radialGradient>

        {/* Gold separator gradient */}
        <linearGradient id="gold-sep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#F5C518" stopOpacity="0"    />
          <stop offset="18%"  stopColor="#F5C518" stopOpacity="0.85" />
          <stop offset="82%"  stopColor="#F5C518" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F5C518" stopOpacity="0"    />
        </linearGradient>

        {/* Laminate diagonal sheen */}
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)"    />
          <stop offset="28%"  stopColor="rgba(255,255,255,0.09)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.18)" />
          <stop offset="72%"  stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </linearGradient>

        {/* Bottom ambient glow */}
        <radialGradient id="bottom-glow" cx="50%" cy="100%" r="60%">
          <stop offset="0%"   stopColor="#0F7A3A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0F7A3A" stopOpacity="0"    />
        </radialGradient>

        <clipPath id="cc">
          <rect x="0" y="0" width={CARD_W} height={CARD_H} rx="22" ry="22" />
        </clipPath>
      </defs>

      <g clipPath="url(#cc)">
        {/* ── BASE TINT ── */}
        <rect x="0" y="0" width={CARD_W} height={CARD_H} fill="url(#deco-tint)" />

        {/* ── BOTTOM AMBIENT GREEN GLOW ── */}
        <rect x="0" y={CARD_H * 0.55} width={CARD_W} height={CARD_H * 0.45} fill="url(#bottom-glow)" />

        {/* ── SUN — top-left, half-disc with bloom ── */}
        <circle cx="0" cy="80" r="78" fill="url(#sun-glow)" />
        <circle cx="0" cy="80" r="44" fill="#F5C518" opacity="0.95" />
        <circle cx="0" cy="80" r="22" fill="#FFFDE7" opacity="0.90" />
        {[ [28, 40], [32, 56], [22, 70], [30, 16], [18, 100], [14, 115] ].map(([tx, ty], i) => (
          <line key={`r${i}`}
            x1={tx * 1.05} y1={ty * 1.05}
            x2={tx * 1.55} y2={ty * 1.55}
            stroke="#F5C518" strokeWidth="2.5" strokeLinecap="round" opacity="0.60"
          />
        ))}
        <rect x="-4" y="104" width="72" height="7" rx="3.5" fill="#F5C518" opacity="0.38" />
        <rect x="-4" y="116" width="55" height="5" rx="2.5" fill="#F5C518" opacity="0.22" />

        {/* ── OCEAN STRIPE ── */}
        <rect x="0" y="88" width={CARD_W} height="72" fill="#0C5430" opacity="0.48" />
        {[100, 113, 126, 139, 152].map((y, i) => (
          <path key={`w${i}`}
            d={`M ${10 + i * 3} ${y} Q ${CARD_W * 0.25} ${y - 4} ${CARD_W * 0.5} ${y} Q ${CARD_W * 0.75} ${y + 4} ${CARD_W - 10 - i * 3} ${y}`}
            fill="none" stroke="rgba(255,255,255,0.48)"
            strokeWidth={i === 2 ? 1.5 : 0.9} strokeLinecap="round"
          />
        ))}

        {/* ── PALM — right edge ── */}
        <g opacity="0.68">
          <path d="M 322 540 C 316 476 311 416 308 358 C 305 308 302 265 298 222 L 310 219 C 314 262 317 305 320 355 C 323 413 328 473 334 540 Z" fill="#145928" />
          {[
            "M 304 225 Q 345 195 368 165 Q 332 198 304 225 Z",
            "M 304 225 Q 338 182 350 150 Q 318 188 304 225 Z",
            "M 304 225 Q 316 176 313 144 Q 306 179 304 225 Z",
            "M 304 225 Q 280 179 268 148 Q 286 184 304 225 Z",
            "M 304 225 Q 262 198 242 176 Q 270 206 304 225 Z",
            "M 304 225 Q 255 214 236 210 Q 268 220 304 225 Z",
          ].map((d, i) => <path key={`pf${i}`} d={d} fill={i < 3 ? "#1A7A42" : "#237A4A"} stroke="#0D4D28" strokeWidth="0.8" />)}
        </g>

        {/* ── PALM — left edge ── */}
        <g opacity="0.55">
          <path d="M 18 540 C 24 488 28 436 32 384 C 35 342 37 302 40 264 C 42 236 40 212 38 186 L 48 184 C 50 210 52 235 50 263 C 47 301 45 341 42 383 C 38 435 34 487 26 540 Z" fill="#145928" />
          {[
            "M 43 190 Q 8 170 -8 148 Q 20 174 43 190 Z",
            "M 43 190 Q 14 158 8 128 Q 28 162 43 190 Z",
            "M 43 190 Q 36 148 38 118 Q 42 152 43 190 Z",
            "M 43 190 Q 62 150 78 128 Q 60 158 43 190 Z",
            "M 43 190 Q 76 168 96 154 Q 72 174 43 190 Z",
          ].map((d, i) => <path key={`lf${i}`} d={d} fill={i < 3 ? "#1A7A42" : "#237A4A"} stroke="#0D4D28" strokeWidth="0.8" />)}
        </g>

        {/* ── SEPARATOR GOLD LINES ── */}
        <rect x="20" y="120" width={CARD_W - 40} height="1.5" fill="url(#gold-sep)" />
        <rect x="20" y={CARD_H - 134} width={CARD_W - 40} height="1.5" fill="url(#gold-sep)" />

        {/* ── LAMINATE SHEEN ── */}
        <rect x="0" y="0" width={CARD_W} height={CARD_H} fill="url(#sheen)" />

        {/* ── OUTER BORDER ── */}
        <rect x="1" y="1" width={CARD_W - 2} height={CARD_H - 2} rx="21" ry="21"
          fill="none" stroke="#F5C518" strokeWidth="2" strokeOpacity="0.60" />
        <rect x="6" y="6" width={CARD_W - 12} height={CARD_H - 12} rx="17" ry="17"
          fill="none" stroke="#F5C518" strokeWidth="0.8" strokeOpacity="0.22"
          strokeDasharray="8 5" />

        {/* ── CORNER CROSSHAIRS ── */}
        {([[18,18],[CARD_W-18,18],[18,CARD_H-18],[CARD_W-18,CARD_H-18]] as [number,number][]).map(([cx,cy],i) => (
          <g key={`ch${i}`} stroke="#F5C518" strokeWidth="1.8" strokeLinecap="round" opacity="0.65">
            <line x1={cx - 7} y1={cy}   x2={cx + 7} y2={cy} />
            <line x1={cx}     y1={cy-7} x2={cx}     y2={cy+7} />
          </g>
        ))}

      </g>
    </svg>
  );
}

// ─── MAIN CARD COMPONENT ──────────────────────────────────────────────────────
export const IDCard = forwardRef<HTMLDivElement, IDCardProps>(
  ({ user, qrCodeDataUrl, className = "" }, ref) => {
    const statusColors = STATUS_COLORS[user.status];

    // Clean opaque green glass background — renders 1:1 crisp on screen AND in SVG rasterization
    const glass: React.CSSProperties = {
      background: "rgba(3, 20, 10, 0.88)",
      border:     "1.5px solid rgba(245,197,24,0.35)",
    };

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden select-none ${className}`}
        style={{
          width:        `${CARD_W}px`,
          height:       `${CARD_H}px`,
          borderRadius: "22px",
          fontFamily:   "var(--font-geist-sans), sans-serif",
          backgroundImage:    "url('/images/right_panel_bg.png')",
          backgroundSize:     "cover",
          backgroundPosition: "center 15%",
          border: "2px solid rgba(245,197,24,0.60)",
        }}
      >
        {/* ── Layer 0: Illustration SVG decoration ────────────── */}
        <CardDecoSVG />

        {/* ══════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════ */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "122px",
          zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
          paddingBottom: "10px",
          ...glass,
          border: "none",
          borderBottom: "1.5px solid rgba(245,197,24,0.35)",
          borderRadius: "22px 22px 0 0",
        }}>
          {/* Mini sun crest */}
          <svg width="22" height="14" viewBox="0 0 22 14" style={{ marginBottom: 5 }}>
            <path d="M 0 13 A 11 11 0 0 1 22 13" fill="#F5C518" />
            {[-45,-22,0,22,45].map((angle, i) => {
              const rad = (angle * Math.PI) / 180 - Math.PI / 2;
              return (
                <line key={i}
                  x1={11 + 12.5 * Math.cos(rad)} y1={13 + 12.5 * Math.sin(rad)}
                  x2={11 + 16.5 * Math.cos(rad)} y2={13 + 16.5 * Math.sin(rad)}
                  stroke="#F5C518" strokeWidth="2" strokeLinecap="round" opacity="0.88"
                />
              );
            })}
          </svg>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
            <span style={{
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontWeight: 900, fontSize: "15px", letterSpacing: "0.13em",
              textTransform: "uppercase", color: "#F5C518",
              textShadow: "0 1px 3px rgba(0,0,0,0.9)",
            }}>HACKER</span>

            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #E91E8C 0%, #AD1457 100%)",
              color: "#fff", border: "2px solid #F5C518", borderRadius: "5px",
              padding: "2px 7px", fontSize: "12px", fontWeight: 900,
            }}>गोवा</span>

            <span style={{
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontWeight: 900, fontSize: "15px", letterSpacing: "0.13em",
              textTransform: "uppercase", color: "#F5C518",
              textShadow: "0 1px 3px rgba(0,0,0,0.9)",
            }}>HOUSE 2026</span>
          </div>

          <div style={{
            fontFamily: "var(--font-geist-mono), monospace", fontSize: "7px",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(245,197,24,0.80)",
          }}>✦ BUILDER SOCIAL PASS ✦</div>
        </div>

        {/* ══════════════════════════════════════════════
            PROFILE PHOTO
        ══════════════════════════════════════════════ */}
        <div style={{
          position: "absolute",
          left: "50%", transform: "translateX(-50%)",
          top: "136px", zIndex: 12,
        }}>
          {/* Gold gradient ring */}
          <div style={{
            width: "108px", height: "108px", borderRadius: "50%",
            padding: "3.5px",
            background: "linear-gradient(135deg, #FFE566 0%, #F5C518 50%, #E6A800 100%)",
            border: "1.5px solid rgba(245, 197, 24, 0.6)",
          }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              padding: "3px", background: "#010F05",
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
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

        {/* ══════════════════════════════════════════════
            IDENTITY PANEL
        ══════════════════════════════════════════════ */}
        <div style={{
          position: "absolute", left: "16px", right: "16px",
          top: "260px", zIndex: 11,
          ...glass,
          borderRadius: "16px",
          padding: "13px 16px 12px",
          textAlign: "center",
        }}>
          {/* Full name */}
          <h2 style={{
            fontFamily: "var(--font-outfit), system-ui, sans-serif",
            fontSize: "22px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.01em",
            color: "#FDFBF7", margin: "0 0 4px 0",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            textShadow: "0 1px 3px rgba(0,0,0,0.9)",
          }}>{user.fullName}</h2>

          {/* Designation */}
          <p style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "10.5px", fontWeight: 800,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#F5C518", margin: "0 0 3px 0",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{user.designation}</p>

          {user.department && (
            <p style={{
              fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "9.5px",
              color: "rgba(253,251,247,0.65)", margin: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{user.department}</p>
          )}

          {/* Org pill */}
          <div style={{
            display: "inline-flex", marginTop: "9px", padding: "3px 16px",
            background: "rgba(233,30,140,0.20)",
            border: "1.5px solid rgba(233,30,140,0.55)",
            borderRadius: "999px",
          }}>
            <p style={{
              fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "10px", fontWeight: 700,
              color: "#FF80C0", letterSpacing: "0.07em",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              maxWidth: "220px", margin: 0,
            }}>
              {user.organizationName !== "HACKER गोवा HOUSE" ? user.organizationName : "GOA EDITION 2026"}
            </p>
          </div>

          {user.status !== UserStatus.ACTIVE && statusColors && (
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
              <div style={{
                padding: "3px 14px", borderRadius: "999px",
                background: statusColors.bg, border: `1.5px solid ${statusColors.border}`,
                fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: statusColors.text,
              }}>{user.status}</div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: "134px", zIndex: 14,
          ...glass,
          borderTop:    "1.5px solid rgba(245,197,24,0.35)",
          borderRadius: "0 0 22px 22px",
          display:      "flex",
          alignItems:   "flex-end",
          padding:      "0 18px 18px",
          justifyContent: "space-between",
        }}>
          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Pink slogan pill */}
            <div style={{
              display: "inline-flex", padding: "3px 11px",
              background: "#E91E8C",
              border: "1.5px solid rgba(245,197,24,0.60)",
              borderRadius: "5px",
              width: "fit-content",
            }}>
              <span style={{
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: "7.5px", fontWeight: 900,
                letterSpacing: "0.22em", color: "#FFFFFF",
                textTransform: "uppercase",
              }}>BUILD. CONNECT. SHIP.</span>
            </div>

            {/* Pass ID */}
            <div>
              <p style={{
                fontFamily: "var(--font-geist-mono), monospace", fontSize: "7px", fontWeight: 700,
                letterSpacing: "0.20em", textTransform: "uppercase",
                color: "rgba(245,197,24,0.65)", margin: "0 0 2px 0",
              }}>PASS ID</p>
              <p style={{
                fontFamily: "var(--font-geist-mono), monospace", fontSize: "12.5px", fontWeight: 700,
                color: "#FDFBF7", letterSpacing: "0.03em", margin: 0,
              }}>{user.uniqueId || "PENDING"}</p>
            </div>

            {/* Dates */}
            <div style={{ display: "flex", gap: "16px" }}>
              {([ ["ISSUED", user.issueDate], ["VALID THRU", user.expiryDate] ] as [string, Date | string | null][]).map(([label, date]) => (
                <div key={label}>
                  <p style={{
                    fontFamily: "var(--font-geist-mono), monospace", fontSize: "6.5px", fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(245,197,24,0.58)", margin: "0 0 2px 0",
                  }}>{label}</p>
                  <p style={{
                    fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "10.5px", fontWeight: 600,
                    color: "rgba(253,251,247,0.88)", margin: 0,
                  }}>{formatDateISO(date)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QR code */}
          <div style={{
            padding: "5px", background: "#FFFFFF", borderRadius: "9px",
            border: "2.5px solid rgba(245,197,24,0.60)",
            flexShrink: 0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeDataUrl} alt="Verification QR"
              style={{ width: "74px", height: "74px", display: "block", imageRendering: "pixelated" }}
            />
          </div>
        </div>
      </div>
    );
  }
);

IDCard.displayName = "IDCard";
