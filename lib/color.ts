// Utilidades de color para la tarjeta: los colores los elige cada restaurante,
// así que la interfaz comprueba el contraste en vez de fiarse de ellos.

function parseHex(value: string): [number, number, number] | null {
  const hex = value.trim().replace(/^#/, "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function luminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Relación de contraste WCAG entre dos colores hex; 1 si alguno no es válido. */
export function contrastRatio(a: string, b: string): number {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return 1;
  const la = luminance(ca);
  const lb = luminance(cb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Tinta que se lee sobre `bg`: el color pedido si contrasta, si no negro o blanco. */
export function readableOn(bg: string, preferred: string, min = 4.5): string {
  if (contrastRatio(bg, preferred) >= min) return preferred;
  return contrastRatio(bg, "#10143a") >= contrastRatio(bg, "#ffffff") ? "#10143a" : "#ffffff";
}

/** Mezcla `fg` sobre `bg` (0..1) para obtener tonos secundarios sin usar grises. */
export function mix(bg: string, fg: string, amount: number): string {
  const cb = parseHex(bg);
  const cf = parseHex(fg);
  if (!cb || !cf) return fg;
  const out = cb.map((v, i) => Math.round(v + (cf[i] - v) * amount));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
