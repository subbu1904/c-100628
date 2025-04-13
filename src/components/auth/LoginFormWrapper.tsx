
import React from "react";
import LoginForm from "./LoginForm";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormWrapperProps {
  onSuccess: () => void;
}

const LoginFormWrapper: React.FC<LoginFormWrapperProps> = ({ onSuccess }) => {
  const { login, loginWithOtp, loginWithSocial } = useAuth();
  
  const handleLoginSuccess = () => {
    onSuccess();
  };
  
  return (
    <LoginForm 
      onLoginSuccess={handleLoginSuccess} 
    />
  );
};

export default LoginFormWrapper;
