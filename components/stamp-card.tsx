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
  /** Oculta recompensas y progreso (vista previa del registro). */
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
  const panelBg = mix(bg, text, 0.09);
  const hairline = mix(bg, text, 0.16);

  const nextReward = rewards.find(
    (reward) => !unlockedRewardIds.includes(reward.id) && stamps < reward.stampsRequired
  );
  const progress = max > 0 ? (stamps / max) * 100 : 0;

  return (
    <article
      className="relative overflow-hidden rounded-3xl p-5 text-left sm:p-6"
      style={{
        backgroundColor: bg,
        color: text,
        // Un borde claro para que la tarjeta se distinga aunque su fondo se parezca al de la página.
        boxShadow: "0 0 0 1px rgb(255 255 255 / 0.3), var(--shadow-lift)",
      }}
      aria-label={`Tarjeta de sellos de ${restaurant.name}`}
    >
      <header className="flex items-center gap-3.5">
        {restaurant.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.logoUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-2xl bg-white object-contain p-1"
          />
        ) : (
          <span
            className="display flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[1.4rem]"
            style={{ backgroundColor: seal, color: onSeal }}
            aria-hidden="true"
          >
            {restaurant.name.charAt(0).toUpperCase() || "S"}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2
            className="display text-[1.4rem] leading-[1.1]"
            style={{ overflowWrap: "anywhere" }}
          >
            {restaurant.name}
          </h2>
          {(customerName || totalVisits !== undefined) && (
            <p className="mt-0.5 truncate text-[0.95rem]" style={{ color: quiet }}>
              {customerName}
              {customerName && totalVisits !== undefined ? " · " : ""}
              {totalVisits !== undefined && (
                <span className="num">
                  {totalVisits} {totalVisits === 1 ? "visita" : "visitas"}
                </span>
              )}
            </p>
          )}
        </div>
      </header>

      <ol
        className="mx-auto mt-6 grid list-none justify-center gap-x-3 gap-y-3.5 p-0"
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
                  className="mt-1 text-[0.75rem] font-semibold leading-none"
                  style={{ color: accent }}
                >
                  Premio
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {!compact && (
        <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: panelBg }}>
          <p className="display whitespace-nowrap text-[1.5rem] leading-none">
            <span className="num">{stamps}</span>
            <span className="num text-[1rem]" style={{ color: quiet }}>
              {" "}
              de {max} sellos
            </span>
          </p>
          <p className="mt-1.5 text-[0.95rem] font-semibold">
            {nextReward ? (
              <span style={{ color: quiet }}>
                Faltan {nextReward.stampsRequired - stamps} para{" "}
                <span style={{ color: text }}>{nextReward.label}</span>
              </span>
            ) : (
              restaurant.rewardText || "Tarjeta completa"
            )}
          </p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: hairline }}
            role="presentation"
          >
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{ width: `${progress}%`, backgroundColor: seal }}
            />
          </div>
        </div>
      )}

      {!compact && rewards.length > 0 && (
        <ul className="mt-2 list-none p-0">
          {rewards.map((reward, i) => {
            const unlocked =
              unlockedRewardIds.includes(reward.id) || stamps >= reward.stampsRequired;
            return (
              <li
                key={reward.id}
                className="flex items-center gap-3 py-3"
                style={i > 0 ? { borderTop: `1px solid ${hairline}` } : undefined}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.9rem] font-semibold"
                  style={{
                    border: `2px solid ${seal}`,
                    backgroundColor: unlocked ? seal : "transparent",
                    color: unlocked ? onSeal : accent,
                  }}
                >
                  {unlocked ? <CheckIcon size={16} strokeWidth={3} /> : reward.stampsRequired}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-tight">{reward.label}</span>
                  <span className="block text-[0.9rem] leading-snug" style={{ color: quiet }}>
                    {unlocked
                      ? "Desbloqueada. Reclámala en caja."
                      : reward.promoText ||
                        `Te faltan ${Math.max(0, reward.stampsRequired - stamps)} sellos`}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
