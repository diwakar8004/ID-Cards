"use client";

import React, { useRef, useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { IDCard, type IDCardProps } from "./IDCard";
import { generateQRCodeDataUrl } from "@/lib/qr";

type PassPreviewProps = Omit<IDCardProps, "qrCodeDataUrl"> & {
  verificationToken: string;
  onQrReady?: (dataUrl: string) => void;
  onCardRef?: (ref: React.RefObject<HTMLDivElement | null>) => void;
};

/**
 * PassPreview — renders ONLY the IDCard (no buttons, no wrapper).
 * The cardRef targets the inner IDCard element at its actual 340×540px
 * for PNG/PDF export. The QR code is generated once on mount.
 */
export function PassPreview({ user, verificationToken, onQrReady, onCardRef }: PassPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Notify parent of the card ref once it's available
  useEffect(() => {
    onCardRef?.(cardRef);
  }, [onCardRef]);

  useEffect(() => {
    generateQRCodeDataUrl(verificationToken, { width: 400, margin: 1 })
      .then((dataUrl) => {
        setQrCodeDataUrl(dataUrl);
        onQrReady?.(dataUrl);
      })
      .catch(console.error);
  }, [verificationToken, onQrReady]);

  return (
    <>
      {qrCodeDataUrl ? (
        <IDCard
          ref={cardRef}
          user={user}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      ) : (
        <div
          className="bg-warm-cream rounded-[24px] flex items-center justify-center border border-divider shadow-lg"
          style={{ width: "340px", height: "540px" }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-deep-green" />
        </div>
      )}
    </>
  );
}

/**
 * DownloadActions — PNG/PDF export buttons.
 * Uses the cardRef passed from the parent to capture the IDCard element.
 * The export captures the card at its actual 340×540px dimensions.
 * The `ready` prop controls whether buttons are enabled (QR + card loaded).
 */
type DownloadActionsProps = {
  user: IDCardProps["user"];
  cardRef: React.RefObject<HTMLDivElement | null>;
  ready: boolean;
};

export function DownloadActions({ user, cardRef, ready }: DownloadActionsProps) {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPng = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `HackerGoaPass_${user.uniqueId || "PENDING"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG", err);
      alert("Failed to export ID Card. Please try again.");
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleExportPdf = async () => {
    if (!cardRef.current) return;
    setIsExportingPdf(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [54, 85.6],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, 54, 85.6);
      pdf.save(`HackerGoaPass_${user.uniqueId || "PENDING"}.pdf`);
    } catch (err) {
      console.error("Failed to export PDF", err);
      alert("Failed to export ID Card. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const disabled = !ready || isExportingPng || isExportingPdf;

  return (
    <>
      <button
        onClick={handleExportPng}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 w-40 h-12 bg-warm-cream text-deep-green border-2 border-deep-green font-bold text-sm uppercase tracking-widest hover:bg-[#EFE9CD] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExportingPng ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
        PNG
      </button>
      <button
        onClick={handleExportPdf}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 w-40 h-12 bg-accent-gold text-deep-green border-2 border-deep-green font-bold text-sm uppercase tracking-widest hover:bg-[#F0D67A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExportingPdf ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        PDF
      </button>
    </>
  );
}
