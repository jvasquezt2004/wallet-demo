"use client";

import { QRCodeSVG } from "qrcode.react";

// El QR siempre va en tinta oscura sobre blanco, con margen de reposo: es lo que
// lee la cámara del personal, así que no se tiñe con colores de marca.
export function QrCode({
  value,
  size = 208,
  label = "Código QR",
}: {
  value: string;
  size?: number;
  label?: string;
}) {
  return (
    <div className="inline-block rounded-2xl border border-tinta/15 bg-white p-3.5" role="img" aria-label={label}>
      <QRCodeSVG value={value || " "} size={size} level="M" marginSize={0} fgColor="#10143a" bgColor="#ffffff" />
    </div>
  );
}
