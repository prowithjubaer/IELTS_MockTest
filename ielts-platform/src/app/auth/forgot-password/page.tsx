"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-navy-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-500 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <Link href="/auth/login">
              <Button variant="outline" fullWidth>
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 mb-6">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
