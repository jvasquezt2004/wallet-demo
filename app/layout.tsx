import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Todas las páginas cargan datos de Convex en el cliente, así que las
// navegaciones no pueden ser "instantáneas". Desactivamos la validación
// (solo afecta al overlay de desarrollo, no al build ni al runtime).
export const instant = false;

export const metadata: Metadata = {
  title: "Sello Club · Lealtad para restaurantes",
  description: "Tarjetas de sellos digitales en Google Wallet, sin descargar apps.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e293b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-50 text-neutral-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
