// Clases compartidas de controles. Un solo vocabulario de botones e inputs.

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold leading-none transition-[background-color,transform,opacity] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100";

/** Acción principal sobre blanco o mesa. */
export const btnPrimary = `${base} bg-tomate text-white hover:bg-tomate-deep`;
/** Acción principal sobre fondo ultramarino. */
export const btnCanary = `${base} bg-canario text-tinta hover:bg-[#ffd55c]`;
/** Acción neutra fuerte (Wallet, confirmaciones). */
export const btnInk = `${base} bg-tinta text-white hover:bg-lito-deep`;
/** Acción secundaria con contorno. */
export const btnOutline = `${base} border border-tinta/25 bg-white text-tinta hover:border-tinta/50 hover:bg-mesa`;
/** Acción secundaria sobre ultramarino. */
export const btnOutlineLight = `${base} border border-white/35 bg-white/10 text-white hover:bg-white/18`;
export const btnSmall = "min-h-10 px-4 text-sm";

export const input =
  "w-full min-h-12 rounded-xl border border-tinta/25 bg-white px-3.5 text-base text-tinta transition-[border-color,box-shadow] placeholder:text-tinta/45 hover:border-tinta/45 focus:border-lito focus:outline-none focus:ring-4 focus:ring-lito/15 disabled:opacity-60";

export const fieldLabel = "mb-1.5 block text-sm font-semibold text-tinta";
export const fieldHint = "mt-1.5 text-sm text-tinta-soft";
