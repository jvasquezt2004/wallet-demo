// Sello de la tarjeta: un círculo que se entinta. Vacío es un contorno con su
// número; sellado lleva una marca de verificación.

type SealProps = {
  number: number;
  filled: boolean;
  /** Tinta del sello (el color de acento del restaurante). */
  ink: string;
  /** Color que se lee sobre la tinta. */
  onInk: string;
  /** Color del texto de la tarjeta, para el número del sello vacío. */
  text: string;
  reward?: boolean;
  /** El sello acaba de caer: animación de impresión fuera de registro. */
  landing?: boolean;
  delayMs?: number;
};

export function Seal({
  number,
  filled,
  ink,
  onInk,
  text,
  reward = false,
  landing = false,
  delayMs = 0,
}: SealProps) {
  const delay = { animationDelay: `${delayMs}ms` };
  return (
    <span
      className="relative block aspect-square w-full"
      role="img"
      aria-label={`Sello ${number}${reward ? ", premio" : ""}${filled ? ", sellado" : ""}`}
    >
      {landing && (
        <svg
          viewBox="0 0 100 100"
          className="stamp-ghost absolute inset-0 h-full w-full"
          style={delay}
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="42" fill="none" stroke={text} strokeWidth="2" />
        </svg>
      )}
      <svg
        viewBox="0 0 100 100"
        className={`${landing ? "stamp-land" : ""} absolute inset-0 h-full w-full`}
        style={delay}
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={reward ? 38 : 42}
          fill={filled ? ink : "none"}
          stroke={ink}
          strokeWidth={filled ? 0 : 3}
          strokeOpacity={filled ? 1 : 0.55}
        />
        {reward && (
          <circle cx="50" cy="50" r="47" fill="none" stroke={ink} strokeWidth="2.5" />
        )}
        {filled ? (
          <path
            d="M33 51l12 12 22-26"
            fill="none"
            stroke={onInk}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            fill={text}
            fillOpacity="0.85"
            style={{ fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 30 }}
          >
            {number}
          </text>
        )}
      </svg>
    </span>
  );
}
