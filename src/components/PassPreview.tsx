"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { IDCard, CARD_W, CARD_H, type IDCardProps } from "./IDCard";
import { generateQRCodeDataUrl } from "@/lib/qr";

type PassPreviewProps = Omit<IDCardProps, "qrCodeDataUrl"> & {
  verificationToken: string;
  onQrReady?: (dataUrl: string) => void;
  onCardRef?: (ref: React.RefObject<HTMLDivElement | null>) => void;
};

// ─── X (Twitter) SVG icon ────────────────────────────────────────────────────
function XTwitterSVG({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * PassPreview — renders the visual IDCard.
 */
export function PassPreview({
  user,
  verificationToken,
  onQrReady,
  onCardRef,
}: PassPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

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
        <IDCard ref={cardRef} user={user} qrCodeDataUrl={qrCodeDataUrl} />
      ) : (
        <div
          style={{
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            borderRadius: "24px",
            background:
              "linear-gradient(175deg, #0A5C2E 0%, #073D1E 55%, #051F10 100%)",
            border: "1.5px solid rgba(245,197,24,0.18)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "#F5C518" }}
          />
        </div>
      )}
    </>
  );
}

// ─── FRAMED PASS CANVAS COMPOSITER ───────────────────────────────────────────
// Captures the on-screen card using native browser toPng, then composites it
// onto a high-res 3x canvas with the Goa background frame + dark overlay + footer.

async function generateFramedPassCanvas(
  cardRef: React.RefObject<HTMLDivElement | null>,
  user: IDCardProps["user"],
  pixelRatio: number = 3
): Promise<HTMLCanvasElement> {
  if (!cardRef.current) throw new Error("Card element not available");

  // 1. Wait for web fonts
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 150));

  // 2. Capture the card itself with toPng (browser native engine)
  const cardDataUrl = await toPng(cardRef.current, {
    quality: 1.0,
    pixelRatio: pixelRatio,
    cacheBust: true,
  });

  // 3. Load card PNG image object
  const cardImg = new Image();
  cardImg.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => {
    cardImg.onload = resolve;
    cardImg.onerror = reject;
    cardImg.src = cardDataUrl;
  });

  // 4. Load background image object
  const bgImg = new Image();
  bgImg.crossOrigin = "anonymous";
  await new Promise((resolve) => {
    bgImg.onload = resolve;
    bgImg.onerror = () => resolve(null); // Fallback gracefully if bg fails
    bgImg.src = "/images/right_panel_bg.png";
  });

  // 5. Canvas dimensions (3x resolution)
  const pad = 48 * pixelRatio;
  const footerH = 44 * pixelRatio;
  const cardW = CARD_W * pixelRatio;
  const cardH = CARD_H * pixelRatio;
  const totalW = cardW + pad * 2;
  const totalH = cardH + pad * 2 + footerH;

  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  // 6. Draw background image (cover fit)
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    const bgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
    const canvasAspect = totalW / totalH;
    let renderW = totalW;
    let renderH = totalH;
    let renderX = 0;
    let renderY = 0;
    if (bgAspect > canvasAspect) {
      renderW = totalH * bgAspect;
      renderX = (totalW - renderW) / 2;
    } else {
      renderH = totalW / bgAspect;
      renderY = 0;
    }
    ctx.drawImage(bgImg, renderX, renderY, renderW, renderH);
  } else {
    // Solid background fallback
    ctx.fillStyle = "#031C0E";
    ctx.fillRect(0, 0, totalW, totalH);
  }

  // 7. Draw ambient dark gradient overlay
  const overlayGrad = ctx.createLinearGradient(0, 0, 0, totalH);
  overlayGrad.addColorStop(0, "rgba(3, 28, 14, 0.35)");
  overlayGrad.addColorStop(1, "rgba(3, 28, 14, 0.65)");
  ctx.fillStyle = overlayGrad;
  ctx.fillRect(0, 0, totalW, totalH);

  // 8. Draw card drop shadow & card PNG
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 30 * pixelRatio;
  ctx.shadowOffsetY = 15 * pixelRatio;
  ctx.drawImage(cardImg, pad, pad, cardW, cardH);
  ctx.restore();

  // 9. Draw footer branding text
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.round(11 * pixelRatio)}px "Outfit", system-ui, sans-serif`;
  ctx.fillStyle = "#F5C518";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 4 * pixelRatio;
  ctx.shadowOffsetY = 1 * pixelRatio;

  const footerY = pad + cardH + (pad + footerH) / 2;
  const passId = user.uniqueId || "BUILDER PASS";
  ctx.fillText(`HACKER गोवा HOUSE 2026  ·  ${passId}`, totalW / 2, footerY);
  ctx.restore();

  return canvas;
}

// ─── DOWNLOAD + SHARE ACTIONS ─────────────────────────────────────────────────
type DownloadActionsProps = {
  user: IDCardProps["user"];
  cardRef: React.RefObject<HTMLDivElement | null>;
  ready: boolean;
};

export function DownloadActions({
  user,
  cardRef,
  ready,
}: DownloadActionsProps) {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const downloadBtnRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        downloadBtnRef.current &&
        !downloadBtnRef.current.contains(e.target as Node)
      ) {
        setDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // ── PNG EXPORT ──
  const handleExportPng = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);

    try {
      const canvas = await generateFramedPassCanvas(cardRef, user, 3);
      const dataUrl = canvas.toDataURL("image/png", 1.0);

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

  // ── PDF EXPORT ──
  const handleExportPdf = async () => {
    if (!cardRef.current) return;
    setIsExportingPdf(true);

    try {
      const canvas = await generateFramedPassCanvas(cardRef, user, 3);
      const dataUrl = canvas.toDataURL("image/png", 1.0);

      const ratio = canvas.height / canvas.width;
      const pdfWidthMM = 100;
      const pdfHeightMM = pdfWidthMM * ratio;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidthMM, pdfHeightMM],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidthMM, pdfHeightMM);
      pdf.save(`HackerGoaPass_${user.uniqueId || "PENDING"}.pdf`);
    } catch (err) {
      console.error("Failed to export PDF", err);
      alert("Failed to export ID Card. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // ── SHARE TO X (TWITTER) ──
  const handleShareToX = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);

    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/verify/${user.uniqueId || "PENDING"}`
        : "";

    const tweetText = `Just got my official Hacker House Goa 2026 Builder Pass! 🌴⚡\n\nBuild. Connect. Ship. — See you in Goa!\n\n${shareUrl}`;
    const hashtags =
      "HackerHouseGoa,BuilderPass,Goa2026,BuildInPublic,Web3,Hackathon";

    try {
      const canvas = await generateFramedPassCanvas(cardRef, user, 3);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/png", 1.0);
      });

      if (!blob) throw new Error("Could not generate image blob");

      const file = new File(
        [blob],
        `HackerGoaPass_${user.uniqueId || "PENDING"}.png`,
        { type: "image/png", lastModified: Date.now() }
      );

      // 1. Mobile Web Share API
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        navigator.canShare?.({ files: [file] })
      ) {
        try {
          await navigator.share({
            text: tweetText,
            files: [file],
          });
          triggerToast("Pass shared successfully! 🌴");
          return;
        } catch (shareErr) {
          const err = shareErr as Error;
          if (err.name === "AbortError") return;
          console.warn("Native share failed, using clipboard fallback:", err);
        }
      }

      // 2. Desktop Clipboard Fallback
      let copiedToClipboard = false;
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined"
      ) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          copiedToClipboard = true;
        } catch (clipErr) {
          console.warn("Clipboard write failed:", clipErr);
        }
      }

      // 3. Open X tweet intent
      const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=${encodeURIComponent(hashtags)}`;
      window.open(intentUrl, "_blank", "noopener,noreferrer");

      if (copiedToClipboard) {
        setToastMessage(
          "Pass image copied! Paste it (Cmd+V / Ctrl+V) into your tweet on X."
        );
        setTimeout(() => {
          setToastMessage((prev) =>
            prev ===
            "Pass image copied! Paste it (Cmd+V / Ctrl+V) into your tweet on X."
              ? null
              : prev
          );
        }, 6000);
      } else {
        triggerToast("Opening X — download the image first to attach it.");
      }
    } catch (err) {
      console.error("Failed to share to X:", err);
      const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=${encodeURIComponent(hashtags)}`;
      window.open(intentUrl, "_blank", "noopener,noreferrer");
      triggerToast("Opening X to share your pass!");
    } finally {
      setIsSharing(false);
    }
  };

  const isExporting = isExportingPng || isExportingPdf;
  const disabled = !ready || isExporting || isSharing;

  return (
    <>
      <div className="flex items-center justify-center gap-3 w-full max-w-[390px] relative z-20">
        {/* ── DOWNLOAD BUTTON + DROPDOWN ── */}
        <div ref={downloadBtnRef} className="relative flex-1">
          <button
            onClick={() => setDownloadOpen(!downloadOpen)}
            disabled={disabled}
            className="w-full h-11 px-4 rounded-xl bg-[#F5C518] text-[#073D1E] font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[#ffe066] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{ boxShadow: "0 4px 20px rgba(245,197,24,0.25)" }}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {isExportingPng
                ? "EXPORTING…"
                : isExportingPdf
                  ? "EXPORTING…"
                  : "DOWNLOAD"}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`}
            />
          </button>

          {downloadOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-xl p-1.5 backdrop-blur-xl border border-[rgba(245,197,24,0.25)] shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 z-50"
              style={{ background: "rgba(7,61,30,0.95)" }}
            >
              <button
                onClick={() => {
                  setDownloadOpen(false);
                  handleExportPng();
                }}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-bold uppercase tracking-wider text-[#FDFBF7] hover:bg-[rgba(245,197,24,0.12)] hover:text-[#F5C518] transition-all disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4 text-[#F5C518]" />
                <div className="flex flex-col">
                  <span>DOWNLOAD AS PNG</span>
                  <span className="text-[9px] text-[rgba(253,251,247,0.45)] font-normal normal-case">
                    High-res image with themed frame
                  </span>
                </div>
              </button>
              <div className="my-1 h-[1px] bg-[rgba(245,197,24,0.12)]" />
              <button
                onClick={() => {
                  setDownloadOpen(false);
                  handleExportPdf();
                }}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-bold uppercase tracking-wider text-[#FDFBF7] hover:bg-[rgba(245,197,24,0.12)] hover:text-[#F5C518] transition-all disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-[#F5C518]" />
                <div className="flex flex-col">
                  <span>DOWNLOAD AS PDF</span>
                  <span className="text-[9px] text-[rgba(253,251,247,0.45)] font-normal normal-case">
                    Print-ready format with frame
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* ── SHARE TO X — Direct button ── */}
        <button
          onClick={handleShareToX}
          disabled={disabled}
          className="h-11 px-5 rounded-xl bg-[rgba(245,197,24,0.12)] text-[#F5C518] border border-[rgba(245,197,24,0.3)] font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[rgba(245,197,24,0.22)] hover:border-[#F5C518] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md shadow-lg"
        >
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#F5C518]" />
          ) : (
            <XTwitterSVG className="w-4 h-4 text-[#F5C518]" />
          )}
          <span>{isSharing ? "SHARING…" : "SHARE"}</span>
        </button>
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl backdrop-blur-xl border border-[rgba(245,197,24,0.35)] shadow-2xl flex items-center gap-3 text-xs font-bold text-[#FDFBF7] transition-all animate-in fade-in slide-in-from-bottom-4"
          style={{
            background: "rgba(7, 61, 30, 0.95)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(245,197,24,0.2)",
          }}
        >
          <Check className="w-4 h-4 text-[#F5C518] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
