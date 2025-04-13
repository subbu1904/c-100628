
import { UserProfile } from "@/types/user";
import { userRepository } from "@/repositories/userRepository";

// Local storage key
const USER_STORAGE_KEY = "cryptoUser";

// Utility function to generate a random string (replacing bcrypt for client-side)
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Mock user for development in browser environments
const MOCK_USER: UserProfile = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'free', // Changed from 'user' to 'free' to match UserRole type
  avatarUrl: '/placeholder.svg',
  createdAt: new Date().toISOString(),
  membership: {
    type: 'free'
  }
};

export const authService = {
  // Get user from local storage
  getUserFromStorage: (): UserProfile | null => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
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
    try {
      // For browser environment, return mock user on successful credentials
      if (email === 'demo@example.com' && password === 'password') {
        return MOCK_USER;
      }
      
      // Try to authenticate with repository but fall back to mock if it fails
      const user = await userRepository.authenticateUser(email, password);
      return user || null;
    } catch (error) {
      console.error("Login error:", error);
      // In development/browser environment, return mock user
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user for development');
        return MOCK_USER;
      }
      return null;
    }
  },

  // Register new user
  register: async (
    email: string, 
    password: string, 
    name: string
  ): Promise<UserProfile | null> => {
    try {
      // Try to create user with repository but fall back to mock if it fails
      return await userRepository.createUser(email, password, name) || MOCK_USER;
    } catch (error) {
      console.error("Registration error:", error);
      // In development, return mock user
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user for development');
        return { 
          ...MOCK_USER, 
          email, 
          name 
        };
      }
      return null;
    }
  },

  // Login with OTP
  loginWithOtp: async (email: string, otp: string): Promise<UserProfile | null> => {
    try {
      // In a real app, verify OTP from database or cache
      // For now, use mocked implementation
      if (otp === "123456") { // Mock OTP check
        // For browser environment, create a mock user
        return { 
          ...MOCK_USER, 
          email, 
          name: email.split("@")[0] 
        };
      }
      return null;
    } catch (error) {
      console.error("OTP login error:", error);
      return null;
    }
  },

  // Login with social provider
  loginWithSocial: async (provider: "google" | "facebook"): Promise<UserProfile | null> => {
    try {
      // For browser environment, create a mock user with the provider name
      return {
        ...MOCK_USER,
        email: `user_${Date.now()}@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
      };
    } catch (error) {
      console.error("Social login error:", error);
      return null;
    }
  },

  // Send OTP
  sendOtp: async (email: string): Promise<boolean> => {
    try {
      // In a real app, send OTP via email or SMS
      console.log(`OTP sent to ${email}: 123456`);
      return true;
    } catch (error) {
      console.error("Send OTP error:", error);
      return false;
    }
  },

  // Upgrade to premium
  upgradeToPermium: async (profile: UserProfile): Promise<UserProfile | null> => {
    try {
      // For browser environment, create a mock premium user
      return { 
        ...profile, 
        membership: {
          ...profile.membership,
          type: 'premium',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          autoRenew: true
        }
      };
    } catch (error) {
      console.error("Upgrade to premium error:", error);
      return null;
    }
  },

  // Downgrade to free
  downgradeToFree: async (profile: UserProfile): Promise<UserProfile | null> => {
    try {
      // For browser environment, create a mock free user
      return { 
        ...profile, 
        membership: {
          type: 'free'
        }
      };
    } catch (error) {
      console.error("Downgrade to free error:", error);
      return null;
    }
  }
};
