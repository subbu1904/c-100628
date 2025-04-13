
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginFormWrapper from "./LoginFormWrapper";
import { toast } from "@/hooks/use-toast";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const handleLoginSuccess = () => {
    setShowSuccessMessage(true);
    toast({
      title: "Login Successful",
      description: "Welcome back to CryptoView!",
    });
    
    // Close the dialog after a short delay
    setTimeout(() => {
      onClose();
      setShowSuccessMessage(false);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showSuccessMessage ? "Success!" : "Sign In"}
          </DialogTitle>
        </DialogHeader>
        
        {showSuccessMessage ? (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-green-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              You are now signed in. Redirecting...
            </p>
          </div>
        ) : (
          <LoginFormWrapper onSuccess={handleLoginSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
