
import { UserProfile } from "@/types/user";

// Mock data for demo purposes - will be replaced with API calls
export const mockUsers: UserProfile[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
    membership: {
      type: "premium",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      autoRenew: true
    }
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Free User",
    role: "free",
    createdAt: new Date().toISOString(),
    membership: {
      type: "free"
    }
  }
];
