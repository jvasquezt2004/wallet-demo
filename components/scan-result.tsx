import type { ScanResult } from "@/lib/types";

export type { ScanResult };

export function ScanResultView({
  result,
  onReset,
}: {
  result: ScanResult;
  onReset?: () => void;
}) {
  const isDuplicate = result.status === "ALREADY_SCANNED";
  const isReward = result.status === "REWARD_UNLOCKED";

  return (
    <div
      className={`rounded-3xl p-8 text-center shadow-sm ${
        isDuplicate ? "bg-amber-50 text-amber-950" : "bg-emerald-50 text-emerald-950"
      }`}
    >
      <div className="text-5xl">{isDuplicate ? "⚠️" : isReward ? "🎉" : "✅"}</div>
      <h1 className="mt-4 text-2xl font-bold">
        {isDuplicate
          ? "Ya escaneado recientemente"
          : isReward
            ? "¡Recompensa desbloqueada!"
            : "¡Sello sumado!"}
      </h1>
      <p className="mt-2 text-lg font-medium">{result.customerName}</p>

      {!isDuplicate && (
        <>
          {isReward && result.unlockedRewards && result.unlockedRewards.length > 0 && (
            <ul className="mx-auto mt-4 max-w-sm space-y-2 text-left">
              {result.unlockedRewards.map((reward) => (
                <li key={reward.id} className="rounded-xl bg-white/70 px-3 py-2">
                  <p className="text-sm font-semibold">{reward.label}</p>
                  {reward.promoText && (
                    <p className="text-xs opacity-75">{reward.promoText}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-base">
            {result.cycleComplete
              ? "Tarjeta completada — empieza un nuevo ciclo 🎯"
              : `Progreso: ${result.currentStamps} de ${result.stampsRequired} sellos`}
          </p>
        </>
      )}

      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Escanear otro
        </button>
      )}
    </div>
  );
}
