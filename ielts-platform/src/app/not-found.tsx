"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-brand-navy-200">404</h1>
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
