import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Bowlby_One } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Rótulo de etiqueta de caja: letra gruesa para nombres y banderas.
const display = Bowlby_One({
  variable: "--f-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Barlow({
  variable: "--f-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const label = Barlow_Condensed({
  variable: "--f-label",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      className={`${display.variable} ${body.variable} ${label.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
