"use client";

import React, { useRef, useState, useEffect } from "react";
import { Download, Share2, FileText, Image as ImageIcon, Loader2, ChevronDown, Check } from "lucide-react";
import { toPng, toBlob } from "html-to-image";
import { jsPDF } from "jspdf";
import { IDCard, type IDCardProps } from "./IDCard";
import { generateQRCodeDataUrl } from "@/lib/qr";

type PassPreviewProps = Omit<IDCardProps, "qrCodeDataUrl"> & {
  verificationToken: string;
  onQrReady?: (dataUrl: string) => void;
  onCardRef?: (ref: React.RefObject<HTMLDivElement | null>) => void;
};

// ─── SOCIAL SVG ICONS ────────────────────────────────────────────────────────
function LinkedInSVG() {
  return (
    <svg className="w-4 h-4 text-[#F5C518] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function XTwitterSVG() {
  return (
    <svg className="w-4 h-4 text-[#F5C518] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppSVG() {
  return (
    <svg className="w-4 h-4 text-[#F5C518] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.17 8.17 0 0 1-5.82 2.41c-1.44 0-2.86-.38-4.11-1.11l-.3-.18-3.05.8.82-2.97-.19-.31a8.19 8.19 0 0 1-1.25-4.37c0-4.54 3.7-8.25 8.24-8.25zm4.52 10.97c-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.64.81-.79.97-.15.16-.3.18-.55.05-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45s-.56-1.36-.77-1.86c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.31z" />
    </svg>
  );
}

/**
 * PassPreview — renders ONLY the IDCard (no buttons, no wrapper).
 * The cardRef targets the inner IDCard element at its actual 340×540px
 * for PNG/PDF export. The QR code is generated once on mount.
 */
export function PassPreview({ user, verificationToken, onQrReady, onCardRef }: PassPreviewProps) {
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
        <IDCard
          ref={cardRef}
          user={user}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      ) : (
        <div
          style={{
            width: "340px",
            height: "540px",
            borderRadius: "24px",
            background: "linear-gradient(175deg, #0A5C2E 0%, #073D1E 55%, #051F10 100%)",
            border: "1.5px solid rgba(245,197,24,0.18)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#F5C518" }} />
        </div>
      )}
    </>
  );
}

/**
 * DownloadActions — Combined Download button + dropdown (PNG & PDF)
 * & Share button + dropdown with Web Share API (native image share)
 * and Clipboard + Toast fallback for desktop/unsupported browsers.
 */
type DownloadActionsProps = {
  user: IDCardProps["user"];
  cardRef: React.RefObject<HTMLDivElement | null>;
  ready: boolean;
};

