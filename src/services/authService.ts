
import { UserProfile } from "@/types/user";
import { mockUsers } from "@/data/mockUsers";

// Local storage key
const USER_STORAGE_KEY = "cryptoUser";

export const authService = {
  // Get user from local storage
  getUserFromStorage: (): UserProfile | null => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    return null;
  },

  // Store user in local storage
  storeUser: (user: UserProfile): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  // Clear user from local storage
  clearUser: (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  // Login with email and password
  login: async (email: string, password: string): Promise<UserProfile | null> => {
    // In a real app, this would be a server request
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      return foundUser;
    }
    return null;
  },

  // Register new user
  register: async (
    email: string, 
    password: string, 
    name: string
  ): Promise<UserProfile> => {
    // In a real app, this would create a user in the database
    const newUser: UserProfile = {
      id: Date.now().toString(),
      email,
      name,
      role: "free",
      createdAt: new Date().toISOString(),
      membership: {
        type: "free"
      }
    };
    return newUser;
  },

  // Login with OTP
  loginWithOtp: async (email: string, otp: string): Promise<UserProfile | null> => {
    // Simulate OTP verification
    if (otp === "123456") { // Mock OTP check
      const foundUser = mockUsers.find(u => u.email === email) || {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        role: "free",
        createdAt: new Date().toISOString(),
        membership: {
          type: "free"
        }
      };
      return foundUser;
    }
    return null;
  },

  // Login with social provider
  loginWithSocial: async (provider: "google" | "facebook"): Promise<UserProfile> => {
    // In a real app, this would use OAuth
    const mockSocialUser: UserProfile = {
      id: Date.now().toString(),
      email: `user_${Date.now()}@${provider}.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      role: "free",
      createdAt: new Date().toISOString(),
      membership: {
        type: "free"
      }
    };
    return mockSocialUser;
  },

  // Send OTP
  sendOtp: async (email: string): Promise<boolean> => {
    // Simulate sending OTP
    console.log(`OTP sent to ${email}: 123456`);
    return true;
  },

  // Upgrade to premium
  upgradeToPermium: async (profile: UserProfile): Promise<UserProfile> => {
    // In a real app, this would involve a payment process
    const updatedProfile = {
      ...profile,
      role: "premium" as const,
      membership: {
        type: "premium" as const,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        autoRenew: true
      }
    };
    return updatedProfile;
  },

  // Downgrade to free
  downgradeToFree: async (profile: UserProfile): Promise<UserProfile> => {
    const updatedProfile = {
      ...profile,
      role: "free" as const,
      membership: {
        type: "free" as const
      }
    };
    return updatedProfile;
  }
};
