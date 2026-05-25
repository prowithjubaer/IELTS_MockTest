"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button, Card, Badge } from "@/components/ui";
import {
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  Monitor,
  Clock,
  Award,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Target,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="info" size="md" className="mb-4">
                🇧🇩 Bangladesh&apos;s #1 IELTS Mock Test Platform
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Practice IELTS Like the{" "}
                <span className="text-brand-red-400">Real Exam</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
                Experience authentic computer-delivered IELTS mock tests with expert feedback.
                Boost your band score with our premium exam simulation platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/tests">
                  <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Start Free Mock Test
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-brand-navy-900">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="flex items-center gap-8 mt-12">
                <div>
                  <p className="text-2xl font-bold">5000+</p>
                  <p className="text-sm text-gray-400">Students</p>
                </div>
                <div className="w-px h-10 bg-gray-600" />
                <div>
                  <p className="text-2xl font-bold">200+</p>
                  <p className="text-sm text-gray-400">Mock Tests</p>
                </div>
                <div className="w-px h-10 bg-gray-600" />
                <div>
                  <p className="text-2xl font-bold">7.5+</p>
                  <p className="text-sm text-gray-400">Avg Band</p>
                </div>
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className="hidden lg:block relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="bg-white rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                    <div className="w-8 h-8 bg-brand-navy-900 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">IELTS Listening Test</span>
                    <span className="ml-auto text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded">29:45</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-800 font-medium">Part 1: Questions 1–10</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                      <div className="w-8 h-8 bg-brand-red-500 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div className="h-full w-2/3 bg-brand-navy-900 rounded-full" />
                      </div>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-brand-navy-900 text-white rounded-full flex items-center justify-center text-xs">{i}</span>
                        <div className="flex-1 h-8 bg-gray-100 rounded border border-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              All 4 IELTS Modules
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Practice each module individually or take a full mock test. Our platform simulates the exact computer-delivered IELTS experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Headphones className="w-8 h-8" />,
                title: "Listening",
                description: "4 parts, 40 questions. Audio plays once. Real exam conditions.",
                duration: "30 min",
                color: "text-blue-600 bg-blue-100",
                href: "/tests?module=listening",
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Reading",
                description: "3 passages, 40 questions. Split-screen interface.",
                duration: "60 min",
                color: "text-green-600 bg-green-100",
                href: "/tests?module=reading",
              },
              {
                icon: <Pencil className="w-8 h-8" />,
                title: "Writing",
                description: "Task 1 & Task 2. Live word count. Expert feedback.",
                duration: "60 min",
                color: "text-purple-600 bg-purple-100",
                href: "/tests?module=writing",
              },
              {
                icon: <Mic className="w-8 h-8" />,
                title: "Speaking",
                description: "3 parts. Video questions. Record your answers.",
                duration: "14 min",
                color: "text-orange-600 bg-orange-100",
                href: "/tests?module=speaking",
              },
            ].map((module) => (
              <Link key={module.title} href={module.href}>
                <Card hover className="h-full p-6">
                  <div className={`w-14 h-14 rounded-xl ${module.color} flex items-center justify-center mb-4`}>
                    {module.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{module.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {module.duration}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-6">
                Real Exam Experience on Your Computer
              </h2>
              <p className="text-gray-500 mb-8">
                Our platform replicates the exact interface of the IELTS computer-delivered test,
                so you feel completely prepared on exam day.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Monitor className="w-5 h-5" />, text: "Exact computer-delivered IELTS interface" },
                  { icon: <Clock className="w-5 h-5" />, text: "Real-time countdown timer" },
                  { icon: <Shield className="w-5 h-5" />, text: "Anti-cheat exam environment" },
                  { icon: <Zap className="w-5 h-5" />, text: "Instant auto-scoring for L&R" },
                  { icon: <Target className="w-5 h-5" />, text: "Expert band scoring for W&S" },
                  { icon: <Award className="w-5 h-5" />, text: "Detailed performance analytics" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-navy-50 rounded-lg flex items-center justify-center text-brand-navy-900">
                      {feature.icon}
                    </div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-semibold">Reading Test - Passage 1</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-mono">45:23</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed h-32 overflow-hidden">
                    <p className="font-semibold mb-1">Paragraph A</p>
                    The development of writing systems has been one of humanity&apos;s greatest achievements...
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700">Questions 1-5</p>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px]">{i}</span>
                        <div className="flex-1 h-6 bg-green-50 rounded border border-green-200 flex items-center px-2 text-xs text-green-800">
                          {i === 1 ? "TRUE" : i === 2 ? "FALSE" : "NOT GIVEN"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Feedback */}
      <section className="py-20 bg-brand-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Get Expert Feedback
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Certified IELTS examiners evaluate your Writing and Speaking, providing detailed band scores and improvement suggestions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Writing Feedback",
                description: "Criterion-wise band score, detailed comments, and improvement tips for Task 1 & 2.",
                icon: <Pencil className="w-6 h-6" />,
              },
              {
                title: "Speaking Feedback",
                description: "Pronunciation, fluency, grammar, and vocabulary assessment with audio review.",
                icon: <Mic className="w-6 h-6" />,
              },
              {
                title: "Improvement Plan",
                description: "Personalized study plan based on your weaknesses to reach your target band.",
                icon: <Target className="w-6 h-6" />,
              },
            ].map((item) => (
              <div key={item.title} className="bg-brand-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-brand-navy-700">
                <div className="w-12 h-12 bg-brand-red-500 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-gray-500">Start free, upgrade when you need expert feedback.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "0",
                features: ["2 Free Mock Tests", "Auto L&R Scoring", "Basic Dashboard", "Limited Attempts"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Premium",
                price: "499",
                currency: "৳",
                period: "/month",
                features: ["Unlimited Mock Tests", "All 4 Modules", "Expert W&S Feedback", "Band Score History", "Priority Support"],
                cta: "Start Premium",
                popular: true,
              },
              {
                name: "VIP Mentorship",
                price: "1999",
                currency: "৳",
                period: "/month",
                features: ["Everything in Premium", "1-on-1 Teacher Support", "Weekly Speaking Sessions", "Personalized Study Plan", "WhatsApp Group"],
                cta: "Join VIP",
                popular: false,
              },
            ].map((plan) => (
              <Card key={plan.name} className={`relative p-6 ${plan.popular ? "border-2 border-brand-red-500 shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="paid" size="md">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.currency || ""}{plan.price}
                  </span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  fullWidth
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is this exactly like the real IELTS computer-delivered test?",
                a: "Yes! Our platform replicates the exact interface, timing, and question types of the official IELTS computer-delivered test.",
              },
              {
                q: "How is Writing and Speaking scored?",
                a: "Writing and Speaking are manually evaluated by certified IELTS examiners using the official IELTS band descriptors and rubrics.",
              },
              {
                q: "Can I retake a test?",
                a: "Yes, depending on your plan. Free users get limited attempts, while Premium and VIP users get unlimited attempts.",
              },
              {
                q: "How quickly will I get my Writing/Speaking feedback?",
                a: "Writing and Speaking feedback is typically provided within 24-48 hours by our expert examiners.",
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-red-500 to-brand-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            Ready to Ace Your IELTS?
          </h2>
          <p className="text-red-100 mb-8 text-lg">
            Join 5000+ students who improved their band score with Pro English BD.
          </p>
          <Link href="/auth/register">
            <Button
              variant="secondary"
              size="xl"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Your First Mock Test — Free
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
