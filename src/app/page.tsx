import Link from "next/link";
import { Shield, QrCode, Users, ArrowRight, CheckCircle, Lock, BadgeCheck } from "lucide-react";

// ============================================================
// Landing Page — Phase 1 Placeholder
// Full implementation in Phase 5 (Admin) / Phase 7 (Verification)
// ============================================================

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Navigation */}
      <nav className="border-b border-divider bg-surface sticky top-0 z-50">
        <div className="section-container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-navy flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-ink text-lg tracking-tight">
              HACKER गोवा HOUSE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/verify"
              className="text-sm font-medium text-ink-secondary hover:text-ink transition-fast px-3 py-1.5 rounded-md hover:bg-surface-raised"
            >
              Verify an ID
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-accent-navy text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-fast btn-tactile"
            >
              Get Your ID Card
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-canvas border-b border-divider">
        <div className="section-container py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase mb-6 bg-accent-surface px-3 py-1.5 rounded-full border border-blue-100">
                <BadgeCheck className="w-3.5 h-3.5" />
                Trusted Identity Platform
              </div>
              <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl text-ink mb-6 leading-[1.1] uppercase">
                GENERATE YOUR{" "}
                <span className="text-accent-navy">goa गोवा PASS</span>
              </h1>
              <p className="text-ink-secondary text-lg leading-relaxed mb-8 max-w-xl">
                The Builder Social Card Generator for HACKER गोवा HOUSE. Get your pass,
                join the community, and verify authenticity instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-accent-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-fast btn-tactile"
                >
                  Get Your ID Card
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/verify"
                  className="inline-flex items-center justify-center gap-2 border border-divider text-ink font-medium px-6 py-3 rounded-lg hover:bg-surface-raised transition-fast"
                >
                  <QrCode className="w-4 h-4" />
                  Verify an ID
                </Link>
              </div>
            </div>

            {/* Right: Feature highlights */}
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: "Secure Verification",
                  desc: "QR codes contain only a verification URL — never personal data.",
                },
                {
                  icon: <QrCode className="w-5 h-5" />,
                  title: "Instant QR Scanning",
                  desc: "Anyone can scan the QR code to verify authenticity in seconds.",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Organization Management",
                  desc: "Admin dashboard to approve, manage, and revoke ID cards.",
                },
                {
                  icon: <Lock className="w-5 h-5" />,
                  title: "Privacy First",
                  desc: "Email, phone, and address are never exposed on the public verification page.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`card-base p-5 animate-fade-in-up stagger-${i + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-surface flex items-center justify-center text-accent-navy">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-ink-secondary text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface py-20">
        <div className="section-container">
          <div className="max-w-2xl mb-14">
            <h2 className="font-heading text-3xl text-ink mb-4">
              How verification works
            </h2>
            <p className="text-ink-secondary leading-relaxed">
              A simple, secure three-step process that anyone can use to verify
              an ID — no app required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Register",
                desc: "Submit your details and photo. Our team reviews your application.",
              },
              {
                step: "02",
                title: "Get Approved",
                desc: "Once approved, your professional ID card is generated with a unique QR code.",
              },
              {
                step: "03",
                title: "Verify Instantly",
                desc: "Anyone can scan the QR code or enter your unique ID to verify authenticity.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="font-mono text-5xl font-bold text-blue-50 mb-4 select-none">
                  {step.step}
                </div>
                <h3 className="font-heading text-xl text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-ink-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="bg-canvas border-t border-divider py-16">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
            {[
              { icon: <CheckCircle className="w-5 h-5" />, text: "No personal data in QR codes" },
              { icon: <Lock className="w-5 h-5" />, text: "bcrypt password hashing" },
              { icon: <Shield className="w-5 h-5" />, text: "HTTP-only secure sessions" },
              { icon: <BadgeCheck className="w-5 h-5" />, text: "Cryptographically secure tokens" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-ink-secondary">
                <span className="text-status-active">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-divider py-8">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-navy" />
            <span className="font-heading font-bold text-ink text-sm">HACKER गोवा HOUSE</span>
          </div>
          <p className="text-ink-secondary text-xs">
            Builder Social Card Generator
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-secondary">
            <Link href="/admin/login" className="hover:text-ink transition-fast">
              Admin
            </Link>
            <Link href="/verify" className="hover:text-ink transition-fast">
              Verify
            </Link>
            <Link href="/register" className="hover:text-ink transition-fast">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
