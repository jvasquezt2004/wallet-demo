"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { ScanResult } from "@/lib/types";
import { AlertIcon, ArrowIcon, CheckIcon, GiftIcon } from "./icons";
import { Seal } from "./seal";
import { btnInk, btnOutline } from "@/lib/ui";

export type { ScanResult };

const AUTO_CONTINUE_MS = 3800;

export function ScanResultView({
  result,
  onReset,
}: {
  result: ScanResult;
  /** Vuelve a dejar el escáner listo. Sin esto se ofrece ir a /scan. */
  onReset?: () => void;
}) {
  const isDuplicate = result.status === "ALREADY_SCANNED";
  const isReward = result.status === "REWARD_UNLOCKED";
  // Un sello normal o un duplicado avanzan solos; una recompensa espera al personal.
  const autoContinue = Boolean(onReset) && !isReward;

  const resetRef = useRef(onReset);
  useEffect(() => {
    resetRef.current = onReset;
  }, [onReset]);

  useEffect(() => {
    if (!autoContinue) return;
    const timer = window.setTimeout(() => resetRef.current?.(), AUTO_CONTINUE_MS);
    return () => window.clearTimeout(timer);
  }, [autoContinue]);

  const tone = isDuplicate
    ? "bg-aviso-soft text-tinta"
    : isReward
      ? "bg-canario text-tinta"
      : "bg-hoja text-white";

  const stamped = !isDuplicate ? result : null;
  const stampsRequired = stamped ? stamped.stampsRequired : 0;
  const current = stamped ? stamped.currentStamps : 0;

  return (
    <section
      role="status"
      className={`rise relative overflow-hidden rounded-[10px] border-2 border-tinta px-5 pb-5 pt-7 text-center ${tone}`}
    >
      <span
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 ${
          isDuplicate ? "border-tinta bg-white text-aviso" : "border-tinta bg-white text-tinta"
        }`}
      >
        {isDuplicate ? (
          <AlertIcon size={28} />
        ) : isReward ? (
          <GiftIcon size={28} />
        ) : (
          <CheckIcon size={28} strokeWidth={3} className="text-hoja" />
        )}
      </span>

      <h2 className="lettering mt-4 text-[1.7rem] leading-[1.1]">
        {isDuplicate
          ? "Ya sumó un sello hoy"
          : isReward
            ? "¡Recompensa desbloqueada!"
            : "¡Sello sumado!"}
      </h2>
      <p className="mt-2 text-[1.35rem] font-bold leading-tight">{result.customerName}</p>

      {isDuplicate && (
        <p className="mx-auto mt-2 max-w-xs text-[1rem] leading-snug">
          Solo se cuenta una visita por día. No se ha sumado nada nuevo.
        </p>
      )}

      {stamped && (
        <>
          {isReward && stamped.unlockedRewards.length > 0 && (
            <ul className="mx-auto mt-4 max-w-sm list-none space-y-2 p-0 text-left">
              {stamped.unlockedRewards.map((reward) => (
                <li key={reward.id} className="rounded-lg border-2 border-tinta bg-white px-3.5 py-2.5">
                  <p className="text-[1.05rem] font-bold leading-tight">{reward.label}</p>
                  {reward.promoText && (
                    <p className="mt-0.5 text-[0.95rem] leading-snug text-tinta-soft">
                      {reward.promoText}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {stampsRequired > 0 && stampsRequired <= 24 && (
            <div
              className="mx-auto mt-5 flex max-w-xs flex-wrap justify-center gap-1.5"
              aria-hidden="true"
            >
              {Array.from({ length: stampsRequired }).map((_, i) => (
                <span key={i} className="block w-9">
                  <Seal
                    number={i + 1}
                    filled={i < current}
                    ink={isReward ? "#10143a" : "#ffc72c"}
                    onInk={isReward ? "#ffc72c" : "#10143a"}
                    text={isReward ? "#10143a" : "#ffffff"}
                    landing={i === current - 1}
                  />
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-[1.1rem] font-semibold">
            {stamped.cycleComplete
              ? "Tarjeta completada: empieza un nuevo ciclo."
              : `Lleva ${current} de ${stampsRequired} sellos.`}
          </p>
        </>
      )}

      <div className="mt-6">
        {onReset ? (
          <button type="button" onClick={onReset} className={`${btnInk} w-full`}>
            {isReward ? "Entregado, siguiente cliente" : "Siguiente cliente"}
            <ArrowIcon size={20} />
          </button>
        ) : (
          <Link href="/scan" className={`${btnOutline} w-full bg-white/70`}>
            Escanear a otro cliente
          </Link>
        )}
        {autoContinue && (
          <div className="mx-auto mt-3 h-1.5 w-full overflow-hidden rounded-full bg-tinta/20" aria-hidden="true">
            <div
              className="drain h-full w-full rounded-full bg-tinta/70"
              style={{ ["--drain-ms" as string]: `${AUTO_CONTINUE_MS}ms` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
