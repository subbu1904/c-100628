
export type UserRole = "free" | "premium" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  membership: {
    type: "free" | "premium";
    startDate?: string;
    endDate?: string;
    autoRenew?: boolean;
  };
  followers?: number;
  following?: number;
  points?: number;
  successRate?: number;
  rank?: {
    level: number;
    title: string;
  };
  badgeCount?: number;
}

export interface AuthUser {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  loading: boolean;
}

export interface AdvicePost {
  id: string;
  assetId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  recommendation: "buy" | "sell" | "hold";
  content: string;
  timestamp: string;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  userVote?: "up" | "down" | null;
  userRank?: {
    level: number;
    title: string;
  };
  badges?: string[];
}

export type AdviceSentiment = {
  buy: number;
  sell: number;
  hold: number;
  total: number;
};
