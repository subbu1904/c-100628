
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, UserProfile } from "@/types/user";

// Mock data for demo purposes - will be replaced with API calls
const mockUsers: UserProfile[] = [
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

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>({
    isAuthenticated: false,
    profile: null,
    loading: true
  });

  // Check for existing session on mount
  useEffect(() => {
    // Simulate loading user from localStorage
    const storedUser = localStorage.getItem("cryptoUser");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          isAuthenticated: true,
          profile: parsedUser,
          loading: false
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("cryptoUser");
        setUser({ isAuthenticated: false, profile: null, loading: false });
      }
    } else {
      setUser({ isAuthenticated: false, profile: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    try {
      // Find user - in a real app, this would be a server request
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        setUser({
          isAuthenticated: true,
          profile: foundUser,
          loading: false
        });
        
        // Store in localStorage
        localStorage.setItem("cryptoUser", JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string
  ): Promise<boolean> => {
    try {
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
      
      setUser({
        isAuthenticated: true,
        profile: newUser,
        loading: false
      });
      
      localStorage.setItem("cryptoUser", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const loginWithOtp = async (email: string, otp: string): Promise<boolean> => {
    // Simulate OTP verification
    try {
      // In a real app, this would verify the OTP with a server
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
        
        setUser({
          isAuthenticated: true,
          profile: foundUser,
          loading: false
        });
        
        localStorage.setItem("cryptoUser", JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("OTP login failed:", error);
      return false;
    }
  };

  const loginWithSocial = async (provider: "google" | "facebook"): Promise<boolean> => {
    // Simulate social login
    try {
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
      
      setUser({
        isAuthenticated: true,
        profile: mockSocialUser,
        loading: false
      });
      
      localStorage.setItem("cryptoUser", JSON.stringify(mockSocialUser));
      return true;
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      return false;
    }
  };

  const logout = () => {
    setUser({
      isAuthenticated: false,
      profile: null,
      loading: false
    });
    localStorage.removeItem("cryptoUser");
  };

  const sendOtp = async (email: string): Promise<boolean> => {
    // Simulate sending OTP
    console.log(`OTP sent to ${email}: 123456`);
    return true;
  };

  const upgradeToPermium = async (): Promise<boolean> => {
    if (!user.profile) return false;
    
    try {
      // In a real app, this would involve a payment process
      const updatedProfile = {
        ...user.profile,
        role: "premium" as const,
        membership: {
          type: "premium" as const,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          autoRenew: true
        }
      };
      
      setUser({
        ...user,
        profile: updatedProfile
      });
      
      localStorage.setItem("cryptoUser", JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error("Upgrade failed:", error);
      return false;
    }
  };

  const downgradeToFree = async (): Promise<boolean> => {
    if (!user.profile) return false;
    
    try {
      const updatedProfile = {
        ...user.profile,
        role: "free" as const,
        membership: {
          type: "free" as const
        }
      };
      
      setUser({
        ...user,
        profile: updatedProfile
      });
      
      localStorage.setItem("cryptoUser", JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error("Downgrade failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithOtp,
        loginWithSocial,
        register,
        logout,
        sendOtp,
        upgradeToPermium,
        downgradeToFree
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
