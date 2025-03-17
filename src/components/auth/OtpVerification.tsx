
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface OtpVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<boolean>;
  onBack: () => void;
}

const OtpVerification = ({ email, onVerify, onResend, onBack }: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const success = await onVerify(otp);
      if (!success) {
        toast({
          title: "Verification Failed",
          description: "The OTP you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const success = await onResend();
      if (success) {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email",
        });
      } else {
        toast({
          title: "Failed to Resend",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a 6-digit code to {email}
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP 
          value={otp} 
          onChange={setOtp} 
          maxLength={6}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleVerify} 
          disabled={otp.length !== 6 || isVerifying}
          className="w-full"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
        
        <div className="flex justify-between mt-2">
          <Button 
            variant="outline" 
            onClick={onBack}
            size="sm"
          >
            Back
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleResend} 
            disabled={isResending}
            size="sm"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
