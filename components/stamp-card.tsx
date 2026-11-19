import { contrastRatio, mix, readableOn } from "@/lib/color";
import { CheckIcon } from "./icons";
import { Seal } from "./seal";

export type CardRestaurant = {
  name: string;
  logoUrl?: string | null;
  bgColor: string;
  primaryColor: string;
  textColor: string;
  rewardText?: string;
  rewards?: { id: string; label: string; stampsRequired: number; promoText: string }[];
  stampsRequired?: number;
};

type Props = {
  restaurant: CardRestaurant;
  stamps: number;
  customerName?: string;
  totalVisits?: number;
  unlockedRewardIds?: string[];
  /** Sellos ya vistos por el cliente: los siguientes se animan al caer. */
  landingFrom?: number;
  /** Oculta recompensas y placa de progreso (vista previa del registro). */
  compact?: boolean;
};

export function cardMaxStamps(restaurant: CardRestaurant): number {
  // Tope de dibujo: una tarjeta de cientos de sellos no es legible ni útil.
  return Math.min(
    60,
    Math.max(
      1,
      restaurant.stampsRequired ?? 0,
      ...(restaurant.rewards ?? []).map((reward) => reward.stampsRequired)
    )
  );
}

function columnsFor(max: number): number {
  if (max <= 5) return max;
  return [5, 4, 6, 3].find((c) => max % c === 0) ?? 5;
}

