
import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormWrapperProps {
  onSuccess: () => void;
}

const LoginFormWrapper: React.FC<LoginFormWrapperProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  
  // Use an effect to detect when the user becomes authenticated
  useEffect(() => {
    if (user && user.isAuthenticated) {
      onSuccess();
    }
  }, [user, onSuccess]);
  
  return (
    <LoginForm />
  );
};

export default LoginFormWrapper;
