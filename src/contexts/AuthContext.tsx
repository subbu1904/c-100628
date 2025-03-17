
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser } from "@/types/user";
import { authService } from "@/services/authService";
import { AuthContextType } from "./AuthContextTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>({
    isAuthenticated: false,
    profile: null,
    loading: true
  });

  // Check for existing session on mount
  useEffect(() => {
    const storedUserProfile = authService.getUserFromStorage();
    
    if (storedUserProfile) {
      setUser({
        isAuthenticated: true,
        profile: storedUserProfile,
        loading: false
      });
    } else {
      setUser({ isAuthenticated: false, profile: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userProfile = await authService.login(email, password);
      
      if (userProfile) {
        setUser({
          isAuthenticated: true,
          profile: userProfile,
          loading: false
        });
        
        authService.storeUser(userProfile);
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
      const newUser = await authService.register(email, password, name);
      
      setUser({
        isAuthenticated: true,
        profile: newUser,
        loading: false
      });
      
      authService.storeUser(newUser);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const loginWithOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const userProfile = await authService.loginWithOtp(email, otp);
      
      if (userProfile) {
        setUser({
          isAuthenticated: true,
          profile: userProfile,
          loading: false
        });
        
        authService.storeUser(userProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error("OTP login failed:", error);
      return false;
    }
  };

  const loginWithSocial = async (provider: "google" | "facebook"): Promise<boolean> => {
    try {
      const userProfile = await authService.loginWithSocial(provider);
      
      setUser({
        isAuthenticated: true,
        profile: userProfile,
        loading: false
      });
      
      authService.storeUser(userProfile);
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
    authService.clearUser();
  };

  const sendOtp = async (email: string): Promise<boolean> => {
    return await authService.sendOtp(email);
  };

  const upgradeToPermium = async (): Promise<boolean> => {
    if (!user.profile) return false;
    
    try {
      const updatedProfile = await authService.upgradeToPermium(user.profile);
      
      setUser({
        ...user,
        profile: updatedProfile
      });
      
      authService.storeUser(updatedProfile);
      return true;
    } catch (error) {
      console.error("Upgrade failed:", error);
      return false;
    }
  };

  const downgradeToFree = async (): Promise<boolean> => {
    if (!user.profile) return false;
    
    try {
      const updatedProfile = await authService.downgradeToFree(user.profile);
      
      setUser({
        ...user,
        profile: updatedProfile
      });
      
      authService.storeUser(updatedProfile);
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
