
export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: "prediction" | "social" | "contribution" | "achievement";
  level?: 1 | 2 | 3; // Bronze, Silver, Gold
};

export type UserRank = {
  level: number;
  title: string;
  points: number;
  nextLevel?: {
    title: string;
    pointsNeeded: number;
  };
  percentToNextLevel?: number;
};

export type LeaderboardEntry = {
  userId: string;
  userName: string;
  userAvatar?: string;
  rank: number;
  points: number;
  successRate: number; // Percentage of successful predictions
  followers: number;
  badges: number; // Number of badges earned
  userRank: UserRank;
};

export type LeaderboardPeriod = "weekly" | "monthly" | "allTime";
export type LeaderboardCategory = "predictions" | "followers" | "contributions";
