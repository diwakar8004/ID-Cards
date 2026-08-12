import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 bg-paper paper-texture">

      {/* ── NAVIGATION ── */}
      <nav className="border-b border-divider bg-deep-green sticky top-0 z-50">
        <div className="section-container">
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <div className="flex flex-col leading-none">
              <span className="font-heading text-sm font-bold text-warm-cream tracking-tight uppercase">
                HACKER गोवा HOUSE
              </span>
              <span className="font-mono text-[10px] text-warm-cream/70 tracking-widest uppercase">
                Builder Social Card Generator
              </span>
            </div>

            {/* Nav links */}
            <div className="flex items-center gap-6">
              <Link
                href="/verify/demo"
                className="section-label text-warm-cream hover:text-accent-gold transition-fast hidden sm:block"
              >
                Verify an ID
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm"
              >
                Get Your Pass
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ─ */}
      <section className="border-b border-divider">
        <div className="section-container">
          {/* Top metadata strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-divider/50 gap-4 sm:gap-0">
            <span className="section-label">HACKER HOUSE GOA / 2026</span>
            <span className="section-label">BUILDER PASS STUDIO</span>
          </div>

          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-stretch">
            {/* Left: headline block */}
            <div className="py-16 lg:py-24 lg:pr-16 lg:border-r border-divider">
              <p className="section-label mb-8">01 — IDENTITY SYSTEM</p>

              <h1 className="font-heading font-black text-text-deep uppercase tracking-tight leading-none mb-8">
                <span className="block text-[clamp(3rem,10vw,7rem)] tracking-tighter">GENERATE</span>
                <span className="block text-[clamp(3rem,10vw,7rem)] tracking-tighter">YOUR</span>
                <span className="block text-[clamp(2.5rem,8vw,5.5rem)] tracking-tight text-deep-green">goa गोवा</span>
                <span className="block text-[clamp(2.5rem,8vw,5.5rem)] tracking-tight text-deep-green">BUILDER</span>
                <span className="block text-[clamp(3rem,10vw,7rem)] tracking-tighter">PASS</span>
              </h1>

              <p className="text-text-muted-green text-lg max-w-sm leading-relaxed mb-10">
                Upload a photo. Claim your pass.
                <br />Keep building.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link href="/register" className="btn-primary group">
                  CREATE YOUR BUILDER PASS
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/verify/demo" className="btn-secondary hidden sm:inline-flex">
                  VERIFY AN ID
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 flex-wrap">
                <div>
                  <p className="section-label">LOCATION</p>
                  <p className="text-sm font-medium text-deep-green mt-0.5">GOA / INDIA</p>
                </div>
                <div className="w-px h-8 bg-divider" />
                <div>
                  <p className="section-label">DATES</p>
                  <p className="text-sm font-medium text-deep-green mt-0.5">OCT 28–31, 2026</p>
                </div>
                <div className="w-px h-8 bg-divider hidden sm:block" />
                <div>
                  <p className="section-label">EDITION</p>
                  <p className="text-sm font-medium text-deep-green mt-0.5">v1 / 2026</p>
                </div>
              </div>
            </div>

            {/* Right: minimal info panel */}
            <div className="lg:pl-10 py-10 lg:py-24 flex flex-col justify-between border-t border-divider/50 lg:border-t-0 lg:border-l lg:border-t-0">
              <div>
                <p className="section-label mb-4">ABOUT THE PASS</p>
                <div className="space-y-5">
                  {[
                    { num: "01", text: "Submit your details and a clear photo through the registration form." },
                    { num: "02", text: "An admin reviews and approves your application." },
                    { num: "03", text: "Your physical-quality ID card is generated — download PNG or PDF." },
                    { num: "04", text: "Anyone can scan the QR code to verify your pass in real-time." },
                  ].map(item => (
                    <div key={item.num} className="flex gap-4">
                      <span className="font-mono text-xs text-muted-green mt-0.5 shrink-0">{item.num}</span>
                      <p className="text-sm text-muted-green leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-divider p-5 mt-8 bg-warm-cream">
                <p className="section-label mb-3">SECURITY NOTES</p>
                <ul className="space-y-2">
                  {[
                    "QR codes contain zero personal data",
                    "Cryptographic verification tokens",
                    "90-day scan log TTL (privacy by design)",
                    "HTTP-only sessions",
                  ].map(note => (
                    <li key={note} className="flex items-start gap-2 text-xs text-muted-green">
                      <span className="text-deep-green mt-0.5">—</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─ */}
      <section className="border-b border-divider bg-surface-raised">
        <div className="section-container py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="section-label mb-2">02 — PROCESS</p>
              <h2 className="font-heading text-2xl font-bold text-text-deep uppercase tracking-tight">
                How it works
              </h2>
            </div>
            <span className="section-label hidden sm:block">FOUR STEPS</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-divider">
            {[
              { num: "01", label: "REGISTER", desc: "Fill out the form. Upload a clear photo." },
              { num: "02", label: "REVIEW", desc: "Admin reviews your application within 24h." },
              { num: "03", label: "PASS", desc: "Download your print-ready ID card (PNG / PDF)." },
              { num: "04", label: "VERIFY", desc: "Anyone scans the QR — instant verification." },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`p-8 ${i < 3 ? 'sm:border-r border-b sm:border-b-0 lg:border-b-0' : ''} border-divider`}
              >
                <span className="font-mono text-[2.5rem] font-bold text-divider leading-none block mb-4 select-none">
                  {step.num}
                </span>
                <h3 className="font-heading text-sm font-bold text-text-deep uppercase tracking-wider mb-2">
                  {step.label}
                </h3>
                <p className="text-sm text-muted-green leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─ */}
      <section className="bg-deep-green border-b border-divider">
        <div className="section-container py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="font-mono text-xs text-accent-gold tracking-widest uppercase mb-3">
                HACKER HOUSE GOA — 2026
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-black text-warm-cream uppercase tracking-tight leading-none">
                Ready to build?
                <br />Get your pass.
              </h2>
            </div>
            <Link href="/register" className="btn-primary shrink-0 group">
              CREATE YOUR BUILDER PASS
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─ */}
      <footer className="bg-paper border-t border-divider">
        <div className="section-container py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-heading text-sm font-bold text-deep-green uppercase tracking-tight">
                HACKER गोवा HOUSE
              </span>
              <p className="section-label mt-0.5">BUILDER PASS STUDIO / 2026</p>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/admin/login" className="section-label hover:text-accent-red transition-fast">
                Admin
              </Link>
              <Link href="/verify/demo" className="section-label hover:text-accent-red transition-fast">
                Verify
              </Link>
              <Link href="/register" className="section-label hover:text-accent-red transition-fast">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
