"use client";

import Link from "next/link";
import useSWR from "swr";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { CameraIcon, MailIcon, RefreshIcon } from "@/components/icons";
import { btnOutline, btnPrimary, btnSmall } from "@/lib/ui";
import type { DashboardStats, RestaurantDTO } from "@/lib/types";

const dayLong = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const dayShort = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString("es", { weekday: "short" }).replace(".", "");

const dayNarrow = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString("es", { weekday: "narrow" });

const dayNumber = (day: string) => new Date(`${day}T12:00:00`).getDate();

const shortDate = (ts: number) =>
  new Date(ts).toLocaleDateString("es", { day: "numeric", month: "short" });

const panel = "rounded-[10px] border border-tinta/20 bg-white p-5 sm:p-6";
const panelTitle = "lettering text-[1.3rem] leading-tight";

function Panel({
  title,
  note,
  children,
  className = "",
}: {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${panel} ${className}`}>
      <h2 className={panelTitle}>{title}</h2>
      {note && <p className="mt-1 text-[0.95rem] text-tinta-soft">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-4 sm:px-6">
      <dt className="label-caps text-[0.9rem] text-tinta-soft">{label}</dt>
      <dd className="num lettering mt-1 text-[2.2rem]">{value}</dd>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-lg bg-mesa p-4 text-[1rem] text-tinta-soft">{children}</p>;
}

function VisitsChart({ data }: { data: DashboardStats["visitsByDay"] }) {
  const rawMax = Math.max(0, ...data.map((d) => d.count));
  const top = Math.max(2, Math.ceil(rawMax / 2) * 2);
  const peak = rawMax > 0 ? data.findIndex((d) => d.count === rawMax) : -1;

  return (
    <div>
      <div className="flex gap-2 sm:gap-3">
        {/* Escala: tres referencias, una sola unidad. */}
        <div
          className="num relative h-56 w-6 shrink-0 text-right text-[0.8rem] text-tinta-soft"
          aria-hidden="true"
        >
          <span className="absolute right-0 top-0 -translate-y-1/2">{top}</span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2">{top / 2}</span>
          <span className="absolute bottom-0 right-0 translate-y-1/2">0</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-56">
            <div className="absolute inset-x-0 top-0 border-t border-tinta/12" aria-hidden="true" />
            <div className="absolute inset-x-0 top-1/2 border-t border-tinta/12" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 border-t-2 border-tinta/45" aria-hidden="true" />
            <ul className="absolute inset-0 flex list-none items-stretch gap-[3px] p-0 sm:gap-2" aria-label="Visitas por día">
              {data.map(({ day, count }, i) => (
                <li
                  key={day}
                  tabIndex={0}
                  aria-label={`${dayLong(day)}: ${count} ${count === 1 ? "visita" : "visitas"}`}
                  className="group relative flex min-w-0 flex-1 flex-col justify-end rounded-t-[4px] outline-offset-2 hover:bg-lito/6 focus-visible:bg-lito/6"
                >
                  {i === peak && (
                    <span className="num absolute left-1/2 -translate-x-1/2 text-[0.85rem] font-bold" style={{ bottom: `calc(${(count / top) * 100}% + 4px)` }}>
                      {count}
                    </span>
                  )}
                  <span
                    className="block w-full rounded-t-[4px] bg-lito transition-colors group-hover:bg-tomate group-focus-visible:bg-tomate"
                    style={{ height: `${count === 0 ? 0 : Math.max(2, (count / top) * 100)}%` }}
                  />
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-tinta px-3 py-1.5 text-[0.9rem] font-semibold text-white group-hover:block group-focus-visible:block"
                  >
                    {dayLong(day)} · {count} {count === 1 ? "visita" : "visitas"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="mt-2 flex list-none gap-[3px] p-0 sm:gap-2" aria-hidden="true">
            {data.map(({ day }) => (
              <li key={day} className="num min-w-0 flex-1 text-center text-[0.75rem] leading-tight text-tinta-soft">
                <span className="block">{dayNumber(day)}</span>
                <span className="block uppercase sm:hidden">{dayNarrow(day)}</span>
                <span className="hidden sm:block">{dayShort(day)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <details className="mt-4">
        <summary className="flex min-h-11 cursor-pointer items-center text-[0.95rem] font-bold text-lito hover:underline">
          Ver como tabla
        </summary>
        <table className="num mt-2 w-full text-left text-[0.95rem]">
          <thead>
            <tr className="border-b border-tinta/20 text-tinta-soft">
              <th className="py-1.5 font-semibold">Día</th>
              <th className="py-1.5 text-right font-semibold">Visitas</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ day, count }) => (
              <tr key={day} className="border-b border-tinta/10">
                <td className="py-1.5">{dayLong(day)}</td>
                <td className="py-1.5 text-right">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="mt-7 space-y-6" role="status" aria-label="Cargando estadísticas">
      <div className="h-24 animate-pulse rounded-[10px] bg-tinta/10" />
      <div className="h-80 animate-pulse rounded-[10px] bg-tinta/10" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-[10px] bg-tinta/10" />
        <div className="h-64 animate-pulse rounded-[10px] bg-tinta/10" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: restaurant } = useSWR<RestaurantDTO | null>("/api/restaurants");
  const {
    data: stats,
    error: statsError,
    mutate: reloadStats,
  } = useSWR<DashboardStats | null>(
    restaurant ? `/api/dashboard?restaurantId=${restaurant.id}` : null
  );

  const noVisitsYet = stats ? stats.visitsByDay.every((d) => d.count === 0) && stats.recentVisits.length === 0 : false;
  const weekdayMax = stats ? Math.max(1, ...stats.visitsByWeekday.map((d) => d.count)) : 1;

  return (
    <div className="on-mesa min-h-screen bg-mesa">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-7 sm:px-8">
        <h1 className="lettering text-[2rem] sm:text-[2.4rem]">Panel</h1>
        <p className="mt-2 text-[1.05rem] text-tinta-soft">
          {restaurant ? restaurant.name : restaurant === null ? "Sin restaurante" : "Cargando…"} ·
          cómo se comportan tus clientes
        </p>

        {restaurant === null ? (
          <div className="mt-7">
            <Empty>
              Todavía no has configurado tu restaurante.{" "}
              <Link href="/admin" className="font-bold text-lito underline">
                Crea tu tarjeta
              </Link>{" "}
              para empezar a ver datos aquí.
            </Empty>
          </div>
        ) : statsError ? (
          <div role="alert" className="mt-7 rounded-[10px] border-2 border-tomate bg-white p-6">
            <p className="lettering text-[1.3rem] text-tomate-deep">
              No se pudieron cargar las estadísticas
            </p>
            <p className="mt-2 text-[1rem] font-semibold">{statsError.message}</p>
            <button onClick={() => reloadStats()} className={`${btnPrimary} mt-5`}>
              <RefreshIcon size={18} />
              Reintentar
            </button>
          </div>
        ) : !stats ? (
          <PanelSkeleton />
        ) : (
          <div className="mt-7 space-y-6">
            <dl className="grid grid-cols-2 divide-tinta/15 rounded-[10px] border border-tinta/20 bg-white sm:grid-cols-4 sm:divide-x [&>div:nth-child(n+3)]:border-t [&>div:nth-child(n+3)]:border-tinta/15 sm:[&>div:nth-child(n+3)]:border-t-0 [&>div:nth-child(even)]:border-l [&>div:nth-child(even)]:border-tinta/15 sm:[&>div:nth-child(even)]:border-l-0">
              <Metric label="Visitas hoy" value={stats.visitsToday} />
              <Metric label="Visitas en 7 días" value={stats.visitsLast7Days} />
              <Metric label="Clientes nuevos (7 días)" value={stats.newCustomers.length} />
              <Metric label="Clientes recurrentes" value={stats.returningCustomers} />
            </dl>

            {noVisitsYet && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border-2 border-dashed border-lito/50 bg-white p-5">
                <p className="max-w-xl text-[1.05rem] leading-snug">
                  Aún no hay visitas registradas. En cuanto escanees la tarjeta de un cliente,
                  aquí aparecerán sus visitas y hábitos.
                </p>
                <Link href="/scan" className={`${btnPrimary} ${btnSmall}`}>
                  <CameraIcon size={18} />
                  Abrir el escáner
                </Link>
              </div>
            )}

            <Panel title="Visitas por día" note="Últimos 14 días">
              <VisitsChart data={stats.visitsByDay} />
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Quién vino" note="Últimas visitas registradas">
                {stats.recentVisits.length === 0 ? (
                  <Empty>Aún no hay visitas.</Empty>
                ) : (
                  <ul className="list-none divide-y divide-tinta/10 p-0">
                    {stats.recentVisits.map((visit, i) => (
                      <li
                        key={`${visit.id}-${visit.scannedAt}-${i}`}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="lettering flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canario text-[1rem] text-tinta"
                          >
                            {visit.customerName.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[1rem] font-semibold">{visit.customerName}</p>
                            <p className="text-[0.9rem] text-tinta-soft">{dayLong(visit.day)}</p>
                          </div>
                        </div>
                        <span className="num shrink-0 text-[0.95rem] text-tinta-soft">
                          {new Date(visit.scannedAt).toLocaleTimeString("es", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <Panel title="¿Cuándo suelen venir?" note="Visitas por día de la semana">
                <ul className="list-none space-y-2.5 p-0">
                  {stats.visitsByWeekday.map(({ label, count }) => {
                    const isTop = count > 0 && count === weekdayMax;
                    return (
                      <li key={label} className="flex items-center gap-3">
                        <span className="w-10 text-[0.95rem] font-semibold">{label}</span>
                        <div className="h-4 flex-1 rounded-r-[4px] bg-mesa">
                          <div
                            className={`h-4 rounded-r-[4px] ${isTop ? "bg-lito" : "bg-lito/45"}`}
                            style={{ width: `${(count / weekdayMax) * 100}%` }}
                          />
                        </div>
                        <span className="num w-7 text-right text-[0.95rem] font-semibold">{count}</span>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Clientes que dejaron de venir" note="Sin visitas en los últimos 14 días">
                {stats.inactiveCustomers.length === 0 ? (
                  <Empty>Todos tus clientes han venido hace poco.</Empty>
                ) : (
                  <ul className="list-none divide-y divide-tinta/10 p-0">
                    {stats.inactiveCustomers.slice(0, 8).map((customer) => (
                      <li key={customer.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[1rem] font-semibold">{customer.name}</p>
                          <p className="truncate text-[0.9rem] text-tinta-soft">
                            {customer.email} · última visita {shortDate(customer.lastVisitAt)}
                          </p>
                        </div>
                        <a
                          href={`mailto:${customer.email}?subject=${encodeURIComponent(
                            `Te echamos de menos${restaurant ? ` en ${restaurant.name}` : ""}`
                          )}`}
                          className={`${btnOutline} ${btnSmall} shrink-0`}
                          aria-label={`Escribir a ${customer.name}`}
                        >
                          <MailIcon size={16} />
                          Escribir
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <Panel title="Clientes nuevos" note="Se unieron en los últimos 7 días">
                {stats.newCustomers.length === 0 ? (
                  <Empty>Ninguno todavía. Comparte el QR de tu tarjeta para que se unan.</Empty>
                ) : (
                  <ul className="list-none divide-y divide-tinta/10 p-0">
                    {stats.newCustomers.map((customer) => (
                      <li key={customer.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[1rem] font-semibold">{customer.name}</p>
                          <p className="truncate text-[0.9rem] text-tinta-soft">{customer.email}</p>
                        </div>
                        <span className="num shrink-0 text-[0.9rem] text-tinta-soft">
                          {shortDate(customer.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
