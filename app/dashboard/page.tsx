"use client";

import Link from "next/link";
import useSWR from "swr";
import type { DashboardStats, RestaurantDTO } from "@/lib/types";

const dateLabel = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const timeLabel = (ts: number) =>
  new Date(ts).toLocaleDateString("es", { day: "numeric", month: "short" });

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
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

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Inicio
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-neutral-600">
        {restaurant ? restaurant.name : "Cargando..."} · comportamiento de tus clientes
      </p>

      {statsError ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-900">No se pudieron cargar las estadísticas.</p>
          <p className="mt-2 text-sm text-red-700">{statsError.message}</p>
          <button
            onClick={() => reloadStats()}
            className="mt-4 rounded-xl bg-red-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      ) : !stats ? (
        <p className="mt-10 text-neutral-500">Cargando estadísticas...</p>
      ) : (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Visitas hoy" value={stats.visitsToday} />
            <Stat label="Visitas últimos 7 días" value={stats.visitsLast7Days} />
            <Stat label="Clientes nuevos (7 días)" value={stats.newCustomers.length} />
            <Stat label="Clientes recurrentes" value={stats.returningCustomers} />
          </div>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Visitas por día</h2>
            <p className="text-sm text-neutral-500">Últimos 14 días</p>
            <div className="mt-6 flex h-48 items-end gap-2">
              {stats.visitsByDay.map(({ day, count }) => {
                const max = Math.max(1, ...stats.visitsByDay.map((d) => d.count));
                return (
                  <div key={day} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-medium tabular-nums">{count || ""}</span>
                    <div
                      className="w-full rounded-t-md bg-neutral-900 transition-all group-hover:bg-emerald-600"
                      style={{ height: `${Math.max(2, (count / max) * 100)}%` }}
                    />
                    <span className="text-[10px] text-neutral-400">{dateLabel(day)}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Quién vino</h2>
            <p className="text-sm text-neutral-500">Últimas visitas registradas</p>
            {stats.recentVisits.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-500">Aún no hay visitas.</p>
            ) : (
              <div className="mt-4 divide-y divide-neutral-100">
                {stats.recentVisits.map((visit, i) => (
                  <div key={`${visit.id}-${visit.scannedAt}-${i}`} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-sm">
                        👤
                      </span>
                      <div>
                        <p className="text-sm font-medium">{visit.customerName}</p>
                        <p className="text-xs text-neutral-500">{dateLabel(visit.day)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {new Date(visit.scannedAt).toLocaleTimeString("es", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">¿Cuándo suele venir?</h2>
              <p className="text-sm text-neutral-500">Distribución por día de la semana</p>
              <div className="mt-5 space-y-2">
                {stats.visitsByWeekday.map(({ label, count }) => {
                  const max = Math.max(1, ...stats.visitsByWeekday.map((d) => d.count));
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-10 text-sm text-neutral-600">{label}</span>
                      <div className="h-3 flex-1 rounded-full bg-neutral-100">
                        <div
                          className="h-3 rounded-full bg-emerald-500"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-sm tabular-nums text-neutral-500">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Clientes que dejaron de venir</h2>
              <p className="text-sm text-neutral-500">Sin visitas en los últimos 14 días</p>
              <div className="mt-5 space-y-2">
                {stats.inactiveCustomers.length === 0 ? (
                  <p className="text-sm text-neutral-500">¡Todos están activos!</p>
                ) : (
                  stats.inactiveCustomers.slice(0, 8).map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-neutral-500">{customer.email}</p>
                      </div>
                      <span className="text-xs text-neutral-400">{timeLabel(customer.lastVisitAt)}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Clientes nuevos</h2>
            <p className="text-sm text-neutral-500">Se unieron en los últimos 7 días</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {stats.newCustomers.length === 0 ? (
                <p className="text-sm text-neutral-500">Ninguno todavía.</p>
              ) : (
                stats.newCustomers.map((customer) => (
                  <div key={customer.id} className="rounded-xl bg-neutral-50 px-3 py-2">
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-neutral-500">{customer.email}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
