import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Pro English BD - IELTS Computer-Based Mock Test Platform",
  description:
    "Bangladesh's premier IELTS computer-based mock test platform. Practice Listening, Reading, Writing, and Speaking like the real exam. Get expert feedback and achieve your target band score.",
  keywords: [
    "IELTS",
    "mock test",
    "IELTS practice",
    "computer-based IELTS",
    "Bangladesh IELTS",
    "IELTS listening",
    "IELTS reading",
    "IELTS writing",
    "IELTS speaking",
    "band score",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
