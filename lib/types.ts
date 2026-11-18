export type Reward = {
  id: string;
  label: string;
  stampsRequired: number;
  promoText: string;
};

export type RestaurantDTO = {
  id: string;
  name: string;
  slug: string;
  template: string;
  logoUrl: string;
  bgColor: string;
  primaryColor: string;
  textColor: string;
  description: string | null;
  stampsRequired: number;
  rewardText: string;
  rewards: Reward[];
  published: boolean;
};

export type CustomerDTO = {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  currentStamps: number;
  totalVisits: number;
  lastVisitAt: number;
  unlockedRewardIds: string[];
  passCode: string;
  createdAt: number;
};

export type ScanResult =
  | { status: "ALREADY_SCANNED"; customerName: string }
  | {
      status: "STAMP_ADDED" | "REWARD_UNLOCKED";
      customerName: string;
      currentStamps: number;
      stampsRequired: number;
      rewardText: string;
      unlockedRewards: Reward[];
      cycleComplete: boolean;
    };

export type DashboardStats = {
  totalCustomers: number;
  visitsToday: number;
  visitsLast7Days: number;
  returningCustomers: number;
  newCustomers: { id: string; name: string; email: string; createdAt: number }[];
  inactiveCustomers: { id: string; name: string; email: string; lastVisitAt: number }[];
  recentVisits: { id: string; customerName: string; scannedAt: number; day: string }[];
  visitsByDay: { day: string; count: number }[];
  visitsByWeekday: { label: string; count: number }[];
};
