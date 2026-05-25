"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button, Input } from "@/components/ui";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(name, email, password);
      router.push("/student");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

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
          <h1 className="text-3xl font-display font-bold mb-4">
            Start Your IELTS Journey
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Create your free account and take your first mock test today. No credit card required.
          </p>
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

          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Start practicing IELTS for free</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jubayer Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

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
              placeholder="Minimum 6 characters"
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 mt-0.5" required />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-brand-red-500 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-brand-red-500 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-red-500 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
