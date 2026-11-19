"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { QrCode } from "@/components/qr-code";
import { SiteNav } from "@/components/site-nav";
import { StampCard } from "@/components/stamp-card";
import {
  AlertIcon,
  CheckIcon,
  CopyIcon,
  ExternalIcon,
  PlusIcon,
  RefreshIcon,
} from "@/components/icons";
import { DEFAULT_FORM, TEMPLATES, type TemplateKey } from "@/lib/branding";
import { patchJson, postJson } from "@/lib/api";
import { contrastRatio } from "@/lib/color";
import { btnInk, btnOutline, btnPrimary, btnSmall, fieldHint, fieldLabel, input } from "@/lib/ui";
import type { RestaurantDTO, Reward } from "@/lib/types";

type FormState = {
  name: string;
  slug: string;
  template: TemplateKey;
  logoUrl: string;
  bgColor: string;
  primaryColor: string;
  textColor: string;
  description: string;
  stampsRequired: number;
  rewardText: string;
  rewards: Reward[];
};

type Feedback = { tone: "ok" | "error"; text: string };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const panel = "rounded-[10px] border border-tinta/20 bg-white p-5 sm:p-6";
const sectionTitle = "lettering text-[1.35rem] leading-tight";

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} (selector)`}
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-12 shrink-0 rounded-lg"
        />
        <input
          id={id}
          className={`${input} num uppercase`}
          value={value}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const {
    data: restaurant,
    error: loadError,
    mutate: mutateRestaurant,
  } = useSWR<RestaurantDTO | null>("/api/restaurants");

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [published, setPublishedState] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewStamps, setPreviewStamps] = useState(3);
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin
  );

  const initialized = useRef(false);
  const slugTouched = useRef(false);

  useEffect(() => {
    if (!restaurant || initialized.current) return;
    initialized.current = true;
    setRestaurantId(restaurant.id);
    setPublishedState(restaurant.published);
    const loaded: FormState = {
      name: restaurant.name,
      slug: restaurant.slug,
      template: (restaurant.template as TemplateKey) ?? "classico",
      logoUrl: restaurant.logoUrl ?? "",
      bgColor: restaurant.bgColor,
      primaryColor: restaurant.primaryColor,
      textColor: restaurant.textColor,
      description: restaurant.description ?? "",
      stampsRequired: restaurant.stampsRequired,
      rewardText: restaurant.rewardText,
      rewards: restaurant.rewards?.length ? restaurant.rewards : DEFAULT_FORM.rewards,
    };
    setForm(loaded);
    setSavedJson(JSON.stringify(loaded));
  }, [restaurant]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const applyTemplate = (key: TemplateKey) => {
    const t = TEMPLATES[key];
    setForm((prev) => ({
      ...prev,
      template: key,
      bgColor: t.bgColor,
      primaryColor: t.primaryColor,
      textColor: t.textColor,
    }));
  };

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const saved = await postJson<RestaurantDTO>("/api/restaurants", {
        id: restaurantId ?? undefined,
        name: form.name,
        slug: form.slug,
        template: form.template,
        logoUrl: form.logoUrl,
        bgColor: form.bgColor,
        primaryColor: form.primaryColor,
        textColor: form.textColor,
        description: form.description || undefined,
        rewards: form.rewards,
      });
      setRestaurantId(saved.id);
      setSavedJson(JSON.stringify(form));
      await mutateRestaurant(saved, { revalidate: false });
      setFeedback({ tone: "ok", text: "Cambios guardados." });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "No se pudo guardar.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(next: boolean) {
    if (!restaurantId) {
      setFeedback({ tone: "error", text: "Guarda primero el restaurante." });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await patchJson<RestaurantDTO>(
        `/api/restaurants/${form.slug}/publish`,
        { published: next }
      );
      await mutateRestaurant(updated, { revalidate: false });
      setPublishedState(next);
      setFeedback({
        tone: "ok",
        text: next ? "Tarjeta publicada. Ya puedes compartir el QR." : "Tarjeta despublicada.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "No se pudo cambiar la publicación.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFeedback({ tone: "error", text: "No se pudo copiar. Selecciona el enlace y cópialo a mano." });
    }
  }

  const joinUrl = origin ? `${origin}/c/${form.slug}` : "";
  const dirty = savedJson !== null ? JSON.stringify(form) !== savedJson : false;
  const previewMax = Math.max(1, form.stampsRequired, ...form.rewards.map((r) => r.stampsRequired));
  const shownStamps = Math.min(previewStamps, previewMax);

  const textContrast = contrastRatio(form.bgColor, form.textColor);
  const accentContrast = contrastRatio(form.bgColor, form.primaryColor);

  const updateReward = (index: number, patch: Partial<Reward>) =>
    setForm((prev) => ({
      ...prev,
      rewards: prev.rewards.map((reward, i) => (i === index ? { ...reward, ...patch } : reward)),
    }));

  return (
    <div className="on-mesa min-h-screen bg-mesa">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-7 sm:px-8 lg:pb-10">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h1 className="lettering text-[2rem] sm:text-[2.4rem]">Tu tarjeta de sellos</h1>
            <p className="mt-2 max-w-xl text-[1.05rem] text-tinta-soft">
              Pon tu marca, define los premios y publícala.{" "}
              <span className="hidden lg:inline">Lo que ves a la derecha es lo que verá el cliente.</span>
              <a href="#sec-preview" className="font-bold text-lito underline lg:hidden">
                Ver cómo queda la tarjeta
              </a>
            </p>
          </div>
          {restaurant !== undefined && !loadError && (
            <p
              className={`label-caps inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-[0.95rem] ${
                published
                  ? "border-hoja bg-hoja-soft text-hoja"
                  : "border-tinta/40 bg-white text-tinta-soft"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${published ? "bg-hoja" : "bg-tinta/40"}`}
              />
              {published ? "Publicada" : "Borrador"}
            </p>
          )}
        </div>

        {loadError ? (
          <div role="alert" className="mt-8 rounded-[10px] border-2 border-tomate bg-white p-6">
            <h2 className="lettering text-[1.35rem] text-tomate-deep">
              No se pudo cargar el restaurante
            </h2>
            <p className="mt-2 text-[1rem] font-semibold">{loadError.message}</p>
            <p className="mt-2 text-[0.95rem] text-tinta-soft">
              Revisa que <code className="rounded bg-mesa px-1.5 py-0.5">DATABASE_URL</code> esté
              configurada y que las tablas existan (
              <code className="rounded bg-mesa px-1.5 py-0.5">pnpm db:push</code>).
            </p>
            <button onClick={() => mutateRestaurant()} className={`${btnPrimary} mt-5`}>
              <RefreshIcon size={18} />
              Reintentar
            </button>
          </div>
        ) : restaurant === undefined ? (
          <p role="status" className="mt-10 flex items-center gap-3 text-lg font-semibold text-tinta-soft">
            <span className="spin inline-block h-6 w-6 rounded-full border-[3px] border-tinta/20 border-t-lito" aria-hidden="true" />
            Cargando tu tarjeta…
          </p>
        ) : (
          <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <div className="space-y-6">
              <section className={`${panel} space-y-5`} aria-labelledby="sec-marca">
                <h2 id="sec-marca" className={sectionTitle}>
                  Marca y colores
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-name" className={fieldLabel}>
                      Nombre del restaurante
                    </label>
                    <input
                      id="f-name"
                      className={input}
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          name,
                          slug: slugTouched.current ? prev.slug : slugify(name),
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="f-slug" className={fieldLabel}>
                      Dirección del enlace
                    </label>
                    <input
                      id="f-slug"
                      className={input}
                      value={form.slug}
                      onChange={(e) => {
                        slugTouched.current = true;
                        update("slug", slugify(e.target.value));
                      }}
                    />
                    <p className={`${fieldHint} break-all`}>
                      {origin ? origin.replace(/^https?:\/\//, "") : ""}/c/{form.slug || "…"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-desc" className={fieldLabel}>
                      Descripción
                    </label>
                    <textarea
                      id="f-desc"
                      rows={2}
                      className={`${input} resize-y py-2.5 leading-snug`}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="f-logo" className={fieldLabel}>
                      Logo (enlace a la imagen)
                    </label>
                    <input
                      id="f-logo"
                      className={input}
                      inputMode="url"
                      placeholder="https://…/logo.png"
                      value={form.logoUrl}
                      onChange={(e) => update("logoUrl", e.target.value)}
                    />
                  </div>
                </div>

                <fieldset>
                  <legend className={fieldLabel}>Plantilla de colores</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => {
                      const t = TEMPLATES[key];
                      const selected = form.template === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => applyTemplate(key)}
                          className={`flex min-h-12 items-center gap-3 rounded-lg border-2 px-3.5 text-[1rem] font-bold transition-colors ${
                            selected
                              ? "border-tinta bg-tinta text-white"
                              : "border-tinta/30 bg-white hover:border-tinta"
                          }`}
                        >
                          <span className="flex" aria-hidden="true">
                            {[t.bgColor, t.primaryColor, t.textColor].map((c, i) => (
                              <span
                                key={i}
                                className="-ml-1.5 h-5 w-5 rounded-full border-2 border-white first:ml-0"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </span>
                          {t.label}
                          {selected && <CheckIcon size={16} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-3">
                  <ColorField
                    id="f-bg"
                    label="Fondo"
                    value={form.bgColor}
                    onChange={(v) => update("bgColor", v)}
                  />
                  <ColorField
                    id="f-primary"
                    label="Sello y acento"
                    value={form.primaryColor}
                    onChange={(v) => update("primaryColor", v)}
                  />
                  <ColorField
                    id="f-text"
                    label="Texto"
                    value={form.textColor}
                    onChange={(v) => update("textColor", v)}
                  />
                </div>

                {(textContrast < 4.5 || accentContrast < 3) && (
                  <p
                    role="status"
                    className="flex items-start gap-2.5 rounded-lg bg-aviso-soft p-3.5 text-[0.95rem] leading-snug"
                  >
                    <AlertIcon size={20} className="mt-0.5 shrink-0 text-aviso" />
                    <span>
                      {textContrast < 4.5
                        ? "El texto apenas se lee sobre ese fondo. "
                        : "El sello se confunde con el fondo. "}
                      En la tarjeta del cliente ajustamos la tinta solos para que se lea, pero
                      conviene elegir colores con más contraste.
                    </span>
                  </p>
                )}
              </section>

              <section className={`${panel} space-y-4`} aria-labelledby="sec-premios">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="sec-premios" className={sectionTitle}>
                    Sellos y recompensas
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        rewards: [
                          ...prev.rewards,
                          {
                            id: `reward-${Date.now()}`,
                            label: "Nueva recompensa",
                            stampsRequired: prev.stampsRequired,
                            promoText: "",
                          },
                        ],
                      }))
                    }
                    className={`${btnOutline} ${btnSmall}`}
                  >
                    <PlusIcon size={18} />
                    Añadir recompensa
                  </button>
                </div>

                <p className="text-[1rem] leading-snug text-tinta-soft">
                  Cada recompensa se desbloquea al llegar a su número de sellos. La tarjeta se
                  reinicia al completar la más alta.
                </p>

                {form.rewards.length === 0 ? (
                  <p className="rounded-lg border-2 border-dashed border-tinta/30 p-4 text-[1rem] text-tinta-soft">
                    Aún no hay recompensas. Añade la primera para que los clientes tengan un premio
                    al que llegar.
                  </p>
                ) : (
                  <ul className="list-none space-y-3 p-0">
                    {form.rewards.map((reward, index) => (
                      <li
                        key={reward.id}
                        className="grid gap-3 rounded-lg border border-tinta/20 bg-mesa p-3 sm:grid-cols-[minmax(0,1fr)_6.5rem_minmax(0,1.4fr)_auto] sm:items-end"
                      >
                        <div>
                          <label htmlFor={`r-label-${index}`} className={fieldLabel}>
                            Recompensa
                          </label>
                          <input
                            id={`r-label-${index}`}
                            className={input}
                            value={reward.label}
                            onChange={(e) => updateReward(index, { label: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor={`r-stamps-${index}`} className={fieldLabel}>
                            Sellos
                          </label>
                          <input
                            id={`r-stamps-${index}`}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            className={`${input} num`}
                            value={reward.stampsRequired}
                            onChange={(e) =>
                              updateReward(index, { stampsRequired: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <label htmlFor={`r-msg-${index}`} className={fieldLabel}>
                            Mensaje al cliente
                          </label>
                          <textarea
                            id={`r-msg-${index}`}
                            rows={2}
                            className={`${input} resize-y py-2.5 leading-snug`}
                            value={reward.promoText}
                            onChange={(e) => updateReward(index, { promoText: e.target.value })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              rewards: prev.rewards.filter((_, i) => i !== index),
                            }))
                          }
                          className="flex min-h-12 items-center justify-center rounded-lg px-3.5 text-[0.95rem] font-bold text-tomate-deep hover:bg-tomate/10 sm:w-12 sm:px-0"
                          aria-label={`Quitar ${reward.label || "recompensa"}`}
                        >
                          <span className="sm:hidden">Quitar</span>
                          <svg
                            className="hidden sm:block"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className={`${panel}`} aria-labelledby="sec-compartir">
                <h2 id="sec-compartir" className={sectionTitle}>
                  Compartir con tus clientes
                </h2>
                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="shrink-0 self-start">
                    <QrCode value={joinUrl} size={150} label="QR para que los clientes se registren" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[1rem] leading-snug text-tinta-soft">
                      Imprime este QR en el mostrador o en las mesas. Quien lo escanee crea su
                      tarjeta en segundos.
                    </p>
                    <p className="num mt-3 break-all rounded-lg bg-mesa px-3 py-2 text-[0.95rem] font-semibold">
                      {joinUrl || "…"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={copyLink}
                        disabled={!joinUrl}
                        className={`${btnOutline} ${btnSmall}`}
                      >
                        {copied ? <CheckIcon size={18} strokeWidth={3} /> : <CopyIcon size={18} />}
                        {copied ? "Copiado" : "Copiar enlace"}
                      </button>
                      {published && (
                        <a
                          href={joinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`${btnOutline} ${btnSmall}`}
                        >
                          <ExternalIcon size={18} />
                          Verla como cliente
                        </a>
                      )}
                    </div>
                    {!published && (
                      <p className="mt-3 flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-aviso">
                        <AlertIcon size={18} className="mt-0.5 shrink-0" />
                        El enlace no funciona hasta que publiques la tarjeta.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-5" aria-labelledby="sec-preview">
              <div className="mx-auto max-w-[26rem]">
                <h2 id="sec-preview" className={`${sectionTitle} mb-3`}>
                  Vista previa
                </h2>
                <div className="rounded-[10px] bg-lito p-4 sm:p-5">
                  <StampCard
                    restaurant={{
                      name: form.name || "Tu restaurante",
                      logoUrl: form.logoUrl,
                      bgColor: form.bgColor,
                      primaryColor: form.primaryColor,
                      textColor: form.textColor,
                      rewardText: form.rewardText,
                      rewards: form.rewards,
                      stampsRequired: form.stampsRequired,
                    }}
                    stamps={shownStamps}
                    customerName="Tu cliente"
                    totalVisits={shownStamps}
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="preview-stamps" className="flex items-center justify-between text-[1rem] font-bold">
                    <span>Simular sellos</span>
                    <span className="num">
                      {shownStamps} de {previewMax}
                    </span>
                  </label>
                  <input
                    id="preview-stamps"
                    type="range"
                    min={0}
                    max={previewMax}
                    value={shownStamps}
                    onChange={(e) => setPreviewStamps(Number(e.target.value))}
                    className="mt-2 h-8 w-full"
                  />
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {restaurant !== undefined && !loadError && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-tinta bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:static lg:mx-auto lg:max-w-6xl lg:border-0 lg:bg-transparent lg:px-8 lg:pb-12 lg:pt-0">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
            <button onClick={handleSave} disabled={saving || (!dirty && restaurantId !== null)} className={btnInk}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            {!published ? (
              <button
                onClick={() => handlePublish(true)}
                disabled={saving || dirty || !restaurantId}
                className={btnPrimary}
              >
                Publicar tarjeta
              </button>
            ) : (
              <button onClick={() => handlePublish(false)} disabled={saving} className={btnOutline}>
                Despublicar
              </button>
            )}
            <p
              role="status"
              className={`min-w-0 flex-1 text-[0.95rem] font-semibold leading-snug ${
                feedback?.tone === "error" ? "text-tomate-deep" : "text-tinta-soft"
              }`}
            >
              {feedback
                ? feedback.text
                : dirty
                  ? "Tienes cambios sin guardar."
                  : !restaurantId
                    ? "Guarda para crear tu restaurante."
                    : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
