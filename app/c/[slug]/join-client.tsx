"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import type { ReactNode } from "react";
import { LoyaltyCard } from "@/components/loyalty-card";
import { StampCard } from "@/components/stamp-card";
import { Steps } from "@/components/steps";
import { postJson } from "@/lib/api";
import { btnPrimary, fieldHint, fieldLabel, input } from "@/lib/ui";
import type { CustomerDTO, RestaurantDTO } from "@/lib/types";

type PassData = { customer: CustomerDTO; restaurant: RestaurantDTO };

function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="rays flex min-h-[100dvh] items-center justify-center px-6 py-10 text-center text-white">
      <div className="max-w-sm">{children}</div>
    </main>
  );
}

function Loading({ text }: { text: string }) {
  return (
    <Screen>
      <span
        className="spin mx-auto block h-9 w-9 rounded-full border-[3px] border-white/30 border-t-canario"
        aria-hidden="true"
      />
      <p role="status" className="mt-4 text-lg font-semibold">
        {text}
      </p>
    </Screen>
  );
}

// "opened": se generó y abrió el pase. "saved": el cliente confirmó que ya lo guardó
// (Google no nos avisa, así que solo podemos fiarnos de su confirmación).
const walletOpenedKey = (customerId: string) => `loyalty-wallet-opened:${customerId}`;
const walletSavedKey = (customerId: string) => `loyalty-wallet:${customerId}`;

function readFlag(key: string | null): boolean {
  if (typeof window === "undefined" || !key) return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key: string) {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Sin almacenamiento solo se pierde el recordatorio.
  }
}

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
  const [walletOpened, setWalletOpened] = useState<boolean>(() =>
    readFlag(customerId ? walletOpenedKey(customerId) : null)
  );
  const [walletSaved, setWalletSaved] = useState<boolean>(() =>
    readFlag(customerId ? walletSavedKey(customerId) : null)
  );

  // La tarjeta se refresca sola: cuando el personal escanea, el cliente ve caer el sello.
  const { data: passData } = useSWR<PassData | null>(
    customerId ? `/api/customers/${customerId}` : null,
    { refreshInterval: 8000, revalidateOnFocus: true }
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
      setWalletOpened(true);
      writeFlag(walletOpenedKey(customerId));
      // Un toque menos: abrimos Wallet en cuanto el pase está listo. Si el
      // navegador lo bloquea, el botón "Abrir en Google Wallet" sigue ahí.
      window.location.assign(result.url);
    } catch (err) {
      setWalletError(
        err instanceof Error
          ? `${err.message} Mientras tanto, muestra el QR en caja.`
          : "No se pudo generar el pase. Mientras tanto, muestra el QR en caja."
      );
    } finally {
      setWalletLoading(false);
    }
  }

  if (restaurant === undefined) return <Loading text="Cargando…" />;

  if (!restaurant) {
    return (
      <Screen>
        <h1 className="lettering text-[2rem]">Restaurante no encontrado</h1>
        <p className="mt-3 text-lg text-white/85">
          Revisa el enlace o vuelve a escanear el QR del local.
        </p>
      </Screen>
    );
  }

  if (!restaurant.published) {
    return (
      <Screen>
        <h1 className="lettering lettering-shadow text-[2.2rem]" style={{ ["--lettering-ink" as string]: "var(--tomate)" }}>
          {restaurant.name}
        </h1>
        <p className="mt-4 text-lg text-white/85">
          Nuestra tarjeta de sellos estará disponible muy pronto. Vuelve a escanear el QR en unos
          días.
        </p>
      </Screen>
    );
  }

  if (customerId && passData === undefined) return <Loading text="Abriendo tu tarjeta…" />;

  if (customerId && passData) {
    return (
      <main className="rays min-h-[100dvh]">
        <div className="mx-auto max-w-md">
          <LoyaltyCard
            customerId={customerId}
            customerName={passData.customer.name}
            currentStamps={passData.customer.currentStamps}
            totalVisits={passData.customer.totalVisits}
            unlockedRewardIds={passData.customer.unlockedRewardIds ?? []}
            passCode={passData.customer.passCode}
            restaurant={passData.restaurant}
            recovered={recovered}
            walletUrl={walletUrl}
            walletLoading={walletLoading}
            walletError={walletError}
            walletOpened={walletOpened}
            walletSaved={walletSaved}
            onAddWallet={handleAddWallet}
            onConfirmSaved={() => {
              setWalletSaved(true);
              writeFlag(walletSavedKey(customerId));
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="rays min-h-[100dvh]">
      <div className="mx-auto max-w-md space-y-5 px-5 py-6">
        <Steps steps={["Tus datos", "Tu tarjeta", "Wallet"]} current={0} />

        <div className="rise">
          <StampCard restaurant={restaurant} stamps={0} compact />
        </div>
        {restaurant.description && (
          <p className="px-2 text-center text-[1.05rem] leading-snug text-white/90">
            {restaurant.description}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="stock rise rise-2 space-y-4 rounded-[10px] border-2 border-tinta p-5 text-tinta"
        >
          <div>
            <h1 className="lettering text-[1.55rem] leading-[1.1]">Obtén tu tarjeta de sellos</h1>
            <p className="mt-2 text-[1rem] leading-snug text-tinta-soft">
              Sin descargar apps. Si ya tenías tarjeta, usa el mismo correo y la recuperas con tus
              sellos.
            </p>
          </div>

          <div>
            <label htmlFor="join-name" className={fieldLabel}>
              Tu nombre
            </label>
            <input
              id="join-name"
              required
              autoComplete="name"
              placeholder="María"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="join-email" className={fieldLabel}>
              Tu correo
            </label>
            <input
              id="join-email"
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
            <p className={fieldHint}>Solo lo usamos para recuperar tu tarjeta.</p>
          </div>

          <div aria-live="polite" className="empty:hidden">
            {error && (
              <p className="rounded-lg border-2 border-tomate bg-white p-3 text-[0.95rem] font-semibold leading-snug text-tomate-deep">
                {error}
              </p>
            )}
          </div>

          <button disabled={loading} className={`${btnPrimary} w-full`}>
            {loading ? (
              <>
                <span className="spin inline-block h-5 w-5 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Preparando tu tarjeta…
              </>
            ) : (
              "Crear o recuperar mi tarjeta"
            )}
          </button>
          <p className="text-center text-[0.9rem] text-tinta-soft">
            Tu tarjeta se guarda en este dispositivo y puedes añadirla a Google Wallet.
          </p>
        </form>
      </div>
    </main>
  );
}
