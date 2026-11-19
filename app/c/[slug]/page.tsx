import { Suspense } from "react";
import JoinClient from "./join-client";

export default function JoinRestaurantPage() {
  return (
    <Suspense
      fallback={
        <div role="status" className="rays flex min-h-screen items-center justify-center text-lg font-semibold text-white">
          Cargando…
        </div>
      }
    >
      <JoinClient />
    </Suspense>
  );
}
