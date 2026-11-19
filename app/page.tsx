"use client";

import Link from "next/link";
import useSWR from "swr";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { ArrowIcon } from "@/components/icons";
import { btnOutlineLight } from "@/lib/ui";
import type { RestaurantDTO } from "@/lib/types";

// Ilustraciones de los tres paneles: formas planas, sin texto.
function ConfigArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-14 w-auto sm:h-20" aria-hidden="true">
      <rect x="2" y="6" width="116" height="68" rx="14" fill="#1b2a8f" />
      <rect x="14" y="18" width="30" height="8" rx="4" fill="#ffc72c" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={26 + i * 24} cy="46" r="9" fill={i < 3 ? "#d42a14" : "none"} stroke="#d42a14" strokeWidth="2.5" strokeOpacity={i < 3 ? 1 : 0.6} />
      ))}
      <rect x="14" y="62" width="92" height="4" rx="2" fill="#ffffff" fillOpacity="0.25" />
      <rect x="14" y="62" width="52" height="4" rx="2" fill="#ffc72c" />
    </svg>
  );
}

function ScanArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-14 w-auto sm:h-20" aria-hidden="true">
      <g fill="none" stroke="#10143a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 28V18a8 8 0 0 1 8-8h10M80 10h10a8 8 0 0 1 8 8v10M98 52v10a8 8 0 0 1-8 8H80M40 70H30a8 8 0 0 1-8-8V52" />
      </g>
      <rect x="40" y="26" width="14" height="14" rx="3" fill="#10143a" />
      <rect x="66" y="26" width="14" height="14" rx="3" fill="#10143a" />
      <rect x="40" y="46" width="14" height="14" rx="3" fill="#10143a" />
      <rect x="66" y="50" width="6" height="6" rx="2" fill="#10143a" />
      <rect x="10" y="38" width="100" height="4" rx="2" fill="#d42a14" />
    </svg>
  );
}

function ChartArt() {
  const bars = [22, 38, 30, 52, 44, 62];
  return (
    <svg viewBox="0 0 120 80" className="h-14 w-auto sm:h-20" aria-hidden="true">
      {bars.map((h, i) => (
        <rect key={i} x={8 + i * 19} y={74 - h} width="13" height={h} rx="4" fill={i === 5 ? "#ffc72c" : "#ffffff"} fillOpacity={i === 5 ? 1 : 0.35} />
      ))}
    </svg>
  );
}

function Pane({
  href,
  title,
  text,
  art,
  className,
}: {
  href: string;
  title: string;
  text: string;
  art: ReactNode;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-3xl p-5 transition-transform duration-200 hover:-translate-y-1 sm:min-h-[19rem] sm:p-7 ${className}`}
    >
      <span className="block">{art}</span>
      <span className="mt-auto block pt-5 sm:pt-8">
        <span className="display block text-[1.6rem]">{title}</span>
        <span className="mt-2 block max-w-[18rem] text-[1rem] leading-snug opacity-80">{text}</span>
        <span className="mt-5 flex items-center gap-2 text-[0.95rem] font-semibold">
          Abrir
          <ArrowIcon size={18} className="transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}

export default function Home() {
  const { data: restaurant } = useSWR<RestaurantDTO | null>("/api/restaurants");
  const live = restaurant?.published ?? false;

  return (
    <div className="min-h-screen bg-lito text-white">
      <SiteNav minimal />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <h1 className="display rise max-w-3xl text-[clamp(2.6rem,7.5vw,4.8rem)]">
          Lealtad que cabe en el bolsillo.
        </h1>
        <p className="rise rise-2 mt-5 max-w-xl text-[1.15rem] leading-snug text-white/85 sm:text-[1.25rem]">
          Tarjetas de sellos digitales que tus clientes guardan en Google Wallet. Sin apps, sin
          tarjetas de plástico.
        </p>
        {live && restaurant && (
          <Link
            href={`/c/${restaurant.slug}`}
            className={`${btnOutlineLight} rise rise-2 mt-6 inline-flex`}
          >
            Ver la tarjeta del cliente
            <ArrowIcon size={18} />
          </Link>
        )}

        <div className="rise rise-3 mt-12 grid gap-4 md:grid-cols-3">
          <Pane
            href="/admin"
            title="Configurar restaurante"
            text="Logo, colores, plantilla, sellos y recompensas. Publica y obtén tu QR."
            art={<ConfigArt />}
            className="bg-white text-tinta hover:shadow-lift"
          />
          <Pane
            href="/scan"
            title="Escanear cliente"
            text="Escanea el QR del cliente para sumarle un sello al instante."
            art={<ScanArt />}
            className="bg-canario text-tinta hover:shadow-lift"
          />
          <Pane
            href="/dashboard"
            title="Dashboard"
            text="Visitas por día, clientes nuevos, frecuencia y clientes inactivos."
            art={<ChartArt />}
            className="bg-lito-deep text-white hover:shadow-lift"
          />
        </div>
      </main>
    </div>
  );
}
