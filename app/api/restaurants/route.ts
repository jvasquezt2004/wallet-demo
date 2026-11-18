import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { asRewards, serializeRestaurant } from "@/lib/loyalty";
import type { Reward } from "@/lib/types";

export async function GET() {
  const restaurant = await prisma.restaurant.findFirst({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(restaurant ? serializeRestaurant(restaurant) : null);
}

export async function POST(request: Request) {
  const body = await request.json();
  const rewards: Reward[] = asRewards(body.rewards);
  if (rewards.length === 0) {
    return NextResponse.json({ error: "Agrega al menos una recompensa." }, { status: 400 });
  }

  const topReward = [...rewards].sort((a, b) => b.stampsRequired - a.stampsRequired)[0];
  const data = {
    name: String(body.name ?? ""),
    slug: String(body.slug ?? ""),
    template: String(body.template ?? "classico"),
    logoUrl: String(body.logoUrl ?? ""),
    bgColor: String(body.bgColor ?? "#1e293b"),
    primaryColor: String(body.primaryColor ?? "#facc15"),
    textColor: String(body.textColor ?? "#ffffff"),
    description: body.description || null,
    stampsRequired: topReward.stampsRequired,
    rewardText: topReward.label,
    rewards: rewards as unknown as Prisma.InputJsonValue,
    allowedIncentives: [] as Prisma.InputJsonValue,
  };

  if (!data.name || !data.slug) {
    return NextResponse.json({ error: "Nombre y slug son obligatorios." }, { status: 400 });
  }

  let restaurant;
  if (body.id) {
    restaurant = await prisma.restaurant.update({
      where: { id: String(body.id) },
      data,
    });
  } else {
    restaurant = await prisma.restaurant.upsert({
      where: { slug: data.slug },
      create: data,
      update: data,
    });
  }

  return NextResponse.json(serializeRestaurant(restaurant));
}
