
import { AuthUser } from "@/types/user";

export interface AuthContextType {
  user: AuthUser;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOtp: (email: string, otp: string) => Promise<boolean>;
  loginWithSocial: (provider: "google" | "facebook") => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  sendOtp: (email: string) => Promise<boolean>;
  upgradeToPermium: () => Promise<boolean>;
  downgradeToFree: () => Promise<boolean>;
}
