"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type QrScanner from "qr-scanner";
import { ScanResultView, type ScanResult } from "@/components/scan-result";
import { SiteNav } from "@/components/site-nav";
import { AlertIcon, CameraIcon, KeyboardIcon } from "@/components/icons";
import { postJson } from "@/lib/api";
import { btnCanary, btnOutlineLight, btnPrimary, input } from "@/lib/ui";

const parseCustomerId = (value: string): string => {
  const trimmed = value.trim().replace(/\/+$/, "");
  // Un código tecleado ("ABCD 1234") puede llevar el espacio con que se muestra.
  if (!trimmed.includes("/")) return trimmed.replace(/\s+/g, "");
  const segments = trimmed.split("/");
  return segments[segments.length - 1];
};

export default function ScanPage() {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const busyRef = useRef(false);
  // Cada arranque/parada de cámara incrementa el contador: un arranque que
  // termina tarde (p. ej. el doble montaje de React) ve que ya no es el vigente.
  const runRef = useRef(0);

  const stopCamera = useCallback(() => {
    runRef.current += 1;
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setActive(false);
  }, []);

  const handleCode = useCallback(
    async (value: string) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setProcessing(true);
      setError(null);
      stopCamera();
      try {
        const customerId = parseCustomerId(value);
        const response = await postJson<ScanResult>("/api/scan", { customerId });
        setResult(response);
        setManual("");
        try {
          navigator.vibrate?.(response.status === "STAMP_ADDED" ? 60 : [80, 60, 80]);
        } catch {
          // La vibración es solo un refuerzo.
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo registrar la visita.");
      } finally {
        setProcessing(false);
        busyRef.current = false;
      }
    },
    [stopCamera]
  );

  const startCamera = useCallback(async () => {
    setError(null);
    const run = ++runRef.current;
    try {
      // qr-scanner usa el detector nativo cuando existe y un lector en JS en el
      // resto (Safari en iPhone, Firefox...). Se carga solo al abrir el escáner.
      const { default: QrScanner } = await import("qr-scanner");
      if (run !== runRef.current) return;
      if (!(await QrScanner.hasCamera())) {
        setError("Este dispositivo no tiene cámara. Escribe el código del cliente.");
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      scannerRef.current?.destroy();
      const scanner = new QrScanner(video, (found) => void handleCode(found.data), {
        preferredCamera: "environment",
        maxScansPerSecond: 12,
        returnDetailedScanResult: true,
        highlightScanRegion: false,
        highlightCodeOutline: false,
      });
      scannerRef.current = scanner;
      await scanner.start();
      if (run !== runRef.current) {
        scanner.destroy();
        if (scannerRef.current === scanner) scannerRef.current = null;
        return;
      }
      setActive(true);
    } catch {
      if (run === runRef.current) {
        setError(
          "No se pudo acceder a la cámara. Revisa los permisos del navegador (la cámara exige HTTPS) o escribe el código del cliente."
        );
      }
    }
  }, [handleCode]);

  // El escáner arranca solo: el personal abre la página y ya está listo.
  useEffect(() => {
    const timer = window.setTimeout(() => void startCamera(), 0);
    return () => {
      window.clearTimeout(timer);
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const resume = useCallback(() => {
    setResult(null);
    void startCamera();
  }, [startCamera]);

  return (
    <div className="min-h-screen bg-lito-deep text-white">
      <SiteNav />
      <main className="mx-auto max-w-lg px-4 pb-10 pt-5 sm:px-6">
        <h1 className="display text-[1.7rem]">Registrar visita</h1>
        <p className="mt-2 text-[1.05rem] leading-snug text-white/85">
          Apunta al QR de la tarjeta del cliente. El sello se suma solo.
        </p>

        {result && (
          <div className="mt-5">
            <ScanResultView result={result} onReset={resume} />
          </div>
        )}

        <div className={result ? "hidden" : "mt-5"}>
          <div
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/20 bg-tinta sm:aspect-[4/3]"
            style={{ containerType: "size" }}
          >
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />

            {active && (
              <>
                {/* Visor: cuatro esquinas y una barra que barre el encuadre. */}
                <svg
                  className="pointer-events-none absolute inset-[12%] h-[76%] w-[76%]"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="#ffc72c"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 22V8a6 6 0 0 1 6-6h14M78 2h14a6 6 0 0 1 6 6v14M98 78v14a6 6 0 0 1-6 6H78M22 98H8a6 6 0 0 1-6-6V78" />
                </svg>
                <div className="pointer-events-none absolute inset-[12%] overflow-hidden" style={{ containerType: "size" }} aria-hidden="true">
                  <div className="scan-sweep h-[3px] w-full rounded-full bg-canario/80" />
                </div>
                <p className="label font-semibold absolute inset-x-0 bottom-4 text-center text-[0.95rem] text-white drop-shadow">
                  {processing ? "Registrando visita…" : "Buscando QR…"}
                </p>
              </>
            )}

            {!active && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-tinta px-6 text-center">
                {processing ? (
                  <>
                    <span
                      className="spin block h-10 w-10 rounded-full border-[3px] border-white/30 border-t-canario"
                      aria-hidden="true"
                    />
                    <p role="status" className="text-lg font-semibold">
                      Registrando visita…
                    </p>
                  </>
                ) : (
                  <>
                    <CameraIcon size={44} className="text-white/70" />
                    <p className="max-w-[16rem] text-[1.05rem] leading-snug text-white/85">
                      La cámara está apagada.
                    </p>
                    <button type="button" onClick={startCamera} className={btnCanary}>
                      Activar cámara
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {active && (
            <button type="button" onClick={stopCamera} className={`${btnOutlineLight} mt-3 w-full`}>
              Detener cámara
            </button>
          )}

          <div aria-live="polite" className="empty:hidden">
            {error && (
              <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-aviso-soft p-3.5 text-[0.95rem] leading-snug text-tinta">
                <AlertIcon size={20} className="mt-0.5 shrink-0 text-aviso" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <form
            className="on-mesa mt-6 rounded-2xl bg-white p-4 text-tinta"
            onSubmit={(e) => {
              e.preventDefault();
              if (manual.trim()) void handleCode(manual);
            }}
          >
            <label htmlFor="manual-code" className="flex items-center gap-2 text-[1rem] font-bold">
              <KeyboardIcon size={20} />
              ¿No lee el QR? Escribe el código
            </label>
            <p className="mt-1 text-[0.95rem] leading-snug text-tinta-soft">
              Está bajo el QR de la tarjeta del cliente: 8 caracteres.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                id="manual-code"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="ABCD 1234"
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className={`${input} min-w-0 flex-1 uppercase tracking-[0.08em]`}
              />
              <button disabled={processing || !manual.trim()} className={btnPrimary}>
                Sumar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
