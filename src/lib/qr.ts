import QRCode from "qrcode";

// ============================================================
// QR Code Generation Utilities
// ============================================================

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Build the public verification URL for a given token.
 * The QR code NEVER contains personal information — only this URL.
 */
export function buildVerificationUrl(verificationToken: string): string {
  return `${APP_URL}/verify/${verificationToken}`;
}

/**
 * Generate a QR code as a base64 PNG Data URL.
 * Used for rendering in the IDCard component.
 */
export async function generateQRCodeDataUrl(
  verificationToken: string,
  options: {
    width?: number;
    margin?: number;
    color?: { dark?: string; light?: string };
  } = {}
): Promise<string> {
  const url = buildVerificationUrl(verificationToken);

  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    type: "image/png",
    width: options.width ?? 200,
    margin: options.margin ?? 1,
    color: {
      dark: options.color?.dark ?? "#0F172A",
      light: options.color?.light ?? "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  };

  return QRCode.toDataURL(url, qrOptions);
}

/**
 * Generate a QR code as an SVG string.
 * Useful for print-quality output.
 */
export async function generateQRCodeSVG(
  verificationToken: string,
  options: {
    width?: number;
    margin?: number;
    color?: { dark?: string; light?: string };
  } = {}
): Promise<string> {
  const url = buildVerificationUrl(verificationToken);

  const qrOptions: QRCode.QRCodeToStringOptions = {
    type: "svg",
    width: options.width ?? 200,
    margin: options.margin ?? 1,
    color: {
      dark: options.color?.dark ?? "#0F172A",
      light: options.color?.light ?? "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  };

  return QRCode.toString(url, qrOptions);
}

/**
 * Generate a QR code as a Buffer (PNG).
 * Used for server-side generation and storage.
 */
export async function generateQRCodeBuffer(
  verificationToken: string,
  options: {
    width?: number;
    margin?: number;
  } = {}
): Promise<Buffer> {
  const url = buildVerificationUrl(verificationToken);

  return QRCode.toBuffer(url, {
    width: options.width ?? 300,
    margin: options.margin ?? 2,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "H",
  });
}
