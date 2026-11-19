// Sello de calidad: el sello de la tarjeta es un sello festoneado de etiqueta de
// caja. Vacío es un contorno con su número; entintado lleva la estrella.

const SCALLOP = (() => {
  const points: string[] = [];
  for (let deg = 0; deg <= 360; deg += 2) {
    const t = (deg * Math.PI) / 180;
    const r = 43 + 4 * Math.abs(Math.cos(12 * t));
    points.push(`${(50 + r * Math.sin(t)).toFixed(2)},${(50 - r * Math.cos(t)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
})();

const STAR = (() => {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 19 : 8.2;
    const t = (i * Math.PI) / 5;
    points.push(`${(50 + r * Math.sin(t)).toFixed(2)},${(50 - r * Math.cos(t)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
})();

type SealProps = {
  number: number;
  filled: boolean;
  /** Tinta del sello (el color de acento del restaurante). */
  ink: string;
  /** Color que se lee sobre la tinta. */
  onInk: string;
  /** Color del texto de la etiqueta, para el número del sello vacío. */
  text: string;
  reward?: boolean;
  /** El sello acaba de caerse: animación de impresión fuera de registro. */
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
    <span className="relative block aspect-square w-full" role="img" aria-label={`Sello ${number}${reward ? ", premio" : ""}${filled ? ", sellado" : ""}`}>
      {landing && (
        <svg
          viewBox="0 0 100 100"
          className="stamp-ghost absolute inset-0 h-full w-full"
          style={delay}
          aria-hidden="true"
        >
          <path d={SCALLOP} fill="none" stroke={text} strokeWidth="2" />
        </svg>
      )}
      <svg
        viewBox="0 0 100 100"
        className={`${landing ? "stamp-land" : ""} absolute inset-0 h-full w-full`}
        style={delay}
        aria-hidden="true"
      >
        <path
          d={SCALLOP}
          fill={filled ? ink : "none"}
          stroke={ink}
          strokeWidth={filled ? 0 : 3}
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={filled ? onInk : ink}
          strokeWidth="1.6"
          strokeOpacity={filled ? 0.75 : 0.5}
          strokeDasharray={filled ? undefined : "2.5 4"}
        />
        {reward && (
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke={filled ? onInk : ink}
            strokeWidth="1.6"
            strokeOpacity={filled ? 0.75 : 0.6}
          />
        )}
        {filled ? (
          <path d={STAR} fill={onInk} />
        ) : (
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            fill={text}
            fillOpacity="0.9"
            style={{ fontFamily: "var(--f-label)", fontWeight: 700, fontSize: 34 }}
          >
            {number}
          </text>
        )}
      </svg>
    </span>
  );
}
