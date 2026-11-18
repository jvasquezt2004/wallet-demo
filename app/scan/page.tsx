"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ScanResultView, type ScanResult } from "@/components/scan-result";
import { postJson } from "@/lib/api";

const parseCustomerId = (value: string): string => {
  const trimmed = value.trim().replace(/\/+$/, "");
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

  const stopCamera = useCallback(() => {
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
        "La detección de QR no está disponible en este navegador. Usa Chrome en Android o ingresa el código manualmente."
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setActive(true);

      detectorRef.current = new window.BarcodeDetector({ formats: ["qr_code"] });

      const tick = async () => {
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
      setError("No se pudo acceder a la cámara. Revisa los permisos o ingresa el código manualmente.");
    }
  }, [handleCode]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-10">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Inicio
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Registrar visita</h1>
      <p className="mt-2 text-neutral-600">
        Escanea el QR de la tarjeta del cliente para sumarle un sello.
      </p>

      {result ? (
        <div className="mt-8">
          <ScanResultView
            result={result}
            onReset={() => {
              setResult(null);
              startCamera();
            }}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-hidden rounded-3xl bg-neutral-900">
            <video
              ref={videoRef}
              playsInline
              muted
              className="aspect-[4/3] w-full object-cover"
            />
            {!active && (
              <div className="flex aspect-[4/3] w-full items-center justify-center text-5xl text-neutral-600">
                📷
              </div>
            )}
          </div>

          {!active ? (
            <button
              onClick={startCamera}
              className="mt-5 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white"
            >
              Activar cámara
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="mt-5 w-full rounded-xl border border-neutral-300 py-3 text-sm font-semibold"
            >
              Detener cámara
            </button>
          )}

          {processing && <p className="mt-4 text-center text-sm text-neutral-500">Registrando visita...</p>}
          {error && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              ¿No puedes escanear? Ingresa el código
            </label>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (manual.trim()) handleCode(manual);
              }}
            >
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Código de 8 caracteres, ID o URL del QR"
                className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              />
              <button className="rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white">
                Sumar
              </button>
            </form>
          </div>
        </>
      )}
    </main>
  );
}
