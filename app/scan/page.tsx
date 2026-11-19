"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const detectorRef = useRef<InstanceType<typeof BarcodeDetectorConstructor> | null>(null);
  const busyRef = useRef(false);
  // Cada arranque/parada de cámara incrementa el contador: un arranque que
  // termina tarde (p. ej. el doble montaje de React) ve que ya no es el vigente.
  const runRef = useRef(0);

  const stopCamera = useCallback(() => {
    runRef.current += 1;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
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
    if (!window.BarcodeDetector) {
      setError(
        "Este navegador no puede leer QR con la cámara. Usa Chrome en Android o escribe el código del cliente."
      );
      return;
    }
    const run = ++runRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      if (run !== runRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      if (run !== runRef.current) return;
      setActive(true);

      detectorRef.current = new window.BarcodeDetector({ formats: ["qr_code"] });

      const tick = async () => {
        if (run !== runRef.current) return;
        if (!videoRef.current || busyRef.current) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }
        try {
          const codes = await detectorRef.current?.detect(videoRef.current);
          if (codes && codes.length > 0) {
            await handleCode(codes[0].rawValue);
            return;
          }
        } catch {
          // Un frame fallido no detiene el escáner.
        }
        frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    } catch {
      if (run === runRef.current) {
        setError(
          "No se pudo acceder a la cámara. Revisa los permisos del navegador o escribe el código del cliente."
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
        <h1 className="lettering text-[1.8rem]">Registrar visita</h1>
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
            className="relative aspect-square w-full overflow-hidden rounded-[10px] border-2 border-white/80 bg-tinta sm:aspect-[4/3]"
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
                <p className="label-caps absolute inset-x-0 bottom-4 text-center text-[0.95rem] text-white drop-shadow">
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
              <p className="mt-4 flex items-start gap-2.5 rounded-lg bg-aviso-soft p-3.5 text-[0.95rem] leading-snug text-tinta">
                <AlertIcon size={20} className="mt-0.5 shrink-0 text-aviso" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <form
            className="on-mesa stock mt-6 rounded-[10px] border-2 border-tinta p-4 text-tinta"
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
