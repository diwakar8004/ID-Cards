"use client";

import React, { useRef, useState, useEffect } from "react";
import { Download, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

import { Button } from "@/components/ui/button";
import { IDCard, type IDCardProps } from "./IDCard";
import { generateQRCodeDataUrl } from "@/lib/qr";

type IDCardExportProps = Omit<IDCardProps, "qrCodeDataUrl"> & {
  verificationToken: string;
};

export function IDCardExport({ user, verificationToken }: IDCardExportProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Generate the QR code data URL once on mount
  useEffect(() => {
    generateQRCodeDataUrl(verificationToken, { width: 400, margin: 1 })
      .then(setQrCodeDataUrl)
      .catch(console.error);
  }, [verificationToken]);

  const handleExportPng = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);
    
    try {
      // Small delay to ensure all fonts and images are fully loaded
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3, // High-res export for printing
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

      // Standard CR80 ID Card dimensions in mm: 54 x 85.6
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

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-2xl p-4 bg-canvas border border-divider shadow-sm inline-block">
        {qrCodeDataUrl ? (
          <IDCard 
            ref={cardRef} 
            user={user} 
            qrCodeDataUrl={qrCodeDataUrl} 
          />
        ) : (
          <div className="w-[340px] h-[540px] bg-white rounded-2xl flex items-center justify-center border border-divider shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-accent-navy" />
          </div>
        )}
      </div>
      
      <div className="flex gap-3 w-[340px]">
        <Button 
          variant="outline" 
          onClick={handleExportPng} 
          disabled={!qrCodeDataUrl || isExportingPng || isExportingPdf}
          className="flex-1"
        >
          {isExportingPng ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4 mr-2" />
          )}
          Save PNG
        </Button>
        <Button 
          onClick={handleExportPdf} 
          disabled={!qrCodeDataUrl || isExportingPng || isExportingPdf}
          className="flex-1 bg-accent-navy hover:bg-blue-700 text-white"
        >
          {isExportingPdf ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          Save PDF
        </Button>
      </div>
    </div>
  );
}