export function DownloadActions({ user, cardRef, ready }: DownloadActionsProps) {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const downloadRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setDownloadOpen(false);
      }
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
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

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/verify/${user.uniqueId || "PENDING"}`;
    }
    return "";
  };

  const generateCardBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    await new Promise((resolve) => setTimeout(resolve, 100));
    return await toBlob(cardRef.current, {
      quality: 1.0,
      pixelRatio: 3,
      cacheBust: true,
    });
  };

  const handleSharePlatform = async (platform: "linkedin" | "x" | "whatsapp") => {
    setShareOpen(false);
    if (!cardRef.current) return;
    setIsSharing(true);

    try {
      // 1. Generate pass image blob
      const blob = await generateCardBlob();
      if (!blob) throw new Error("Could not capture pass image");

      // 2. Create a File from the blob for sharing
      const file = new File([blob], `HackerGoaPass_${user.uniqueId || "PENDING"}.png`, {
        type: blob.type,
        lastModified: Date.now(),
      });

      // 3. Build share text + URL
      const shareUrl = getShareUrl();
      const text = `Check out my official Hacker House Goa 2026 Builder Pass! 🌴⚡`;

      // 4. Try Native Web Share API first (mobile + supported desktop browsers)
      const nativeShareAvailable =
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        (!navigator.canShare || navigator.canShare({ files: [file] }));

      if (nativeShareAvailable) {
        try {
          await navigator.share({
            title: "My Hacker House Goa Builder Pass",
            text: `${text}\n${shareUrl}`,
            url: shareUrl,
            files: [file],
          });
          // Native share succeeded — no need for fallback
          triggerToast("Pass shared successfully!");
          return;
        } catch (shareErr) {
          // User canceled share, or share failed — fall through to clipboard fallback
          const err = shareErr as Error;
          if (err.name !== "AbortError") {
            console.warn("Native share failed, falling back to clipboard:", err);
          }
        }
      }

      // 5. Clipboard Fallback (desktop browsers often block direct file passing)
      let copiedToClipboard = false;
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined"
      ) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
          ]);
          copiedToClipboard = true;
        } catch (clipErr) {
          console.warn("Failed to copy image to clipboard:", clipErr);
        }
      }

      // 6. Show toast notification with platform-specific guidance
      if (copiedToClipboard) {
        // Longer-lasting toast since user needs it while switching to the platform tab
        setToastMessage(
          "Image copied! Paste it (Ctrl+V / Cmd+V) into your post on the platform that's opening."
        );
        // Clear after 6 seconds (longer than normal toast)
        setTimeout(() => {
          setToastMessage((prev) =>
            prev ===
            "Image copied! Paste it (Ctrl+V / Cmd+V) into your post on the platform that's opening."
              ? null
              : prev
          );
        }, 6000);
      }

      // 7. Platform Redirection (opens the social platform share intent)
      let intentUrl = "";
      if (platform === "x") {
        intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text}\n${shareUrl}`)}`;
      } else if (platform === "whatsapp") {
        intentUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${shareUrl}`)}`;
      } else if (platform === "linkedin") {
        intentUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      }

      if (intentUrl) {
        window.open(intentUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Failed to generate pass for sharing:", err);
      alert("Failed to copy pass image. You can use Download PNG instead.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    setShareOpen(false);
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      triggerToast("Verification link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const isExporting = isExportingPng || isExportingPdf;
  const disabled = !ready || isExporting || isSharing;

  return (
    <>
      <div className="flex items-center justify-center gap-3 w-full max-w-[390px] relative z-20">

        {/* ── COMBINED DOWNLOAD BUTTON & DROPDOWN ── */}
        <div ref={downloadRef} className="relative flex-1">
          <button
            onClick={() => {
              setDownloadOpen(!downloadOpen);
              setShareOpen(false);
            }}
            disabled={disabled}
            className="w-full h-11 px-4 rounded-xl bg-[#F5C518] text-[#073D1E] font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[#ffe066] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{ boxShadow: "0 4px 20px rgba(245,197,24,0.25)" }}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExportingPng ? "EXPORTING PNG…" : isExportingPdf ? "EXPORTING PDF…" : "DOWNLOAD"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Download Dropdown Menu */}
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
                  <span className="text-[9px] text-[rgba(253,251,247,0.45)] font-normal normal-case">High-res image format</span>
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
                  <span className="text-[9px] text-[rgba(253,251,247,0.45)] font-normal normal-case">CR80 standard print format</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* ── SHARE BUTTON & DROPDOWN ── */}
        <div ref={shareRef} className="relative flex-1">
          <button
            onClick={() => {
              setShareOpen(!shareOpen);
              setDownloadOpen(false);
            }}
            disabled={!ready || isExporting || isSharing}
            className="w-full h-11 px-4 rounded-xl bg-[rgba(245,197,24,0.12)] text-[#F5C518] border border-[rgba(245,197,24,0.3)] font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[rgba(245,197,24,0.22)] hover:border-[#F5C518] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md shadow-lg"
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#F5C518]" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span>{isSharing ? "SHARING…" : "SHARE"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shareOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Share Dropdown Menu */}
          {shareOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-xl p-1.5 backdrop-blur-xl border border-[rgba(245,197,24,0.25)] shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 z-50 min-w-[210px] right-0 sm:right-auto"
              style={{ background: "rgba(7,61,30,0.95)" }}
            >
              <button
                onClick={() => handleSharePlatform("linkedin")}
                disabled={isSharing}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-bold uppercase tracking-wider text-[#FDFBF7] hover:bg-[rgba(245,197,24,0.12)] hover:text-[#F5C518] transition-all disabled:opacity-50"
              >
                <LinkedInSVG />
                <span>LINKEDIN</span>
              </button>
              <div className="my-1 h-[1px] bg-[rgba(245,197,24,0.12)]" />
              <button
                onClick={() => handleSharePlatform("x")}
                disabled={isSharing}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-bold uppercase tracking-wider text-[#FDFBF7] hover:bg-[rgba(245,197,24,0.12)] hover:text-[#F5C518] transition-all disabled:opacity-50"
              >
                <XTwitterSVG />
                <span>X (TWITTER)</span>
              </button>
              <div className="my-1 h-[1px] bg-[rgba(245,197,24,0.12)]" />
              <button
                onClick={() => handleSharePlatform("whatsapp")}
                disabled={isSharing}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-bold uppercase tracking-wider text-[#FDFBF7] hover:bg-[rgba(245,197,24,0.12)] hover:text-[#F5C518] transition-all disabled:opacity-50"
              >
                <WhatsAppSVG />
                <span>WHATSAPP</span>
              </button>
              <div className="my-1 h-[1px] bg-[rgba(245,197,24,0.12)]" />
              <button
                onClick={handleCopyLink}
                disabled={isSharing}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-bold uppercase tracking-wider text-[#FDFBF7] hover:bg-[rgba(245,197,24,0.12)] hover:text-[#F5C518] transition-all disabled:opacity-50"
              >
                <span className="w-4 h-4 text-[#F5C518] flex items-center justify-center font-mono font-bold text-xs">🔗</span>
                <span>COPY PASS LINK</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl backdrop-blur-xl border border-[rgba(245,197,24,0.35)] shadow-2xl flex items-center gap-3 text-xs font-bold text-[#FDFBF7] transition-all animate-in fade-in slide-in-from-bottom-4"
          style={{ background: "rgba(7, 61, 30, 0.95)", boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(245,197,24,0.2)" }}
        >
          <Check className="w-4 h-4 text-[#F5C518] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
