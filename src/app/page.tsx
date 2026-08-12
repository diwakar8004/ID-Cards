import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─── Tropical Sun SVG (bottom of hero, matches screenshot) ─────────────── */
function TropicalSun() {
  return (
    <svg
      viewBox="0 0 800 260"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      {/* Rays spreading from bottom center */}
      {[
        { x1: 400, y1: 260, x2: 400, y2: 60,  opacity: 0.7 },
        { x1: 400, y1: 260, x2: 340, y2: 70,  opacity: 0.5 },
        { x1: 400, y1: 260, x2: 460, y2: 70,  opacity: 0.5 },
        { x1: 400, y1: 260, x2: 280, y2: 90,  opacity: 0.4 },
        { x1: 400, y1: 260, x2: 520, y2: 90,  opacity: 0.4 },
        { x1: 400, y1: 260, x2: 220, y2: 120, opacity: 0.3 },
        { x1: 400, y1: 260, x2: 580, y2: 120, opacity: 0.3 },
        { x1: 400, y1: 260, x2: 160, y2: 160, opacity: 0.2 },
        { x1: 400, y1: 260, x2: 640, y2: 160, opacity: 0.2 },
      ].map((ray, i) => (
        <line
          key={i}
          x1={ray.x1} y1={ray.y1}
          x2={ray.x2} y2={ray.y2}
          stroke="#F5C518"
          strokeWidth="2"
          opacity={ray.opacity}
        />
      ))}
      {/* Half-sun circle */}
      <circle cx="400" cy="260" r="80" fill="#F5C518" />
    </svg>
  );
}

/* ─── Palm leaf SVG (corners) ────────────────────────────────────────────── */
function PalmLeft() {
  return (
    <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <path d="M10 180 Q20 120 60 80 Q30 100 20 60 Q50 80 65 40 Q45 70 80 50 Q60 85 75 120 Q50 130 30 170 Z"
        fill="#1A8040" opacity="0.9" />
      <path d="M20 180 Q35 130 55 100 Q25 110 30 70 Q55 90 65 55 Q50 80 72 68 Q58 95 68 130 Q48 142 35 178 Z"
        fill="#0D6B34" opacity="0.7" />
    </svg>
  );
}

