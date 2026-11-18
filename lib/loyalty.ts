import type { Customer, Restaurant } from "@prisma/client";
import { prisma } from "./db";
import type {
  CustomerDTO,
  DashboardStats,
  RestaurantDTO,
  Reward,
  ScanResult,
} from "./types";

const DAY = 24 * 60 * 60 * 1000;
const SIX_HOURS = 6 * 60 * 60 * 1000;

export function asRewards(value: unknown): Reward[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Reward =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Reward).id === "string" &&
      typeof (item as Reward).stampsRequired === "number"
  );
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export function rewardsOf(restaurant: {
  rewards: unknown;
  rewardText: string;
  stampsRequired: number;
}): Reward[] {
  const rewards = asRewards(restaurant.rewards);
  if (rewards.length) return rewards;
  return [
    {
      id: "default",
      label: restaurant.rewardText || "Recompensa",
      promoText: restaurant.rewardText || "",
      stampsRequired: restaurant.stampsRequired,
    },
  ];
}

export function serializeRestaurant(restaurant: Restaurant): RestaurantDTO {
  return {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    template: restaurant.template,
    logoUrl: restaurant.logoUrl,
    bgColor: restaurant.bgColor,
    primaryColor: restaurant.primaryColor,
    textColor: restaurant.textColor,
    description: restaurant.description,
    stampsRequired: restaurant.stampsRequired,
    rewardText: restaurant.rewardText,
    rewards: asRewards(restaurant.rewards),
    published: restaurant.published,
  };
}

export function serializeCustomer(customer: Customer): CustomerDTO {
  return {
    id: customer.id,
    restaurantId: customer.restaurantId,
    name: customer.name,
    email: customer.email,
    currentStamps: customer.currentStamps,
    totalVisits: customer.totalVisits,
    lastVisitAt: customer.lastVisitAt.getTime(),
    unlockedRewardIds: asStringArray(customer.unlockedRewardIds),
    passCode: customer.passCode,
    createdAt: customer.createdAt.getTime(),
  };
}

export async function resolveCustomer(value: string): Promise<Customer | null> {
  const code = value.trim();
  if (/^[a-z0-9]{20,}$/.test(code)) {
    return prisma.customer.findUnique({ where: { id: code } });
  }
  return prisma.customer.findUnique({ where: { passCode: code.toUpperCase() } });
}

export async function getPassData(customerId: string) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) return null;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: customer.restaurantId },
  });
  if (!restaurant) return null;
  return { customer: serializeCustomer(customer), restaurant: serializeRestaurant(restaurant) };
}

export async function registerVisit(code: string): Promise<ScanResult> {
  const customer = await resolveCustomer(code);
  if (!customer) throw new Error("Código de tarjeta no válido");

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: customer.restaurantId },
  });
  if (!restaurant) throw new Error("Restaurante no encontrado");

  if (Date.now() - customer.lastVisitAt.getTime() < SIX_HOURS && customer.totalVisits > 1) {
    return { status: "ALREADY_SCANNED", customerName: customer.name };
  }

  const rewards = rewardsOf(restaurant);
  const maxStamps = Math.max(...rewards.map((r) => r.stampsRequired), 1);
  const nextStamps = customer.currentStamps + 1;

  const already = new Set(asStringArray(customer.unlockedRewardIds));
  const newlyUnlocked = rewards.filter(
    (reward) => reward.stampsRequired <= nextStamps && !already.has(reward.id)
  );
  const cycleComplete = nextStamps >= maxStamps;

  await prisma.$transaction([
    prisma.scan.create({
      data: { customerId: customer.id, restaurantId: restaurant.id },
    }),
    prisma.customer.update({
      where: { id: customer.id },
      data: {
        currentStamps: cycleComplete ? 0 : nextStamps,
        unlockedRewardIds: cycleComplete
          ? []
          : [...already, ...newlyUnlocked.map((reward) => reward.id)],
        totalVisits: { increment: 1 },
        lastVisitAt: new Date(),
      },
    }),
  ]);

  const labels = newlyUnlocked.map((reward) => reward.label);
  const header = newlyUnlocked.length
    ? "🎉 ¡Recompensa desbloqueada!"
    : "⭐ ¡Nuevo sello acumulado!";
  const body = newlyUnlocked.length
    ? `Desbloqueaste ${labels.join(", ")} en ${restaurant.name}.`
    : `Llevas ${nextStamps} de ${maxStamps} sellos en ${restaurant.name}.`;

  // Sin Convex: actualizamos el pase de Wallet en la misma petición.
  try {
    const { syncWalletPass } = await import("./wallet");
    await syncWalletPass(customer.id, header, body);
  } catch {
    // Un fallo de Wallet nunca debe impedir registrar la visita.
  }

  return {
    status: newlyUnlocked.length ? "REWARD_UNLOCKED" : "STAMP_ADDED",
    customerName: customer.name,
    currentStamps: cycleComplete ? 0 : nextStamps,
    stampsRequired: maxStamps,
    rewardText: labels.join(" + "),
    unlockedRewards: newlyUnlocked,
    cycleComplete,
  };
}

export async function getDashboardStats(restaurantId: string): Promise<DashboardStats> {
  const [scans, customers] = await Promise.all([
    prisma.scan.findMany({
      where: { restaurantId },
      orderBy: { scannedAt: "desc" },
    }),
    prisma.customer.findMany({ where: { restaurantId } }),
  ]);

  const now = Date.now();
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const dayKey = (ts: number) => new Date(ts).toISOString().slice(0, 10);

  const visitsByDay: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) visitsByDay[dayKey(startOfToday - i * DAY)] = 0;
  for (const scan of scans) {
    const key = dayKey(scan.scannedAt.getTime());
    if (key in visitsByDay) visitsByDay[key] += 1;
  }

  const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const visitsByWeekday = weekdays.map((label) => ({ label, count: 0 }));
  for (const scan of scans) visitsByWeekday[scan.scannedAt.getDay()].count += 1;

  const customerById = new Map(customers.map((c) => [c.id, c]));

  return {
    totalCustomers: customers.length,
    visitsToday: scans.filter((s) => s.scannedAt.getTime() >= startOfToday).length,
    visitsLast7Days: scans.filter((s) => s.scannedAt.getTime() >= now - 7 * DAY).length,
    returningCustomers: customers.filter((c) => c.totalVisits >= 2).length,
    newCustomers: customers
      .filter((c) => c.createdAt.getTime() >= now - 7 * DAY)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        createdAt: c.createdAt.getTime(),
      })),
    inactiveCustomers: customers
      .filter((c) => c.lastVisitAt.getTime() < now - 14 * DAY)
      .sort((a, b) => a.lastVisitAt.getTime() - b.lastVisitAt.getTime())
      .map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        lastVisitAt: c.lastVisitAt.getTime(),
      })),
    recentVisits: scans.slice(0, 20).map((scan) => ({
      id: scan.id,
      customerName: customerById.get(scan.customerId)?.name ?? "Cliente",
      scannedAt: scan.scannedAt.getTime(),
      day: dayKey(scan.scannedAt.getTime()),
    })),
    visitsByDay: Object.entries(visitsByDay).map(([day, count]) => ({ day, count })),
    visitsByWeekday,
  };
}