export function StampCard({
  restaurant,
  stamps: rawStamps,
  customerName,
  totalVisits,
  unlockedRewardIds = [],
  landingFrom,
  compact = false,
}: Props) {
  const bg = restaurant.bgColor;
  // Los colores son del restaurante: si no contrastan, la tinta se corrige.
  const text = readableOn(bg, restaurant.textColor, 4.5);
  const seal = contrastRatio(bg, restaurant.primaryColor) >= 3 ? restaurant.primaryColor : text;
  const onSeal = readableOn(seal, bg, 4.5);
  // Texto pequeño: el acento y el tono secundario también deben llegar a 4.5:1.
  const accent = readableOn(bg, seal, 4.5);
  const softText = mix(bg, text, 0.78);
  const quiet = contrastRatio(bg, softText) >= 4.5 ? softText : text;
  const rewards = [...(restaurant.rewards ?? [])].sort((a, b) => a.stampsRequired - b.stampsRequired);
  const max = cardMaxStamps(restaurant);
  const stamps = Math.max(0, Math.min(max, rawStamps));
  const cols = columnsFor(max);

  const nextReward = rewards.find(
    (reward) => !unlockedRewardIds.includes(reward.id) && stamps < reward.stampsRequired
  );
  const ribbonShade = mix(seal, "#000000", 0.28);
  const nameSize =
    restaurant.name.length <= 12 ? "1.75rem" : restaurant.name.length <= 20 ? "1.4rem" : "1.15rem";

  return (
    <article
      className="relative isolate overflow-hidden rounded-[10px] px-5 pb-0 pt-7 text-left sm:px-6"
      style={{
        backgroundColor: bg,
        color: text,
        // Margen de papel de la etiqueta: la tarjeta se ve aunque su fondo se parezca al de la página.
        boxShadow: "0 0 0 3px var(--papel)",
      }}
      aria-label={`Tarjeta de sellos de ${restaurant.name}`}
    >
      {/* Rayos de fondo y marco interior: el marco de la etiqueta impresa. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `repeating-conic-gradient(from 0deg at 50% 14%, ${mix(bg, seal, 0.075)} 0deg 6deg, transparent 6deg 12deg)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[7px] -z-10 rounded-[6px] border-[1.5px]"
        style={{ borderColor: mix(bg, seal, 0.6) }}
      />

      {/* Medallón del logo */}
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
        {restaurant.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.logoUrl}
            alt=""
            className="h-16 w-16 rounded-full border-[3px] bg-white object-contain p-1"
            style={{ borderColor: seal }}
          />
        ) : (
          <span
            className="lettering flex h-16 w-16 items-center justify-center rounded-full border-[3px] text-[1.75rem]"
            style={{ backgroundColor: seal, color: onSeal, borderColor: mix(seal, bg, 0.35) }}
            aria-hidden="true"
          >
            {restaurant.name.charAt(0).toUpperCase() || "S"}
          </span>
        )}
      </div>

      {/* Bandera con el nombre */}
      <div className="relative mx-auto mt-3 w-[calc(100%-2.25rem)]">
        <span
          aria-hidden="true"
          className="absolute -left-[22px] top-[9px] h-full w-[34px]"
          style={{
            backgroundColor: ribbonShade,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 32% 50%)",
          }}
        />
        <span
          aria-hidden="true"
          className="absolute -right-[22px] top-[9px] h-full w-[34px]"
          style={{
            backgroundColor: ribbonShade,
            clipPath: "polygon(0 0, 100% 0, 68% 50%, 100% 100%, 0 100%)",
          }}
        />
        <h2
          className="lettering lettering-shadow relative px-4 py-3 text-center"
          style={
            {
              backgroundColor: seal,
              color: onSeal,
              fontSize: nameSize,
              "--lettering-ink": ribbonShade,
              overflowWrap: "anywhere",
            } as React.CSSProperties
          }
        >
          {restaurant.name}
        </h2>
      </div>

      {(customerName || totalVisits !== undefined) && (
        <div
          className="label-caps mt-3 flex items-center justify-between gap-3 text-[0.8rem]"
          style={{ color: quiet }}
        >
          <span className="min-w-0 truncate">{customerName ? `Para ${customerName}` : ""}</span>
          {totalVisits !== undefined && (
            <span className="num shrink-0">
              {totalVisits} {totalVisits === 1 ? "visita" : "visitas"}
            </span>
          )}
        </div>
      )}

      {/* Sellos */}
      <ol
        className="mx-auto mt-4 grid list-none justify-center gap-x-2.5 gap-y-3 p-0"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 4.4rem))` }}
        aria-label={`${stamps} de ${max} sellos`}
      >
        {Array.from({ length: max }).map((_, i) => {
          const number = i + 1;
          const isReward = rewards.some((reward) => reward.stampsRequired === number);
          const filled = number <= stamps;
          const landing = landingFrom !== undefined && filled && number > landingFrom;
          return (
            <li key={number} className="flex flex-col items-center">
              <Seal
                number={number}
                filled={filled}
                ink={seal}
                onInk={onSeal}
                text={text}
                reward={isReward}
                landing={landing}
                delayMs={landing ? (number - landingFrom!) * 160 : 0}
              />
              {isReward && (
                <span
                  className="label-caps mt-1 text-[0.72rem] leading-none"
                  style={{ color: accent }}
                >
                  Premio
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {!compact && rewards.length > 0 && (
        <ul className="mt-5 list-none divide-y p-0" style={{ borderColor: mix(bg, text, 0.2) }}>
          {rewards.map((reward) => {
            const unlocked =
              unlockedRewardIds.includes(reward.id) || stamps >= reward.stampsRequired;
            return (
              <li
                key={reward.id}
                className="flex items-center gap-3 py-2.5"
                style={{ borderColor: mix(bg, text, 0.2) }}
              >
                <span
                  className="label-caps flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[0.95rem]"
                  style={{
                    borderColor: seal,
                    backgroundColor: unlocked ? seal : "transparent",
                    color: unlocked ? onSeal : accent,
                  }}
                >
                  {unlocked ? <CheckIcon size={16} strokeWidth={3} /> : reward.stampsRequired}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-tight">{reward.label}</span>
                  <span className="block text-sm leading-snug" style={{ color: quiet }}>
                    {unlocked
                      ? "Desbloqueada. Reclámala en caja."
                      : reward.promoText ||
                        `Te faltan ${Math.max(0, reward.stampsRequired - stamps)} sellos`}
                  </span>
                </span>
                {!unlocked && (
                  <span className="label-caps num shrink-0 text-[0.85rem]" style={{ color: quiet }}>
                    {reward.stampsRequired} sellos
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Placa de progreso: el papel de la etiqueta al pie. */}
      {!compact && (
        <div
          className="stock -mx-5 mt-5 flex items-center justify-between gap-4 px-5 py-3.5 sm:-mx-6 sm:px-6"
          style={{ color: "var(--tinta)" }}
        >
          <p className="lettering flex items-baseline gap-1 text-[2.1rem] leading-none">
            <span className="num">{stamps}</span>
            <span className="num text-[1.15rem]" style={{ color: "var(--tinta-soft)" }}>
              /{max}
            </span>
            <span className="sr-only"> sellos</span>
          </p>
          <p className="min-w-0 text-right text-[0.95rem] font-semibold leading-tight">
            {nextReward ? (
              <>
                <span className="block" style={{ color: "var(--tinta-soft)" }}>
                  Faltan {nextReward.stampsRequired - stamps}{" "}
                  {nextReward.stampsRequired - stamps === 1 ? "sello" : "sellos"} para
                </span>
                <span className="block truncate">{nextReward.label}</span>
              </>
            ) : (
              <span className="block">{restaurant.rewardText || "Tarjeta completa"}</span>
            )}
          </p>
        </div>
      )}
      {compact && <div className="h-5" />}
    </article>
  );
}
