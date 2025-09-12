"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthStore } from "@twinn/store";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthDivider } from "../ui/auth-divider";
import { ForgotPasswordButton } from "../ui/forgot-password-button";
import { GoogleSignInButton } from "../ui/google-signin-button";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  
  const { signIn, signInWithGoogle, forgotPassword, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email address first');
      return;
    }

    try {
      await forgotPassword(email);
      alert('Password reset email sent! Check your inbox.');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to TwinnLinks
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your patient portal account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" htmlFor="email" required>
              <InputWithIcon
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" required>
              <InputWithIcon
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                actionIcon={showPassword ? EyeOff : Eye}
                onActionClick={() => setShowPassword(!showPassword)}
                actionDisabled={isLoading || isGoogleLoading}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </FormField>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <ForgotPasswordButton
                disabled={isLoading || isGoogleLoading}
                onClick={handleForgotPassword}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <AuthDivider />

          {/* Google Sign-In Button */}
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            isLoading={isGoogleLoading}
            disabled={isLoading || isGoogleLoading}
          />

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
            <p className="text-sm font-medium text-center text-muted-foreground mb-2">
              🚀 Demo Credentials
            </p>
            <div className="text-xs text-center space-y-1">
              <p className="font-mono">
                <span className="font-semibold">Email:</span> demo@twinnlinks.com
              </p>
              <p className="font-mono">
                <span className="font-semibold">Password:</span> demo123
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              New to TwinnLinks?{" "}
              <button className="text-primary hover:underline font-medium">
                Create an account
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
