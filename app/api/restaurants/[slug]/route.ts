import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeRestaurant } from "@/lib/loyalty";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  return NextResponse.json(restaurant ? serializeRestaurant(restaurant) : null);
}
