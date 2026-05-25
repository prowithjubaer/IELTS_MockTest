"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button, Input } from "@/components/ui";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { getAppMode } from "@/lib/supabase/config";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const appMode = getAppMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      // Redirect based on role
      const store = useAuthStore.getState();
      if (store.user?.role === "admin" || store.user?.role === "super_admin") {
        router.push("/admin");
      } else if (store.user?.role === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/student");
      }
    } catch {
      setLocalError(error || "Invalid email or password");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-navy-950 to-brand-navy-800 text-white p-12 items-center justify-center">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-brand-navy-900 font-bold text-xl">P</span>
            </div>
            <div>
              <span className="font-display font-bold text-2xl">Pro English</span>
              <span className="font-display font-bold text-brand-red-400 text-2xl ml-1">BD</span>
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Welcome Back!</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Continue your IELTS preparation journey. Practice mock tests, review your scores, and achieve your target band.
          </p>
          <div className="mt-12 space-y-4">
            {["Real IELTS exam simulation", "Expert feedback on Writing & Speaking", "Track your progress with analytics"].map((text) => (
              <div key={text} className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-brand-navy-700 rounded-full flex items-center justify-center text-sm">✓</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-display font-bold text-brand-navy-900 text-xl">Pro English BD</span>
          </div>

          {/* Mode indicator */}
          {appMode === "demo" && (
            <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 text-center">
              Running in <strong>Demo Mode</strong> — No real authentication required
            </div>
          )}

          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">Enter your credentials to access your account</p>

          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-brand-red-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Admin:</strong> admin@proenglishbd.com</p>
              <p><strong>Teacher:</strong> teacher@proenglishbd.com</p>
              <p><strong>Student:</strong> student@proenglishbd.com</p>
              <p className="text-gray-400 mt-1">
                {appMode === "demo" ? "Password: any (demo mode)" : "Use registered passwords"}
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-brand-red-500 font-medium hover:underline">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
