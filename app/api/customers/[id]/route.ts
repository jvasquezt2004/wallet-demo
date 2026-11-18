import { NextResponse } from "next/server";
import { getPassData } from "@/lib/loyalty";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPassData(id);
  return NextResponse.json(data);
}
