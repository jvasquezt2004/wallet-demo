import { NextResponse } from "next/server";
import { registerVisit } from "@/lib/loyalty";

export async function POST(request: Request) {
  const body = await request.json();
  const code = String(body.customerId ?? "").trim();
  if (!code) {
    return NextResponse.json({ error: "Código vacío." }, { status: 400 });
  }

  try {
    return NextResponse.json(await registerVisit(code));
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo registrar la visita.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
