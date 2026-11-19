import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Titulares con carácter; el resto de la interfaz va en Geist.
const display = Bricolage_Grotesque({
  variable: "--f-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const body = Geist({
  variable: "--f-body",
  subsets: ["latin"],
});

// Todas las páginas cargan datos en el cliente, así que las navegaciones no
// pueden ser "instantáneas". Desactivamos la validación (solo afecta al overlay
// de desarrollo, no al build ni al runtime).
export const instant = false;

export const metadata: Metadata = {
  title: "Sello Club · Lealtad para restaurantes",
  description: "Tarjetas de sellos digitales en Google Wallet, sin descargar apps.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b2a8f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
