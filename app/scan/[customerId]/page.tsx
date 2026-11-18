import { Suspense } from "react";
import ScanClient from "./scan-client";

export default function ScanPassPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando...</div>}>
      <ScanClient />
    </Suspense>
  );
}
