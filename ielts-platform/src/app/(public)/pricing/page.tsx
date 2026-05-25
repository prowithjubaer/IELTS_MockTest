"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, Badge, Button } from "@/components/ui";
import { CheckCircle, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Get started with basic mock tests",
      price: "0",
      currency: "৳",
      period: "Forever",
      features: [
        { text: "2 Free Listening Tests", included: true },
        { text: "2 Free Reading Tests", included: true },
        { text: "Auto Scoring (L&R)", included: true },
        { text: "Basic Dashboard", included: true },
        { text: "Writing Tests", included: false },
        { text: "Speaking Tests", included: false },
        { text: "Expert Feedback", included: false },
        { text: "Full Mock Tests", included: false },
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Premium",
      description: "Full access to all modules and feedback",
      price: "499",
      currency: "৳",
      period: "/month",
      features: [
        { text: "Unlimited Listening Tests", included: true },
        { text: "Unlimited Reading Tests", included: true },
        { text: "Writing Tests with Expert Feedback", included: true },
        { text: "Speaking Tests with Expert Feedback", included: true },
        { text: "Full IELTS Mock Tests", included: true },
        { text: "Auto + Expert Scoring", included: true },
        { text: "Band Score History & Analytics", included: true },
        { text: "Priority Feedback (24-48 hrs)", included: true },
      ],
      cta: "Get Premium",
      popular: true,
    },
    {
      name: "VIP Mentorship",
      description: "1-on-1 guidance from IELTS experts",
      price: "1,999",
      currency: "৳",
      period: "/month",
      features: [
        { text: "Everything in Premium", included: true },
        { text: "1-on-1 Teacher Sessions", included: true },
        { text: "Weekly Speaking Practice", included: true },
        { text: "Personalized Study Plan", included: true },
        { text: "WhatsApp Support Group", included: true },
        { text: "Same-day Feedback", included: true },
        { text: "Mock Interview Practice", included: true },
        { text: "Score Guarantee Program", included: true },
      ],
      cta: "Join VIP",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Choose the plan that fits your IELTS preparation needs. Start free, upgrade when ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative p-8 flex flex-col ${plan.popular ? "border-2 border-brand-red-500 shadow-xl scale-105 z-10" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="paid" size="md" className="px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">{plan.currency}{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/register">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    fullWidth
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-500 mb-6">
              Contact us on WhatsApp for instant support or check our FAQ section.
            </p>
            <Link href="/contact">
              <Button variant="secondary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
