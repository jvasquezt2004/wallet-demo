"use client";

import Link from "next/link";
import useSWR from "swr";
import { SiteNav } from "@/components/site-nav";
import { StampCard, type CardRestaurant } from "@/components/stamp-card";
import { ArrowIcon } from "@/components/icons";
import { DEFAULT_FORM } from "@/lib/branding";
import { btnCanary } from "@/lib/ui";
import type { RestaurantDTO } from "@/lib/types";

// Tarjeta de ejemplo del pitch: siempre es una muestra, nunca datos reales.
const SAMPLE: CardRestaurant = {
  name: DEFAULT_FORM.name,
  logoUrl: "",
  bgColor: DEFAULT_FORM.bgColor,
  primaryColor: DEFAULT_FORM.primaryColor,
  textColor: DEFAULT_FORM.textColor,
  rewardText: DEFAULT_FORM.rewardText,
  stampsRequired: DEFAULT_FORM.stampsRequired,
  rewards: DEFAULT_FORM.rewards,
};

export default function Home() {
  const { data: restaurant } = useSWR<RestaurantDTO | null>("/api/restaurants");

  const hasRestaurant = Boolean(restaurant);
  const live = restaurant?.published ?? false;
  const customerHref = live && restaurant ? `/c/${restaurant.slug}` : "/admin";

  const steps = [
    {
      href: "/admin",
      title: "Configura tu tarjeta",
      text: "Logo, colores y premios. Publícala cuando te guste.",
    },
    {
      href: customerHref,
      title: "El cliente se une",
      text: "Escanea tu QR, deja nombre y correo y guarda la tarjeta en Google Wallet.",
    },
    {
      href: "/scan",
      title: "Sella en caja",
      text: "Escanea su QR o teclea su código: un sello por visita y día.",
    },
    {
      href: "/dashboard",
      title: "Mira cómo vuelven",
      text: "Visitas por día, clientes nuevos y quién dejó de venir.",
    },
  ];

  return (
    <div className="min-h-screen bg-lito">
      <SiteNav />
      <main className="rays overflow-hidden text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-14 pt-10 text-center sm:pt-14">
          <h1
            className="lettering lettering-shadow rise text-[clamp(2.4rem,9vw,4.6rem)] leading-[1.02]"
            style={{ ["--lettering-ink" as string]: "var(--tomate)" }}
          >
            Lealtad que cabe en el bolsillo
          </h1>
          <p className="rise rise-2 mt-5 max-w-xl text-[1.15rem] leading-snug text-white/90 sm:text-[1.25rem]">
            Tarjetas de sellos digitales que tus clientes guardan en Google Wallet. Sin apps y sin
            tarjetas de plástico.
          </p>

          <div className="rise rise-3 mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <Link href={customerHref} className={btnCanary}>
              {live ? "Ver la tarjeta del cliente" : hasRestaurant ? "Publicar mi tarjeta" : "Crear mi tarjeta"}
              <ArrowIcon size={20} />
            </Link>
            <Link
              href="/scan"
              className="flex min-h-12 items-center px-3 text-base font-bold text-white underline decoration-2 underline-offset-4 hover:text-canario"
            >
              Abrir el escáner
            </Link>
          </div>

          <div className="rise rise-4 mt-10 w-full max-w-[24rem] -rotate-[1.5deg]">
            <StampCard
              restaurant={SAMPLE}
              stamps={3}
              customerName="María"
              totalVisits={3}
              landingFrom={0}
            />
            <p className="mt-3 text-[0.95rem] text-white/80">
              Tarjeta de ejemplo. Configura la tuya con tu logo y tus colores.
            </p>
          </div>
        </div>
      </main>

      <section className="stock border-t-2 border-tinta text-tinta" aria-labelledby="recorrido">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <h2 id="recorrido" className="lettering text-[1.7rem] sm:text-[2rem]">
            El recorrido, en cuatro pasos
          </h2>
          <ol className="mt-6 grid list-none gap-x-8 gap-y-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="border-t-2 border-dashed border-tinta/40 py-5">
                <Link href={step.href} className="group block rounded-lg">
                  <span className="lettering block text-[2.6rem] leading-none text-tomate">{i + 1}</span>
                  <span className="mt-3 flex items-center gap-2 text-[1.2rem] font-bold leading-tight group-hover:underline">
                    {step.title}
                    <ArrowIcon size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-1.5 block text-[1rem] leading-snug text-tinta-soft">{step.text}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
