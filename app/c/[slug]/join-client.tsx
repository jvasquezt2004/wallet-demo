"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { LoyaltyCard } from "@/components/loyalty-card";
import { postJson } from "@/lib/api";
import type { CustomerDTO, RestaurantDTO } from "@/lib/types";

type PassData = { customer: CustomerDTO; restaurant: RestaurantDTO };

export default function JoinClient() {
  const { slug } = useParams<{ slug: string }>();
  const { data: restaurant } = useSWR<RestaurantDTO | null>(`/api/restaurants/${slug}`);

  const [customerId, setCustomerId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(`loyalty:${slug}`);
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recovered, setRecovered] = useState(false);
  const [walletUrl, setWalletUrl] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const { data: passData } = useSWR<PassData | null>(
    customerId ? `/api/customers/${customerId}` : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await postJson<{ customerId: string; isExisting: boolean }>(
        "/api/customers",
        { restaurantSlug: slug, name, email }
      );
      localStorage.setItem(`loyalty:${slug}`, result.customerId);
      setRecovered(result.isExisting);
      setCustomerId(result.customerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la tarjeta.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddWallet() {
    if (!customerId) return;
    setWalletLoading(true);
    setWalletError(null);
    try {
      const result = await postJson<{ url: string }>("/api/wallet", { customerId });
      setWalletUrl(result.url);
    } catch (err) {
      setWalletError(
        err instanceof Error
          ? `${err.message} Mientras tanto, usa el QR de arriba.`
          : "No se pudo generar el pase. Usa el QR de arriba."
      );
    } finally {
      setWalletLoading(false);
    }
  }

  if (restaurant === undefined) {
    return <main className="flex min-h-screen items-center justify-center">Cargando...</main>;
  }

  if (!restaurant) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Restaurante no encontrado</h1>
          <p className="mt-2 text-neutral-500">Revisa el enlace e inténtalo de nuevo.</p>
        </div>
      </main>
    );
  }

  if (!restaurant.published) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="mt-2 text-neutral-500">Nuestra tarjeta de sellos estará disponible pronto.</p>
        </div>
      </main>
    );
  }

  if (customerId && passData === undefined) {
    return <main className="flex min-h-screen items-center justify-center">Cargando tarjeta...</main>;
  }

  if (customerId && passData) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <LoyaltyCard
          customerId={customerId}
          customerName={passData.customer.name}
          currentStamps={passData.customer.currentStamps}
          totalVisits={passData.customer.totalVisits}
          unlockedRewardIds={passData.customer.unlockedRewardIds ?? []}
          restaurant={passData.restaurant}
          recovered={recovered}
          walletUrl={walletUrl}
          walletLoading={walletLoading}
          walletError={walletError}
          onAddWallet={handleAddWallet}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: restaurant.bgColor, color: restaurant.textColor }}
      >
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        {restaurant.description && <p className="mt-1 text-sm opacity-80">{restaurant.description}</p>}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-xl font-bold">Obtén tu tarjeta de sellos</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Sin descargar apps. Si ya tenías tarjeta, usa el mismo correo para recuperarla con tus
            sellos intactos.
          </p>
        </div>
        <input
          required
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-neutral-900"
        />
        <input
          required
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-neutral-900"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Generando tarjeta..." : "Crear / Recuperar Tarjeta"}
        </button>
        <p className="text-center text-xs text-neutral-400">
          Al continuar, tu tarjeta se guarda en este dispositivo y en Google Wallet.
        </p>
      </form>
    </main>
  );
}
