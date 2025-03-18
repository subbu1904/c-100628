
export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: "prediction" | "social" | "contribution" | "achievement" | "expert";
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
  isExpert?: boolean;
  predictionAccuracy?: number; // Percentage of correct predictions
  riskIndex?: number; // Risk assessment accuracy
};

export type LeaderboardPeriod = "weekly" | "monthly" | "allTime";
export type LeaderboardCategory = "predictions" | "followers" | "contributions" | "riskAssessment";

export type ExpertVerificationRequest = {
  id: string;
  userId: string;
  userName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  credentials: {
    education?: string[];
    professional?: string[];
    certifications?: string[];
  };
  specialties: string[];
  portfolioUrl?: string;
  linkedInProfile?: string;
};

export type CrowdConsensusScore = {
  assetId: string;
  assetName: string;
  overallSentiment: "bullish" | "bearish" | "neutral";
  buyPercentage: number;
  sellPercentage: number;
  holdPercentage: number;
  expertConsensus?: "bullish" | "bearish" | "neutral";
  consensusStrength: number; // 0-100, how strong is the agreement
  historicalAccuracy: number; // How often the crowd was right for this asset
  riskAssessment: {
    volatilityIndex: number; // 0-100
    riskLevel: "low" | "medium" | "high" | "very-high";
    confidenceScore: number; // 0-100, how confident is the assessment
  };
  predictionTimeframe: "short" | "medium" | "long"; // Short, medium, or long term
};
