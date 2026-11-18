export const TEMPLATES = {
  classico: {
    label: "Clásico",
    bgColor: "#1e293b",
    primaryColor: "#facc15",
    textColor: "#ffffff",
  },
  moderno: {
    label: "Moderno",
    bgColor: "#0f172a",
    primaryColor: "#38bdf8",
    textColor: "#f8fafc",
  },
  natural: {
    label: "Natural",
    bgColor: "#14532d",
    primaryColor: "#86efac",
    textColor: "#f0fdf4",
  },
} as const;

export type TemplateKey = keyof typeof TEMPLATES;

export const DEFAULT_FORM = {
  name: "Café de la Esquina",
  slug: "cafe-de-la-esquina",
  template: "classico" as TemplateKey,
  logoUrl: "",
  bgColor: TEMPLATES.classico.bgColor,
  primaryColor: TEMPLATES.classico.primaryColor,
  textColor: TEMPLATES.classico.textColor,
  description: "Tu café de siempre, ahora con recompensas.",
  stampsRequired: 5,
  rewardText: "¡Un café gratis!",
  rewards: [
    {
      id: "reward-1",
      label: "Café gratis",
      stampsRequired: 5,
      promoText: "Un café de cortesía al completar la tarjeta.",
    },
  ],
};
