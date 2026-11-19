"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ScanResultView, type ScanResult } from "@/components/scan-result";
import { SiteNav } from "@/components/site-nav";
import { StampCard } from "@/components/stamp-card";
import { AlertIcon, CheckIcon } from "@/components/icons";
import { postJson } from "@/lib/api";
import { btnPrimary } from "@/lib/ui";
import type { CustomerDTO, RestaurantDTO } from "@/lib/types";

type PassData = { customer: CustomerDTO; restaurant: RestaurantDTO };

export default function ScanClient() {
  const { customerId } = useParams<{ customerId: string }>();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Vista previa de a quién se le va a sellar. Si el código no es un ID de
  // cliente, no hay vista previa y la confirmación funciona igual.
  const { data: pass } = useSWR<PassData | null>(`/api/customers/${customerId}`, {
    shouldRetryOnError: false,
  });

  async function confirm() {
    setLoading(true);
    setError(null);
    try {
      setResult(await postJson<ScanResult>("/api/scan", { customerId }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la visita.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-lito-deep text-white">
      <SiteNav current="/scan" />
      <main className="mx-auto max-w-md px-4 pb-10 pt-5 sm:px-6">
        {result ? (
          <ScanResultView result={result} />
        ) : (
          <div className="space-y-5">
            <div>
              <h1 className="lettering text-[1.8rem]">Confirmar visita</h1>
              <p className="mt-2 text-[1.05rem] leading-snug text-white/85">
                {pass
                  ? `Vas a sumar un sello a ${pass.customer.name}.`
                  : "Pase de cliente detectado. Confirma para sumar un sello."}{" "}
                Se cuenta una sola visita por día.
              </p>
            </div>

            {pass && (
              <StampCard
                restaurant={pass.restaurant}
                stamps={pass.customer.currentStamps}
                customerName={pass.customer.name}
                totalVisits={pass.customer.totalVisits}
                unlockedRewardIds={pass.customer.unlockedRewardIds ?? []}
                compact
              />
            )}

            <div aria-live="polite" className="empty:hidden">
              {error && (
                <p className="flex items-start gap-2.5 rounded-lg bg-aviso-soft p-3.5 text-[0.95rem] leading-snug text-tinta">
                  <AlertIcon size={20} className="mt-0.5 shrink-0 text-aviso" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <button onClick={confirm} disabled={loading} className={`${btnPrimary} w-full`}>
              {loading ? (
                <>
                  <span
                    className="spin inline-block h-5 w-5 rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                  Registrando…
                </>
              ) : (
                <>
                  <CheckIcon size={20} strokeWidth={3} />
                  Confirmar visita
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
