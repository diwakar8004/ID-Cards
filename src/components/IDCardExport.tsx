"use client";

import React, { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { IDCard, type IDCardProps } from "./IDCard";
import { DownloadActions } from "./PassPreview";
import { generateQRCodeDataUrl } from "@/lib/qr";

type IDCardExportProps = Omit<IDCardProps, "qrCodeDataUrl"> & {
  verificationToken: string;
};

export function IDCardExport({ user, verificationToken }: IDCardExportProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    generateQRCodeDataUrl(verificationToken, { width: 400, margin: 1 })
      .then(setQrCodeDataUrl)
      .catch(console.error);
  }, [verificationToken]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Card preview */}
      <div className="inline-block scale-[1.15] sm:scale-[1.25] md:scale-[1.3]">
        {qrCodeDataUrl ? (
          <IDCard
            ref={cardRef}
            user={user}
            qrCodeDataUrl={qrCodeDataUrl}
          />
        ) : (
          <div
            className="rounded-[24px] flex items-center justify-center border border-divider shadow-lg"
            style={{
              width: "340px",
              height: "540px",
              background: "linear-gradient(175deg, #0A5C2E 0%, #073D1E 55%, #051F10 100%)",
            }}
          >
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#F5C518" }} />
          </div>
        )}
      </div>

      {/* Action buttons (Download & Share dropdowns) */}
      <div className="w-full flex justify-center mt-4">
        <DownloadActions
          user={user}
          cardRef={cardRef}
          ready={!!qrCodeDataUrl}
        />
      </div>
    </div>
  );
}
