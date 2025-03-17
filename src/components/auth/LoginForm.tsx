
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Mail, Lock } from "lucide-react";
import OtpVerification from "./OtpVerification";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "register" | "otp";

const LoginForm = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { login, register, loginWithOtp, loginWithSocial, sendOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "login") {
        const success = await login(email, password);
        if (!success) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        }
      } else if (authMode === "register") {
        const success = await register(email, password, name);
        if (!success) {
          toast({
            title: "Registration Failed",
            description: "Please try again later",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Successful",
            description: "Welcome to CryptoView!",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await sendOtp(email);
      if (success) {
        setAuthMode("otp");
      } else {
        toast({
          title: "Failed to Send OTP",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    try {
      const success = await loginWithSocial(provider);
      if (!success) {
        toast({
          title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Failed`,
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authMode === "otp") {
    return (
      <OtpVerification
        email={email}
        onVerify={(otp) => loginWithOtp(email, otp)}
        onResend={() => sendOtp(email)}
        onBack={() => setAuthMode("login")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {authMode === "login" ? "Welcome Back" : "Create Your Account"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {authMode === "login"
            ? "Sign in to continue to CryptoView"
            : "Sign up to start tracking your crypto assets"}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full flex gap-2 items-center"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full flex gap-2 items-center"
            onClick={() => handleSocialLogin("facebook")}
            disabled={isLoading}
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {authMode === "register" && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              {authMode === "login" && (
                <Button
                  variant="link"
                  className="px-0 text-xs"
                  onClick={handleOtpLogin}
                  type="button"
                  disabled={isLoading}
                >
                  Login with OTP
                </Button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : authMode === "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          {authMode === "login" ? (
            <p>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setAuthMode("register")}
                disabled={isLoading}
              >
                Sign up
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setAuthMode("login")}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
