import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDashboardStats } from "@/lib/loyalty";

export async function GET(request: Request) {
  const restaurantId = new URL(request.url).searchParams.get("restaurantId");
  if (!restaurantId) return NextResponse.json(null);

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) return NextResponse.json(null);

  return NextResponse.json(await getDashboardStats(restaurantId));
}
