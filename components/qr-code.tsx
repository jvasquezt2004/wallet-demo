"use client";

import { QRCodeSVG } from "qrcode.react";

export function QrCode({ value, size = 208 }: { value: string; size?: number }) {
  return (
    <div className="inline-block rounded-2xl bg-white p-4 shadow-sm">
      <QRCodeSVG value={value || " "} size={size} level="M" marginSize={0} />
    </div>
  );
}
