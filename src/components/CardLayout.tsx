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

function LeftPanel() {
  return (
    <div className="bg-warm-cream paper-texture h-screen flex flex-col justify-between py-20 px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-md">
        {/* Status indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-red"></span>
          <span className="section-label text-accent-red tracking-widest">
            PASS GENERATED
          </span>
        </div>

        {/* Main editorial headline */}
        <h1 className="font-heading font-black text-deep uppercase tracking-tight leading-[0.85] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl mb-8">
          YOUR
          <br />
          BUILDER
          <br />
          PASS IS
          <br />
          <span className="text-accent-red">READY.</span>
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-green leading-relaxed mb-8 max-w-sm">
          Your goa गोवा pass has been generated successfully. Scan the QR
          code or open the verification page to confirm authenticity.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-divider mb-8"></div>

        {/* Event identity block */}
        <div className="space-y-2 mb-12">
          <p className="font-heading font-bold text-deep text-sm uppercase tracking-widest">
            HACKER HOUSE GOA 2026
          </p>
          <p className="font-heading font-black text-forest text-3xl sm:text-4xl uppercase tracking-tight leading-none">
            BUILD. <span className="text-accent-red">CONNECT.</span> SHIP.
          </p>
        </div>
      </div>

      {/* Footer block */}
      <div className="w-full max-w-md">
        <div className="space-y-4">
          <div>
            <p className="font-heading font-bold text-deep uppercase text-sm tracking-widest">
              HACKER गोवा HOUSE
            </p>
            <p className="section-label text-muted-green mt-1">
              BUILDER SOCIAL CARD GENERATOR
            </p>
          </div>

          <div className="text-sm text-muted-green space-y-1">
            <p>GOA, INDIA</p>
            <p>OCT 28 – 31, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RightPanel — client component for the dark-green pass preview stage.
 * Manages card ref state for PNG/PDF export.
 */
function RightPanel({ user }: { user: CardData }) {
  const [cardRef, setCardRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null);
  const [qrReady, setQrReady] = useState(false);

  return (
    <div className="bg-deep-green h-screen flex flex-col items-center justify-center px-6">
      {/* Card container — centered on the dark stage */}
      <div className="flex justify-center mb-8">
        <PassPreview
          user={user as IDCardProps["user"]}
          verificationToken={user.verificationToken}
          onQrReady={() => setQrReady(true)}
          onCardRef={setCardRef}
        />
      </div>

      {/* Download buttons — aligned to card width */}
      {cardRef && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <DownloadActions
            user={user as IDCardProps["user"]}
            cardRef={cardRef}
            ready={qrReady}
          />
        </div>
      )}

      {/* Verification block */}
      <div className="w-full max-w-[390px]">
        <div className="border border-divider/30 rounded-lg p-4 bg-deep-green-dark">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="section-label text-muted-green uppercase mb-1">
                VERIFY THIS PASS
              </p>
              <p className="font-mono text-xs text-ink-secondary break-all">
                /verify/{user.uniqueId}
              </p>
            </div>
            <Link
              href={`/verify/${user.verificationToken}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-warm-cream hover:text-accent-gold transition-colors flex-shrink-0 border border-divider/30 rounded px-4 py-2"
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
