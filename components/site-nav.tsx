"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrushIcon, CameraIcon, ChartIcon } from "./icons";

const links = [
  { href: "/admin", label: "Configurar", icon: BrushIcon },
  { href: "/scan", label: "Escáner", icon: CameraIcon },
  { href: "/dashboard", label: "Panel", icon: ChartIcon },
];

export function WordmarkSeal({ size = 32 }: { size?: number }) {
  // Sello festoneado con estrella: la marca de Sello Club.
  const pts: string[] = [];
  for (let deg = 0; deg <= 360; deg += 3) {
    const t = (deg * Math.PI) / 180;
    const r = 43 + 4 * Math.abs(Math.cos(12 * t));
    pts.push(`${(50 + r * Math.sin(t)).toFixed(1)},${(50 - r * Math.cos(t)).toFixed(1)}`);
  }
  const star: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 24 : 10;
    const t = (i * Math.PI) / 5;
    star.push(`${(50 + r * Math.sin(t)).toFixed(1)},${(50 - r * Math.cos(t)).toFixed(1)}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d={`M${pts.join("L")}Z`} fill="#ffc72c" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#1b2a8f" strokeWidth="2.5" strokeOpacity="0.6" />
      <path d={`M${star.join("L")}Z`} fill="#1b2a8f" />
    </svg>
  );
}

export function SiteNav({ current, minimal = false }: { current?: string; minimal?: boolean }) {
  const pathname = usePathname();
  const active = current ?? pathname;
  return (
    <header className="bg-lito text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:gap-6 sm:px-8 sm:py-2.5">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="Sello Club, inicio">
          <WordmarkSeal />
          <span className="display hidden text-[1.3rem] sm:inline">Sello Club</span>
        </Link>
        {!minimal && (
        <nav aria-label="Principal" className="-mx-2 flex items-center">
          {links.map(({ href, label, icon: IconCmp }) => {
            const isActive = active === href || active?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`label font-semibold flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-[0.95rem] sm:px-3 transition-colors ${
                  isActive ? "bg-canario text-tinta" : "text-white hover:bg-white/12"
                }`}
              >
                <IconCmp size={18} className="hidden sm:block" />
                {label}
              </Link>
            );
          })}
        </nav>
        )}
      </div>
    </header>
  );
}
