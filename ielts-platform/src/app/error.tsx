"use client";

import React from "react";
import { Button } from "@/components/ui";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
          Something Went Wrong
        </h2>
        <p className="text-gray-500 mb-2">
          An unexpected error occurred. Please try again.
        </p>
        {error.message && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3 mb-6 font-mono">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={reset}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
