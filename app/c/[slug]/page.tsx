import { Suspense } from "react";
import JoinClient from "./join-client";

export default function JoinRestaurantPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando...</div>}>
      <JoinClient />
    </Suspense>
  );
}
