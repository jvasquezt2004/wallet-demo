import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { generateWalletLink } from "@/lib/wallet";

export async function POST(request: Request) {
  const body = await request.json();
  const customerId = String(body.customerId ?? "");
  if (!customerId) {
    return NextResponse.json({ error: "Falta el cliente." }, { status: 400 });
  }

  try {
    return NextResponse.json({ url: await generateWalletLink(customerId, getAppUrl(request)) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo generar el pase.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
