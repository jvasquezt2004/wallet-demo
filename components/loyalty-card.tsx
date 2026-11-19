"use client";

import { useEffect, useRef, useState } from "react";
import { AlertIcon, CheckIcon, CloseIcon, ExternalIcon, InfoIcon, QrIcon, WalletIcon } from "./icons";
import { QrCode } from "./qr-code";
import { Steps } from "./steps";
import { StampCard, type CardRestaurant } from "./stamp-card";
import { btnCanary, btnInk, btnOutlineLight } from "@/lib/ui";

type Props = {
  customerId: string;
  customerName: string;
  currentStamps: number;
  totalVisits: number;
  unlockedRewardIds?: string[];
  passCode?: string;
  restaurant: CardRestaurant;
  recovered?: boolean;
  walletUrl?: string | null;
  walletLoading?: boolean;
  walletError?: string | null;
  walletOpened?: boolean;
  walletSaved?: boolean;
  onAddWallet?: () => void;
  onConfirmSaved?: () => void;
};

type StampEvent = { from: number; to: number };

function readSeen(customerId: string): number | null {
  try {
    const raw = window.localStorage.getItem(`loyalty-seen:${customerId}`);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function LoyaltyCard({
  customerId,
  customerName,
  currentStamps,
  totalVisits,
  unlockedRewardIds = [],
  passCode,
  restaurant,
  recovered,
  walletUrl,
  walletLoading,
  walletError,
  walletOpened,
  walletSaved,
  onAddWallet,
  onConfirmSaved,
}: Props) {
  const [scanUrl] = useState(() =>
    typeof window === "undefined" ? "" : `${window.location.origin}/scan/${customerId}`
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Momento del sello: si desde la última vez que se abrió la tarjeta hay sellos
  // nuevos (los puso el personal), caen con la animación y se anuncian.
  const [prevStamps, setPrevStamps] = useState<number>(() => {
    const seen = readSeen(customerId);
    return seen !== null && seen <= currentStamps ? seen : currentStamps;
  });
  const [event, setEvent] = useState<StampEvent | null>(() =>
    prevStamps < currentStamps ? { from: prevStamps, to: currentStamps } : null
  );
  if (currentStamps !== prevStamps) {
    setPrevStamps(currentStamps);
    setEvent(currentStamps > prevStamps ? { from: prevStamps, to: currentStamps } : null);
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(`loyalty-seen:${customerId}`, String(currentStamps));
    } catch {
      // Sin almacenamiento la tarjeta funciona igual; solo no recuerda lo visto.
    }
  }, [customerId, currentStamps]);

  useEffect(() => {
    if (!event) return;
    const timer = window.setTimeout(() => setEvent(null), 9000);
    return () => window.clearTimeout(timer);
  }, [event]);

  const rewards = restaurant.rewards ?? [];
  const newlyUnlocked = event
    ? rewards.filter((r) => r.stampsRequired > event.from && r.stampsRequired <= event.to)
    : [];

  const max = Math.max(
    1,
    restaurant.stampsRequired ?? 0,
    ...rewards.map((reward) => reward.stampsRequired)
  );
  const stamps = Math.max(0, Math.min(max, currentStamps));
  const code = passCode ? `${passCode.slice(0, 4)} ${passCode.slice(4)}`.trim() : "";

  const openQr = () => dialogRef.current?.showModal();
  const closeQr = () => dialogRef.current?.close();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="space-y-5 px-5 pb-6 pt-6">
        <Steps
          steps={["Tus datos", "Tu tarjeta", "Wallet"]}
          current={walletSaved ? 3 : 2}
        />

        <div aria-live="polite" className="space-y-3 empty:hidden">
          {event && (
            <div className="rise flex items-start gap-3 rounded-lg bg-canario p-3.5 text-tinta">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tinta text-canario">
                <CheckIcon size={14} strokeWidth={3} />
              </span>
              <p className="text-[0.95rem] font-semibold leading-snug">
                {newlyUnlocked.length > 0
                  ? `¡Premio desbloqueado: ${newlyUnlocked.map((r) => r.label).join(", ")}! Muestra esta pantalla en caja.`
                  : `¡Nuevo sello! Llevas ${stamps} de ${max}.`}
              </p>
            </div>
          )}
          {recovered && !event && (
            <div className="flex items-start gap-3 rounded-lg bg-hoja-soft p-3.5 text-tinta">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hoja text-white">
                <CheckIcon size={14} strokeWidth={3} />
              </span>
              <p className="text-[0.95rem] font-semibold leading-snug">
                Recuperamos tu tarjeta con tus sellos intactos.
              </p>
            </div>
          )}
        </div>

        <div className="rise">
          <StampCard
            restaurant={restaurant}
            stamps={stamps}
            customerName={customerName}
            totalVisits={totalVisits}
            unlockedRewardIds={unlockedRewardIds}
            landingFrom={event?.from}
          />
        </div>

        <details className="group text-white/90">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-[0.95rem] font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
            <InfoIcon size={18} />
            ¿Cómo funciona?
          </summary>
          <ul className="mt-1 list-disc space-y-1.5 pl-9 text-[0.95rem] leading-snug text-white/85">
            <li>Muestra el QR en caja con cada visita. Cada día suma un sello como máximo.</li>
            <li>Con Google Wallet tu tarjeta queda siempre a mano; sin Wallet, esta página también sirve.</li>
            <li>
              Si Wallet dice «Something went wrong», es una limitación del modo demo: solo cuentas
              de prueba autorizadas pueden guardar el pase.
            </li>
          </ul>
        </details>
      </div>

      {/* Dock: Wallet es la acción principal, el QR es la alternativa inmediata. */}
      <div className="sticky bottom-0 mt-auto border-t border-white/15 bg-lito px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div aria-live="polite" className="empty:hidden">
          {walletError && (
            <p className="mb-3 flex items-start gap-2 rounded-lg bg-aviso-soft p-3 text-[0.95rem] leading-snug text-tinta">
              <AlertIcon size={18} className="mt-0.5 shrink-0 text-aviso" />
              <span>{walletError}</span>
            </p>
          )}
          {walletOpened && !walletSaved && !walletLoading && !walletError && (
            <div className="mb-3 flex items-center justify-between gap-3 text-[0.95rem] text-white">
              <span className="font-semibold">¿Ya la guardaste en Wallet?</span>
              <button
                type="button"
                onClick={onConfirmSaved}
                className="min-h-11 rounded-lg px-3 font-bold text-canario underline underline-offset-4 hover:bg-white/10"
              >
                Sí, ya la guardé
              </button>
            </div>
          )}
          {walletLoading && !walletError && (
            <p className="mb-2 text-center text-[0.95rem] font-semibold text-white">
              Preparando tu pase de Google Wallet…
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {walletUrl ? (
            <a href={walletUrl} className={`${btnCanary} flex-1`}>
              <ExternalIcon size={20} />
              Abrir en Google Wallet
            </a>
          ) : (
            <button
              type="button"
              onClick={onAddWallet}
              disabled={walletLoading}
              className={`${btnInk} flex-1 ${walletSaved ? "" : "ring-2 ring-white/70"}`}
            >
              {walletLoading ? (
                <span className="spin inline-block h-5 w-5 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
              ) : (
                <WalletIcon size={20} />
              )}
              {walletSaved ? "Abrir mi pase de Wallet" : walletOpened ? "Abrir Wallet otra vez" : "Agregar a Google Wallet"}
            </button>
          )}
          <button
            type="button"
            onClick={openQr}
            aria-label="Mostrar QR en caja"
            className={`${btnOutlineLight} shrink-0 px-4`}
          >
            <QrIcon size={22} />
            <span className="hidden sm:inline">Mostrar QR</span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeQr();
        }}
        aria-labelledby="qr-title"
        className="m-auto w-[min(92vw,26rem)] rounded-[10px] border-0 bg-transparent p-0 text-tinta backdrop:bg-tinta/85"
      >
        <div className="stock relative rounded-[10px] border-2 border-tinta p-6 text-center">
          <button
            type="button"
            onClick={closeQr}
            className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-lg text-tinta hover:bg-tinta/10"
            aria-label="Cerrar"
          >
            <CloseIcon size={22} />
          </button>
          <h2 id="qr-title" className="lettering px-8 text-[1.5rem]">
            Muestra este QR en caja
          </h2>
          <p className="mt-2 text-[0.95rem] text-tinta-soft">
            {customerName}, sube el brillo de la pantalla para que lo lean más rápido.
          </p>
          <div className="mt-4 flex justify-center">
            <QrCode value={scanUrl} size={240} label={`QR de la tarjeta de ${customerName}`} />
          </div>
          {code && (
            <p className="mt-4">
              <span className="label-caps block text-[0.85rem] text-tinta-soft">
                ¿No lee el QR? Dicta este código
              </span>
              <span className="lettering num mt-1 block text-[1.9rem] tracking-[0.08em]">{code}</span>
            </p>
          )}
        </div>
      </dialog>
    </div>
  );
}
