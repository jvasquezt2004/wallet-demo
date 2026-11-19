// Clases compartidas de controles. Un solo vocabulario de botones e inputs.

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-bold leading-none transition-[background-color,transform,opacity] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0";

/** Acción principal sobre papel o mesa. */
export const btnPrimary = `${base} bg-tomate text-white hover:bg-tomate-deep`;
/** Acción principal sobre fondo ultramarino. */
export const btnCanary = `${base} bg-canario text-tinta hover:bg-[#ffd55c]`;
/** Acción neutra fuerte (Wallet, confirmaciones). */
export const btnInk = `${base} bg-tinta text-white hover:bg-lito-deep`;
/** Acción secundaria con contorno. */
export const btnOutline = `${base} border-2 border-tinta bg-transparent text-tinta hover:bg-tinta/8`;
/** Acción secundaria sobre ultramarino. */
export const btnOutlineLight = `${base} border-2 border-white/80 bg-transparent text-white hover:bg-white/12`;
export const btnSmall = "min-h-10 px-4 text-sm";

export const input =
  "w-full min-h-12 rounded-lg border-2 border-tinta bg-white px-3.5 text-base text-tinta transition-[border-color,box-shadow] placeholder:text-tinta/50 hover:border-lito focus:border-lito focus:outline-none focus:ring-4 focus:ring-lito/20 disabled:opacity-60";

export const fieldLabel = "label-caps mb-1.5 block text-[0.85rem] text-tinta";
export const fieldHint = "mt-1.5 text-sm text-tinta-soft";
