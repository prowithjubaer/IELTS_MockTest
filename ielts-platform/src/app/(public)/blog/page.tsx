"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, Badge } from "@/components/ui";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: "1",
      title: "10 Tips to Score Band 8 in IELTS Listening",
      excerpt: "Master these proven strategies to boost your listening score. From prediction techniques to note-taking methods.",
      category: "Listening",
      readTime: "5 min",
      date: "Jan 10, 2024",
      image: null,
    },
    {
      id: "2",
      title: "IELTS Writing Task 2: Opinion Essay Structure",
      excerpt: "Learn the perfect essay structure that examiners love. Clear paragraphing, cohesive devices, and examples.",
      category: "Writing",
      readTime: "8 min",
      date: "Jan 8, 2024",
      image: null,
    },
    {
      id: "3",
      title: "How to Handle True/False/Not Given Questions",
      excerpt: "The most confusing IELTS Reading question type explained simply with real examples and practice tips.",
      category: "Reading",
      readTime: "6 min",
      date: "Jan 5, 2024",
      image: null,
    },
    {
      id: "4",
      title: "Speaking Part 2: How to Never Run Out of Ideas",
      excerpt: "Learn the STAR method and topic expansion techniques to speak fluently for the full 2 minutes.",
      category: "Speaking",
      readTime: "4 min",
      date: "Jan 3, 2024",
      image: null,
    },
    {
      id: "5",
      title: "IELTS Band Score Calculator: How It Works",
      excerpt: "Understand how raw scores convert to band scores for each module and the overall band calculation.",
      category: "General",
      readTime: "3 min",
      date: "Dec 28, 2023",
      image: null,
    },
    {
      id: "6",
      title: "Computer-Based vs Paper-Based IELTS: Which to Choose?",
      excerpt: "A comprehensive comparison to help you decide which format suits your preparation style better.",
      category: "General",
      readTime: "7 min",
      date: "Dec 25, 2023",
      image: null,
    },
  ];

  const categoryColors: Record<string, string> = {
    Listening: "bg-blue-100 text-blue-800",
    Reading: "bg-green-100 text-green-800",
    Writing: "bg-purple-100 text-purple-800",
    Speaking: "bg-orange-100 text-orange-800",
    General: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">IELTS Tips & Blog</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Expert tips, strategies, and guides to help you achieve your target IELTS band score.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} hover className="overflow-hidden flex flex-col">
                <div className="h-40 bg-gradient-to-br from-brand-navy-100 to-brand-navy-50 flex items-center justify-center">
                  <span className="text-4xl font-display font-bold text-brand-navy-200">IELTS</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-500 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="text-sm font-medium text-brand-red-500 flex items-center gap-1 hover:underline cursor-pointer">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
