"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { QrCode } from "@/components/qr-code";
import { DEFAULT_FORM, TEMPLATES, type TemplateKey } from "@/lib/branding";
import { patchJson, postJson } from "@/lib/api";
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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const inputClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
const labelClass = "block text-xs font-semibold uppercase tracking-wide text-neutral-500";

export default function AdminPage() {
  const {
    data: restaurant,
    error: loadError,
    mutate: mutateRestaurant,
  } = useSWR<RestaurantDTO | null>("/api/restaurants");

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [published, setPublishedState] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
    setForm({
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
    });
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
    setMessage(null);
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
      await mutateRestaurant(saved, { revalidate: false });
      setMessage("Cambios guardados.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(next: boolean) {
    if (!restaurantId) {
      setMessage("Guarda primero el restaurante.");
      return;
    }
    setSaving(true);
    try {
      const updated = await patchJson<RestaurantDTO>(
        `/api/restaurants/${form.slug}/publish`,
        { published: next }
      );
      await mutateRestaurant(updated, { revalidate: false });
      setPublishedState(next);
      setMessage(next ? "¡Tarjeta publicada! Ya puedes compartir el QR." : "Tarjeta despublicada.");
    } finally {
      setSaving(false);
    }
  }

  const joinUrl = origin ? `${origin}/c/${form.slug}` : "";
  const previewMax = Math.max(1, ...form.rewards.map((reward) => reward.stampsRequired));
  const previewRewards = [...form.rewards].sort(
    (a, b) => a.stampsRequired - b.stampsRequired
  );

  const updateReward = (index: number, patch: Partial<Reward>) =>
    setForm((prev) => ({
      ...prev,
      rewards: prev.rewards.map((reward, i) => (i === index ? { ...reward, ...patch } : reward)),
    }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Inicio
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Configura tu restaurante</h1>
      <p className="mt-2 text-neutral-600">
        Personaliza la tarjeta, define las recompensas y publícala para compartir el QR.
      </p>

      {loadError ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">No se pudo cargar el restaurante</h2>
          <p className="mt-2 text-sm text-red-800">{loadError.message}</p>
          <p className="mt-2 text-sm text-red-700">
            Revisa que <code>DATABASE_URL</code> esté configurada en Vercel y que las tablas
            existan (<code>pnpm db:push</code>).
          </p>
          <button
            onClick={() => mutateRestaurant()}
            className="mt-4 rounded-xl bg-red-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      ) : restaurant === undefined ? (
        <p className="mt-10 text-neutral-500">Cargando...</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Datos y apariencia</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input
                    className={`mt-1 ${inputClass}`}
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
                  <label className={labelClass}>URL (slug)</label>
                  <input
                    className={`mt-1 ${inputClass}`}
                    value={form.slug}
                    onChange={(e) => {
                      slugTouched.current = true;
                      update("slug", slugify(e.target.value));
                    }}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Descripción</label>
                <input
                  className={`mt-1 ${inputClass}`}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Logo (URL)</label>
                <input
                  className={`mt-1 ${inputClass}`}
                  placeholder="https://.../logo.png"
                  value={form.logoUrl}
                  onChange={(e) => update("logoUrl", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Plantilla</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyTemplate(key)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                        form.template === key
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: TEMPLATES[key].primaryColor }}
                      />
                      {TEMPLATES[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Fondo</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={form.bgColor}
                      onChange={(e) => update("bgColor", e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <input
                      className={inputClass}
                      value={form.bgColor}
                      onChange={(e) => update("bgColor", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Sello / acento</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => update("primaryColor", e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <input
                      className={inputClass}
                      value={form.primaryColor}
                      onChange={(e) => update("primaryColor", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Texto</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={form.textColor}
                      onChange={(e) => update("textColor", e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <input
                      className={inputClass}
                      value={form.textColor}
                      onChange={(e) => update("textColor", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Sellos y recompensas</h2>
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
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
                >
                  + Recompensa
                </button>
              </div>

              <p className="text-sm text-neutral-500">
                Cada recompensa tiene sus propios sellos. Se desbloquea al llegar a su
                número y la tarjeta se reinicia al completar la recompensa más alta.
              </p>

              <div className="hidden gap-3 px-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 sm:grid sm:grid-cols-[1fr_100px_1.4fr_auto]">
                <span>Recompensa</span>
                <span>Sellos</span>
                <span>Mensaje</span>
                <span />
              </div>

              <div className="space-y-3">
                {form.rewards.map((reward, index) => (
                  <div
                    key={reward.id}
                    className="grid gap-3 rounded-xl border border-neutral-200 p-3 sm:grid-cols-[1fr_100px_1.4fr_auto]"
                  >
                    <input
                      className={inputClass}
                      value={reward.label}
                      placeholder="Nombre"
                      onChange={(e) => updateReward(index, { label: e.target.value })}
                    />
                    <input
                      type="number"
                      min={1}
                      className={inputClass}
                      value={reward.stampsRequired}
                      onChange={(e) =>
                        updateReward(index, { stampsRequired: Number(e.target.value) })
                      }
                    />
                    <input
                      className={inputClass}
                      value={reward.promoText}
                      placeholder="Mensaje de la recompensa"
                      onChange={(e) => updateReward(index, { promoText: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          rewards: prev.rewards.filter((_, i) => i !== index),
                        }))
                      }
                      className="rounded-lg px-3 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Eliminar recompensa"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                onClick={() => handlePublish(true)}
                disabled={saving || published}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {published ? "Publicado ✓" : "Publicar tarjeta"}
              </button>
              {published && (
                <button
                  onClick={() => handlePublish(false)}
                  disabled={saving}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm"
                >
                  Despublicar
                </button>
              )}
              {message && <span className="text-sm text-neutral-600">{message}</span>}
            </div>
          </div>

          <aside className="space-y-6">
            <div
              className="rounded-3xl p-6 shadow-lg"
              style={{ backgroundColor: form.bgColor, color: form.textColor }}
            >
              <p className="text-xs uppercase tracking-widest opacity-70">Vista previa</p>
              <h3 className="mt-1 text-xl font-bold">{form.name || "Tu restaurante"}</h3>
              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                {Array.from({ length: Math.min(10, previewMax) }).map((_, i) => {
                  const stamp = i + 1;
                  const rewardsAtStamp = previewRewards.filter(
                    (reward) => reward.stampsRequired === stamp
                  );
                  const isThreshold = rewardsAtStamp.length > 0;
                  return (
                    <div key={stamp} className="flex flex-col items-center">
                      <span
                        className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold"
                        style={{
                          borderColor: form.primaryColor,
                          backgroundColor:
                            stamp === 1
                              ? form.primaryColor
                              : isThreshold
                                ? `${form.primaryColor}33`
                                : "transparent",
                          color: stamp === 1 ? form.bgColor : form.primaryColor,
                        }}
                      >
                        {stamp === 1 ? "★" : stamp}
                        {isThreshold && (
                          <span
                            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border"
                            style={{ backgroundColor: form.primaryColor, borderColor: form.bgColor }}
                          />
                        )}
                      </span>
                      {isThreshold && (
                        <span
                          className="mt-1 text-[9px] font-bold uppercase tracking-wide"
                          style={{ color: form.primaryColor }}
                        >
                          {rewardsAtStamp.length} premio{rewardsAtStamp.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                  Recompensas
                </p>
                {previewRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {reward.label || "Recompensa"}
                      </p>
                      {reward.promoText && (
                        <p className="truncate text-[11px] opacity-70">{reward.promoText}</p>
                      )}
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: form.primaryColor, color: form.bgColor }}
                    >
                      {reward.stampsRequired} {reward.stampsRequired === 1 ? "sello" : "sellos"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
              <h3 className="font-semibold">QR de la tarjeta</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Compártelo en tu local para que los clientes se registren.
              </p>
              <div className="mt-4 flex justify-center">
                <QrCode value={joinUrl} size={180} />
              </div>
              <p className="mt-3 break-all text-xs text-neutral-400">{joinUrl}</p>
              {joinUrl && (
                <button
                  onClick={() => navigator.clipboard?.writeText(joinUrl)}
                  className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
                >
                  Copiar enlace
                </button>
              )}
              {!published && (
                <p className="mt-3 text-xs text-amber-700">
                  Publica la tarjeta para que el enlace esté activo.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
