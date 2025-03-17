
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
}

export type AdviceSentiment = {
  buy: number;
  sell: number;
  hold: number;
  total: number;
};
