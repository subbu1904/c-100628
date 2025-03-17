
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
