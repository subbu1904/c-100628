
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type UserRole = "free" | "premium" | "admin" | "expert";

export interface UserMembership {
  type: "free" | "premium";
  startDate?: string;
  endDate?: string;
  autoRenew?: boolean;
}

export interface UserPoints {
  points: number;
  level: number;
  title: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  membership: UserMembership;
  followers?: number;
  following?: number;
  points?: number;
  successRate?: number;
  rank?: {
    level: number;
    title: string;
  };
  badgeCount?: number;
  expertStatus?: {
    isVerified: boolean;
    verifiedAt?: string;
    specialties?: string[];
    credentials?: string[];
  };
  predictionStats?: PredictionStats;
}

export interface PredictionStats {
  total: number;
  correct: number;
  accuracy: number;
  byCategory?: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    }
  };
  byTimeframe?: {
    short: { total: number; correct: number; accuracy: number; }, // < 1 week
    medium: { total: number; correct: number; accuracy: number; }, // 1 week - 1 month
    long: { total: number; correct: number; accuracy: number; }, // > 1 month
  };
}

export interface AuthUser {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  loading: boolean;
}
