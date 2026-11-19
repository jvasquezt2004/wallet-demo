import { CheckIcon } from "./icons";

// Recorrido del cliente: la secuencia sí lleva información (qué falta por hacer).
export function Steps({
  steps,
  current,
}: {
  steps: string[];
  /** Índice (0-based) del paso activo; los anteriores se marcan hechos. */
  current: number;
}) {
  return (
    <ol className="flex items-start gap-2 p-0" aria-label="Progreso">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center"
          >
            <span className="relative flex w-full items-center justify-center">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute right-1/2 top-1/2 h-0.5 w-full -translate-y-1/2 ${
                    i <= current ? "bg-canario" : "bg-white/30"
                  }`}
                />
              )}
              <span
                className={`label-caps relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-[0.95rem] ${
                  done
                    ? "border-canario bg-canario text-tinta"
                    : active
                      ? "border-canario bg-lito text-canario"
                      : "border-white/40 bg-lito text-white/75"
                }`}
              >
                {done ? <CheckIcon size={16} strokeWidth={3} /> : i + 1}
              </span>
            </span>
            <span
              className={`label-caps text-[0.82rem] leading-tight ${
                active ? "text-white" : done ? "text-white/90" : "text-white/75"
              }`}
            >
              {label}
              {done && <span className="sr-only"> (hecho)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
