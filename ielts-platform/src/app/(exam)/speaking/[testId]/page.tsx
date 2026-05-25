"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_SPEAKING_TEST } from "@/lib/speaking-data";
import { Button } from "@/components/ui";
import { Mic, Clock, FileText, ArrowRight, AlertCircle, Info, Users } from "lucide-react";

export default function SpeakingIntroPage() {
  const params = useParams();
  const router = useRouter();
  const test = DEMO_SPEAKING_TEST;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <span className="font-bold text-brand-navy-900 text-sm">Pro English</span>
              <span className="font-bold text-brand-red-500 text-sm ml-1">BD</span>
            </div>
          </div>
          <span className="text-sm text-gray-500">IELTS Speaking Mock Test</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{test.title}</h1>
                <p className="text-sm text-orange-100">Examiner-Led Speaking Simulation</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{test.duration_minutes} min</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <FileText className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-500">Parts</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Mic className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Users className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">Expert</p>
                <p className="text-xs text-gray-500">Scoring</p>
              </div>
            </div>

            {/* Parts Overview */}
            <div className="space-y-3 mb-8">
              {test.parts.map((part) => (
                <div key={part.id} className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                  <h3 className="font-bold text-orange-900 mb-1">{part.title}</h3>
                  <p className="text-sm text-orange-800">{part.instruction}</p>
                  {part.cue_card && (
                    <p className="text-xs text-orange-600 mt-1">
                      {part.cue_card.preparation_seconds}s preparation + {part.cue_card.speaking_seconds}s speaking
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-600" /> Test Instructions
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>You will need a working <strong>microphone</strong> and <strong>headphones</strong>.</li>
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>The examiner will ask questions through <strong>video</strong>. Listen carefully.</li>
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>You will have a short <strong>thinking time</strong> before recording each answer.</li>
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Your answers will be <strong>recorded</strong> and sent to an expert teacher for evaluation.</li>
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>In Part 2, you have <strong>1 minute</strong> to prepare notes before speaking.</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span>Ensure you are in a <strong>quiet environment</strong> with no interruptions.</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Before You Start</p>
                <p className="text-sm text-orange-700">
                  You will go through a quick device test to check your headphones and microphone are working properly.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => router.push(`/speaking/${params.testId}/device-test`)}>
                Continue to Device Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
