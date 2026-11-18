"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ScanResultView, type ScanResult } from "@/components/scan-result";
import { postJson } from "@/lib/api";

export default function ScanClient() {
  const { customerId } = useParams<{ customerId: string }>();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      {result ? (
        <ScanResultView result={result} />
      ) : (
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">📷</div>
          <h1 className="mt-4 text-2xl font-bold">Pase de cliente detectado</h1>
          <p className="mt-2 text-neutral-600">
            Confirma para otorgar un sello. El sistema evita sellos duplicados en un mismo día.
          </p>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            onClick={confirm}
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Confirmar visita"}
          </button>
        </div>
      )}
    </main>
  );
}
