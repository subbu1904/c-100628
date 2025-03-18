
export type UserRole = "free" | "premium" | "admin" | "expert";

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
  userIsExpert?: boolean;
  verificationStatus?: VerificationStatus;
  riskAssessment?: RiskAssessment;
  predictionOutcome?: PredictionOutcome;
}

export type VerificationStatus = "pending" | "verified" | "incorrect";

export type PredictionOutcome = {
  result: "correct" | "incorrect" | "pending";
  verifiedAt?: string;
  actualChange?: number; // Percentage change
  expectedDirection: "up" | "down" | "stable";
  actualDirection: "up" | "down" | "stable";
};

export type RiskAssessment = {
  level: "low" | "medium" | "high" | "very-high";
  score: number; // 0-100
  volatilityIndex: number; // 0-100
  communityConsensus: number; // 0-100, how much agreement is there
};

export type AdviceSentiment = {
  buy: number;
  sell: number;
  hold: number;
  total: number;
  
  // Expert vs regular user breakdown
  expert?: {
    buy: number;
    sell: number;
    hold: number;
    total: number;
  };
  
  // Accuracy metrics for past predictions
  accuracy?: {
    overall: number; // Percentage correct
    buy: number; // Percentage correct for buy recommendations
    sell: number; // Percentage correct for sell recommendations
    hold: number; // Percentage correct for hold recommendations
  };
};

export interface ExpertInsight {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  summary: string;
  content: string;
  assetId?: string;
  assetName?: string;
  category: "analysis" | "report" | "tutorial" | "news";
  publishedAt: string;
  mediaUrl?: string; // For video or image content
  tags: string[];
  likes: number;
  views: number;
}
