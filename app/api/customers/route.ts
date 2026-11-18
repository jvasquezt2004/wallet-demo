import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const slug = String(body.restaurantSlug ?? "");
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!slug || !name || !email) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurante no encontrado." }, { status: 404 });
  }

  const existing = await prisma.customer.findUnique({
    where: { email_restaurantId: { email, restaurantId: restaurant.id } },
  });
  if (existing) {
    if (!existing.passCode) {
      await prisma.customer.update({
        where: { id: existing.id },
        data: { passCode: existing.id.slice(-8).toUpperCase() },
      });
    }
    return NextResponse.json({ customerId: existing.id, isExisting: true });
  }

  const customer = await prisma.customer.create({
    data: {
      restaurantId: restaurant.id,
      name,
      email,
      currentStamps: 1,
      totalVisits: 1,
      lastVisitAt: new Date(),
      unlockedRewardIds: [] as Prisma.InputJsonValue,
      passCode: "pending",
    },
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { passCode: customer.id.slice(-8).toUpperCase() },
  });

  return NextResponse.json({ customerId: customer.id, isExisting: false });
}
