
import { UserProfile } from "@/types/user";
import { userRepository } from "@/repositories/userRepository";
import * as bcrypt from 'bcryptjs';

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
    // Authenticate against the database
    return await userRepository.authenticateUser(email, password);
  },

  // Register new user
  register: async (
    email: string, 
    password: string, 
    name: string
  ): Promise<UserProfile | null> => {
    // Create user in the database
    return await userRepository.createUser(email, password, name);
  },

  // Login with OTP
  loginWithOtp: async (email: string, otp: string): Promise<UserProfile | null> => {
    // In a real app, verify OTP from database or cache
    // For now, use mocked implementation
    if (otp === "123456") { // Mock OTP check
      const existingUser = await userRepository.getUserByEmail(email);
      
      if (existingUser) {
        return existingUser;
      }
      
      // Create new user if they don't exist
      return await userRepository.createUser(
        email,
        await bcrypt.hash(Math.random().toString(36), 10), // Random password
        email.split("@")[0] // Use part of email as name
      );
    }
    return null;
  },

  // Login with social provider
  loginWithSocial: async (provider: "google" | "facebook"): Promise<UserProfile | null> {
    // In a real app, this would use OAuth
    // For now, create a mock user with the provider name
    const email = `user_${Date.now()}@${provider}.com`;
    return await userRepository.createUser(
      email,
      await bcrypt.hash(Math.random().toString(36), 10), // Random password
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} User` // Capitalized provider name
    );
  },

  // Send OTP
  sendOtp: async (email: string): Promise<boolean> => {
    // In a real app, send OTP via email or SMS
    console.log(`OTP sent to ${email}: 123456`);
    return true;
  },

  // Upgrade to premium
  upgradeToPermium: async (profile: UserProfile): Promise<UserProfile | null> => {
    return await userRepository.upgradeUserToPremium(profile.id);
  },

  // Downgrade to free
  downgradeToFree: async (profile: UserProfile): Promise<UserProfile | null> => {
    return await userRepository.downgradeUserToFree(profile.id);
  }
};
