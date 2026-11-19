import { Suspense } from "react";
import ScanClient from "./scan-client";

export default function ScanPassPage() {
  return (
    <Suspense
      fallback={
        <div role="status" className="flex min-h-screen items-center justify-center bg-lito-deep text-lg font-semibold text-white">
          Cargando…
        </div>
      }
    >
      <ScanClient />
    </Suspense>
  );
}
