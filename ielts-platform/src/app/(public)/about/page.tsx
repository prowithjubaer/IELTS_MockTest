"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui";
import { Target, Users, Award, Globe, BookOpen, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy-950 to-brand-navy-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">About Pro English BD</h1>
          <p className="text-xl text-gray-300">
            Empowering Bangladeshi IELTS aspirants with the most realistic computer-based mock test experience.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pro English BD was founded with a simple goal: to make high-quality IELTS preparation accessible to every Bangladeshi student. We believe that no one should be held back from achieving their dreams of studying abroad or advancing their career because of limited access to proper test preparation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform provides an authentic IELTS computer-delivered test experience, complete with expert feedback from certified examiners, helping students feel confident and fully prepared on exam day.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Target className="w-8 h-8" />, label: "Realistic Exam", value: "100%" },
                { icon: <Users className="w-8 h-8" />, label: "Students Served", value: "5000+" },
                { icon: <Award className="w-8 h-8" />, label: "Expert Teachers", value: "15+" },
                { icon: <Globe className="w-8 h-8" />, label: "Countries", value: "12+" },
              ].map((stat) => (
                <Card key={stat.label} className="p-6 text-center">
                  <div className="w-14 h-14 bg-brand-navy-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-brand-navy-900">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen className="w-6 h-6" />, title: "Quality Education", description: "We partner with certified IELTS examiners to ensure every piece of feedback meets the highest standards." },
              { icon: <Heart className="w-6 h-6" />, title: "Student-First", description: "Everything we build is designed from the student's perspective, making preparation effective and enjoyable." },
              { icon: <Globe className="w-6 h-6" />, title: "Accessibility", description: "Affordable pricing and free tests ensure that quality IELTS preparation is available to everyone." },
            ].map((value) => (
              <Card key={value.title} className="p-6">
                <div className="w-12 h-12 bg-brand-red-50 rounded-lg flex items-center justify-center text-brand-red-500 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
