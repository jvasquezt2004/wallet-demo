"use client";

import { useState } from "react";
import { QrCode } from "./qr-code";

type Restaurant = {
  name: string;
  slug: string;
  logoUrl: string;
  bgColor: string;
  primaryColor: string;
  textColor: string;
  description?: string | null;
  stampsRequired: number;
  rewardText: string;
  rewards?: {
    id: string;
    label: string;
    stampsRequired: number;
    promoText: string;
  }[];
};

type Props = {
  customerId: string;
  customerName: string;
  currentStamps: number;
  totalVisits: number;
  unlockedRewardIds?: string[];
  restaurant: Restaurant;
  recovered?: boolean;
  walletUrl?: string | null;
  walletLoading?: boolean;
  walletError?: string | null;
  onAddWallet?: () => void;
};

export function LoyaltyCard({
  customerId,
  customerName,
  currentStamps,
  totalVisits,
  unlockedRewardIds = [],
  restaurant,
  recovered,
  walletUrl,
  walletLoading,
  walletError,
  onAddWallet,
}: Props) {
  const [scanUrl] = useState(() =>
    typeof window === "undefined" ? "" : `${window.location.origin}/scan/${customerId}`
  );

  const maxStamps = Math.max(
    restaurant.stampsRequired,
    ...(restaurant.rewards ?? []).map((reward) => reward.stampsRequired)
  );
  const stamps = Math.max(0, Math.min(maxStamps, currentStamps));

  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden rounded-3xl p-6 shadow-lg sm:p-8"
        style={{ backgroundColor: restaurant.bgColor, color: restaurant.textColor }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest opacity-70">
              Tarjeta de sellos
            </p>
            <h2 className="mt-1 text-2xl font-bold">{restaurant.name}</h2>
          </div>
          {restaurant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logoUrl}
              alt=""
              className="h-14 w-14 rounded-2xl bg-white/90 object-contain p-1"
            />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
              style={{ backgroundColor: restaurant.primaryColor, color: restaurant.bgColor }}
            >
              {restaurant.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <p className="mt-6 text-sm opacity-80">Hola, {customerName} 👋</p>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
          {Array.from({ length: maxStamps }).map((_, i) => {
            const stamp = i + 1;
            const rewardsAtStamp = (restaurant.rewards ?? []).filter(
              (reward) => reward.stampsRequired === stamp
            );
            const isThreshold = rewardsAtStamp.length > 0;
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-all"
                  style={{
                    borderColor: restaurant.primaryColor,
                    backgroundColor: i < stamps ? restaurant.primaryColor : "transparent",
                    color: i < stamps ? restaurant.bgColor : restaurant.primaryColor,
                  }}
                >
                  {i < stamps ? "★" : stamp}
                  {isThreshold && (
                    <span
                      className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2"
                      style={{
                        backgroundColor: restaurant.primaryColor,
                        borderColor: restaurant.bgColor,
                      }}
                    />
                  )}
                </div>
                {isThreshold && (
                  <span
                    className="mt-1 text-[9px] font-bold uppercase tracking-wide"
                    style={{ color: restaurant.primaryColor }}
                  >
                    Premio
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {restaurant.rewards && restaurant.rewards.length > 0 && (
          <div className="mt-5 rounded-xl bg-white/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Recompensas</p>
            <ul className="mt-2 space-y-1.5">
              {restaurant.rewards.map((reward) => {
                const unlocked =
                  unlockedRewardIds.includes(reward.id) || stamps >= reward.stampsRequired;
                return (
                  <li key={reward.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0">
                      {reward.label}
                      <span className="block text-xs opacity-70">
                        {unlocked
                          ? "¡Desbloqueada! Reclámala en caja"
                          : reward.promoText ||
                            `Te faltan ${Math.max(0, reward.stampsRequired - stamps)} sellos`}
                      </span>
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: unlocked ? restaurant.primaryColor : "transparent",
                        color: unlocked ? restaurant.bgColor : restaurant.textColor,
                      }}
                    >
                      {unlocked ? "✓" : reward.stampsRequired} {unlocked ? "" : "sellos"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
          <div>
            <p className="text-3xl font-bold">
              {stamps}
              <span className="text-lg font-medium opacity-70">/{maxStamps}</span>
            </p>
            <p className="text-xs opacity-70">sellos acumulados</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: restaurant.primaryColor }}>
              {restaurant.rewardText}
            </p>
            <p className="mt-1 text-xs opacity-70">{totalVisits} visitas</p>
          </div>
        </div>
      </div>

      {recovered && (
        <p className="rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800">
          Recuperamos tu tarjeta con tus sellos intactos.
        </p>
      )}

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
        <h3 className="font-semibold">Muestra este QR en la caja</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Cada visita suma un sello. También puedes guardarlo en tu Wallet.
        </p>
        <div className="mt-5 flex justify-center">
          <QrCode value={scanUrl} />
        </div>
        {scanUrl && <p className="mt-3 break-all text-xs text-neutral-400">{scanUrl}</p>}

        {walletUrl ? (
          <a
            href={walletUrl}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
          >
            Agregar a Google Wallet →
          </a>
        ) : (
          <button
            type="button"
            onClick={onAddWallet}
            disabled={walletLoading}
            className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {walletLoading ? "Generando pase..." : "Agregar a Google Wallet"}
          </button>
        )}
        {walletError && <p className="mt-3 text-xs text-amber-700">{walletError}</p>}
        <p className="mt-4 text-[11px] leading-relaxed text-neutral-400">
          Google Wallet solo emite pases en modo demo a cuentas con rol Admin/Developer en el
          issuer. Si ves «Something went wrong», revisa la cuenta de Google del dispositivo.
        </p>
      </div>
    </div>
  );
}