function PalmRight() {
  return (
    <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true" style={{ transform: "scaleX(-1)" }}>
      <path d="M10 180 Q20 120 60 80 Q30 100 20 60 Q50 80 65 40 Q45 70 80 50 Q60 85 75 120 Q50 130 30 170 Z"
        fill="#1A8040" opacity="0.9" />
      <path d="M20 180 Q35 130 55 100 Q25 110 30 70 Q55 90 65 55 Q50 80 72 68 Q58 95 68 130 Q48 142 35 178 Z"
        fill="#0D6B34" opacity="0.7" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1" style={{ background: "var(--forest)" }}>

      {/* ── NAVIGATION ── */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{ background: "var(--forest-dark)", borderColor: "rgba(245,197,24,0.15)" }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Left: 2:47 PM STUDIO logo style */}
            <Link href="/" className="flex flex-col leading-none group">
              <span
                className="font-heading font-black uppercase tracking-tight"
                style={{
                  color: "var(--yellow)",
                  fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
                  lineHeight: 1,
                }}
              >
                2:47<span style={{ color: "var(--yellow)", fontSize: "0.7em" }}>PM</span>
              </span>
              <span
                className="font-heading font-black uppercase tracking-widest"
                style={{
                  color: "var(--yellow)",
                  fontSize: "clamp(0.5rem, 1.5vw, 0.65rem)",
                  letterSpacing: "0.3em",
                }}
              >
                STUDIO
              </span>
            </Link>

            {/* Right: CHECK HYPE + APPLY */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/verify/demo"
                className="nav-link-ghost hidden sm:block text-xs sm:text-sm tracking-widest"
              >
                CHECK HYPE
              </Link>
              <Link
                href="/register"
                className="btn-festival text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5"
              >
                APPLY
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "var(--forest)",
          minHeight: "calc(100svh - 56px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Atmospheric green radial glow at top */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(26,128,64,0.45) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Top meta strip */}
        <div
          className="section-container relative z-10 pt-6 sm:pt-8 flex items-center justify-between"
        >
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: "rgba(245,197,24,0.65)" }}
          >
            GOA, INDIA · 28 – 31 OCT 2026
          </span>
          <span
            className="font-mono text-xs uppercase tracking-widest hidden sm:block"
            style={{ color: "rgba(245,197,24,0.65)" }}
          >
            2:47 PM STUDIO
          </span>
        </div>

        {/* Main headline — HACKER [गोवा] HOUSE */}
        <div className="section-container relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-10">
          <div className="text-center">
            {/* Pill above title */}
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <span
                className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-sm"
                style={{
                  color: "var(--forest-dark)",
                  background: "var(--yellow)",
                  fontWeight: 700,
                }}
              >
                HACKER HOUSE GOA 2026
              </span>
            </div>

            {/* HACKER गोवा HOUSE — hero display */}
            <h1
              aria-label="HACKER HOUSE GOA"
              style={{
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                fontSize: "clamp(3rem, 13.5vw, 10rem)",
                color: "var(--yellow)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.08em",
              }}
            >
              <span>HACKER</span>
              {/* गोवा badge — hot pink box, same scale as headline */}
              <span
                aria-label="Goa"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--pink)",
                  color: "#fff",
                  border: "3px solid #FF85CC",
                  borderRadius: "8px",
                  padding: "0.04em 0.18em",
                  fontSize: "0.62em",
                  fontWeight: 900,
                  lineHeight: 1,
                  position: "relative",
                  top: "-0.06em",
                  letterSpacing: "-0.01em",
                  flexShrink: 0,
                }}
              >
                गोवा
              </span>
              <span>HOUSE</span>
            </h1>

            {/* Sub-tagline */}
            <div className="mt-5 sm:mt-7 flex flex-col items-center gap-2">
              <p
                className="font-mono text-sm sm:text-base font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--yellow)", opacity: 0.85 }}
              >
                GOA 2026
              </p>
              <p
                className="font-heading font-bold uppercase tracking-[0.22em] text-xs sm:text-sm"
                style={{ color: "rgba(253,251,247,0.7)" }}
              >
                BUILD&nbsp;·&nbsp;CONNECT&nbsp;·&nbsp;SHIP
              </p>
            </div>

            {/* CTA row */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="btn-festival group inline-flex items-center gap-2 text-sm sm:text-base"
              >
                GET YOUR BUILDER PASS
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/verify/demo"
                className="btn-secondary inline-flex items-center gap-2 text-sm sm:text-base"
              >
                VERIFY AN ID
              </Link>
            </div>

            {/* Location / dates strip */}
            <div
              className="mt-10 sm:mt-14 flex items-center justify-center gap-6 sm:gap-10 flex-wrap"
            >
              {[
                { label: "LOCATION", value: "GOA / INDIA" },
                { label: "DATES", value: "OCT 28–31, 2026" },
                { label: "EDITION", value: "v1 / 2026" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="font-mono text-[0.6rem] uppercase tracking-widest"
                    style={{ color: "rgba(245,197,24,0.5)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider"
                    style={{ color: "var(--yellow)" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom decoration: tropical sun + palm corners */}
        <div className="relative z-10 w-full" style={{ marginTop: "auto" }}>
          {/* Palm leaves — corners */}
          <div
            className="absolute left-0 bottom-0 pointer-events-none"
            style={{ width: "clamp(60px, 10vw, 120px)", height: "clamp(80px, 14vw, 180px)" }}
            aria-hidden="true"
          >
            <PalmLeft />
          </div>
          <div
            className="absolute right-0 bottom-0 pointer-events-none"
            style={{ width: "clamp(60px, 10vw, 120px)", height: "clamp(80px, 14vw, 180px)" }}
            aria-hidden="true"
          >
            <PalmRight />
          </div>

          {/* Sun rays + semicircle */}
          <div
            className="relative overflow-hidden"
            style={{ height: "clamp(100px, 18vw, 200px)" }}
            aria-hidden="true"
          >
            <div className="absolute bottom-0 left-0 right-0">
              <TropicalSun />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{ background: "var(--forest-dark)", borderTop: "1px solid rgba(245,197,24,0.12)" }}
      >
        <div className="section-container py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div>
              <p
                className="font-mono text-xs uppercase tracking-widest mb-2"
                style={{ color: "rgba(245,197,24,0.5)" }}
              >
                02 — PROCESS
              </p>
              <h2
                className="font-heading font-black uppercase tracking-tight"
                style={{
                  color: "var(--yellow)",
                  fontSize: "clamp(1.75rem, 5vw, 3rem)",
                }}
              >
                How it works
              </h2>
            </div>
            <span
              className="font-mono text-xs uppercase tracking-widest hidden sm:block"
              style={{ color: "rgba(245,197,24,0.4)" }}
            >
              FOUR STEPS
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              { num: "01", label: "SUBMIT", desc: "Fill out the form with your details and photo.", icon: "📝" },
              { num: "02", label: "GENERATE", desc: "Your unique ID card is generated automatically.", icon: "⚡" },
              { num: "03", label: "DOWNLOAD", desc: "Save your print-ready ID card as PNG or PDF.", icon: "🪪" },
              { num: "04", label: "VERIFY", desc: "Anyone scans the QR — instant verification.", icon: "✅" },
            ].map((step, i) => (
              <div
                key={step.num}
                className="festival-step p-6 sm:p-8"
                style={{
                  borderTop: "2px solid rgba(245,197,24,0.2)",
                  borderRight: i < 3 ? "1px solid rgba(245,197,24,0.08)" : "none",
                }}
              >
                <span
                  className="font-mono font-bold block mb-4 select-none"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 2.5rem)",
                    color: "rgba(245,197,24,0.15)",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <h3
                  className="font-heading font-bold uppercase tracking-wider mb-2 text-sm"
                  style={{ color: "var(--yellow)" }}
                >
                  {step.label}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(253,251,247,0.55)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY NOTES ── */}
      <section
        style={{
          background: "var(--forest)",
          borderTop: "1px solid rgba(245,197,24,0.1)",
          borderBottom: "1px solid rgba(245,197,24,0.1)",
        }}
      >
        <div className="section-container py-14 sm:py-18">
          <div className="grid md:grid-cols-[3fr_2fr] gap-12 lg:gap-20">
            {/* Left: about the pass */}
            <div>
              <p
                className="font-mono text-xs uppercase tracking-widest mb-6"
                style={{ color: "rgba(245,197,24,0.5)" }}
              >
                ABOUT THE PASS
              </p>
              <div className="space-y-5">
                {[
                  { num: "01", text: "Submit your details and a clear photo through the registration form." },
                  { num: "02", text: "Your unique pass is generated automatically in seconds." },
                  { num: "03", text: "Your physical-quality ID card is ready — download PNG or PDF." },
                  { num: "04", text: "Anyone can scan the QR code to verify your pass in real-time." },
                ].map(item => (
                  <div key={item.num} className="flex gap-4 items-start">
                    <span
                      className="font-mono text-xs shrink-0 mt-1"
                      style={{ color: "rgba(245,197,24,0.4)" }}
                    >
                      {item.num}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.6)" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: security notes card */}
            <div>
              <div
                className="p-6"
                style={{
                  border: "1px solid rgba(245,197,24,0.2)",
                  background: "rgba(7,61,30,0.5)",
                }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-widest mb-4"
                  style={{ color: "rgba(245,197,24,0.5)" }}
                >
                  SECURITY NOTES
                </p>
                <ul className="space-y-2.5">
                  {[
                    "QR codes contain zero personal data",
                    "Cryptographic verification tokens",
                    "90-day scan log TTL (privacy by design)",
                    "HTTP-only sessions",
                  ].map(note => (
                    <li key={note} className="flex items-start gap-2.5 text-xs" style={{ color: "rgba(253,251,247,0.55)" }}>
                      <span style={{ color: "var(--yellow)", marginTop: "2px" }}>—</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section
        style={{
          background: "var(--forest-dark)",
          borderTop: "1px solid rgba(245,197,24,0.12)",
        }}
      >
        <div className="section-container py-16 sm:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p
                className="font-mono text-xs uppercase tracking-widest mb-3"
                style={{ color: "rgba(245,197,24,0.5)" }}
              >
                HACKER HOUSE GOA — 2026
              </p>
              <h2
                className="font-heading font-black uppercase tracking-tight leading-none"
                style={{
                  color: "var(--yellow)",
                  fontSize: "clamp(2rem, 6vw, 3.5rem)",
                }}
              >
                Ready to build?
                <br />Get your pass.
              </h2>
            </div>
            <Link href="/register" className="btn-festival shrink-0 group inline-flex items-center gap-2">
              CREATE YOUR BUILDER PASS
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "var(--forest)",
          borderTop: "1px solid rgba(245,197,24,0.12)",
        }}
      >
        <div className="section-container py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div
                className="wordmark-logo font-heading font-black uppercase tracking-tight"
                style={{ fontSize: "1rem", color: "var(--yellow)" }}
              >
                <span style={{ color: "var(--yellow)" }}>HACKER</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--pink)",
                    color: "#fff",
                    border: "2px solid #FF85CC",
                    borderRadius: "5px",
                    padding: "0.1em 0.25em",
                    fontSize: "0.85em",
                    fontWeight: 900,
                    lineHeight: 1,
                    margin: "0 0.1em",
                  }}
                >
                  गोवा
                </span>
                <span style={{ color: "var(--yellow)" }}>HOUSE</span>
              </div>
              <span
                className="font-mono text-[0.6rem] uppercase tracking-widest"
                style={{ color: "rgba(245,197,24,0.4)" }}
              >
                BUILDER PASS STUDIO / 2026
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/admin/login"
                className="footer-nav-link font-mono text-[0.65rem] uppercase tracking-widest transition-fast"
              >
                Admin
              </Link>
              <Link
                href="/verify/demo"
                className="footer-nav-link font-mono text-[0.65rem] uppercase tracking-widest transition-fast"
              >
                Verify
              </Link>
              <Link
                href="/register"
                className="footer-nav-link font-mono text-[0.65rem] uppercase tracking-widest transition-fast"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
