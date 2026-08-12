import type React from "react";
import Link from "next/link";

/**
 * Main wordmark: HACKER [गोवा] HOUSE
 * Yellow display text with hot-pink boxed गोवा badge — matches screenshots.
 */
export function WordmarkLogo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: { text: "text-base",    badge: "text-sm" },
    md: { text: "text-xl",     badge: "text-lg" },
    lg: { text: "text-3xl",    badge: "text-2xl" },
  };
  const s = sizeMap[size];

  return (
    <div className={`wordmark-logo font-heading font-black uppercase tracking-tight ${className}`}>
      <span className={`${s.text} text-yellow`}>HACKER</span>
      <span className={`wordmark-pink ${s.badge} mx-1`}>गोवा</span>
      <span className={`${s.text} text-yellow`}>HOUSE</span>
    </div>
  );
}

/**
 * Smaller "on light background" variant for form pages / footers.
 */
export function WordmarkLogoDark({ className = "" }: { className?: string }) {
  return (
    <div className={`wordmark-logo font-heading font-black uppercase tracking-tight ${className}`}>
      <span className="text-xl text-deep-green">HACKER</span>
      <span className="wordmark-pink text-lg mx-1">गोवा</span>
      <span className="text-xl text-deep-green">HOUSE</span>
    </div>
  );
}

export function PageCreditLine({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`page-credit-line ${light ? "text-warm-cream/60" : ""} ${className}`}>
      <span>2:47 pm Studio</span>
      <span className="mx-1">·</span>
      <span>GOA, INDIA · 28–31 OCT 2026</span>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-container">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <WordmarkLogoDark />
          {title && <p className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-text-deep">{title}</p>}
          {subtitle && <p className="text-sm text-text-muted-green leading-relaxed max-w-2xl">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

export function PageFooter() {
  return (
    <footer className="bg-paper border-t border-divider footer-trees py-10">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <WordmarkLogoDark />
            <PageCreditLine />
          </div>
        </div>
      </div>
    </footer>
  );
}
