import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeRestaurant } from "@/lib/loyalty";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();
  const restaurant = await prisma.restaurant.update({
    where: { slug },
    data: { published: Boolean(body.published) },
  });
  return NextResponse.json(serializeRestaurant(restaurant));
}
