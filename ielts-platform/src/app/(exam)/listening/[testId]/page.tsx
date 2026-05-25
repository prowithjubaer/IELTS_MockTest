"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DEMO_LISTENING_TEST } from "@/lib/listening-data";
import { Button } from "@/components/ui";
import {
  Headphones,
  Clock,
  FileText,
  CheckCircle,
  Volume2,
  Play,
  ArrowRight,
  AlertCircle,
  Info,
} from "lucide-react";

type Phase = "intro" | "audio-check" | "ready";

export default function ListeningIntroPage() {
  const params = useParams();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [audioChecked, setAudioChecked] = useState(false);
  const [isPlayingCheck, setIsPlayingCheck] = useState(false);

  const test = DEMO_LISTENING_TEST;

  const handlePlayCheckAudio = () => {
    setIsPlayingCheck(true);
    // Simulate playing a short check audio
    setTimeout(() => {
      setIsPlayingCheck(false);
      setAudioChecked(true);
    }, 2000);
  };

  const handleStartTest = () => {
    router.push(`/listening/${params.testId}/exam`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <span className="text-sm text-gray-500">IELTS Listening Mock Test</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Phase: Intro */}
        {phase === "intro" && (
          <div className="animate-fade-in">
            {/* Test Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-brand-navy-900 to-brand-navy-800 px-8 py-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{test.title}</h1>
                    <p className="text-sm text-gray-300">Computer-Based Mock Test</p>
                  </div>
                </div>
              </div>

              {/* Test Details */}
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-brand-navy-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{test.duration_minutes} min</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <FileText className="w-5 h-5 text-brand-navy-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">40</p>
                    <p className="text-xs text-gray-500">Questions</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Headphones className="w-5 h-5 text-brand-navy-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">4</p>
                    <p className="text-xs text-gray-500">Parts</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">Auto</p>
                    <p className="text-xs text-gray-500">Scoring</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-brand-navy-600" />
                    Test Instructions
                  </h2>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        You will listen to four recordings and answer questions based on what you hear.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        The recordings will be played <strong>ONCE only</strong>. You cannot pause, rewind, or replay.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        The test has four parts with 10 questions each (40 total).
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        Write your answers as you listen. Pay attention to spelling.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        Your answers will be auto-saved every few seconds.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <strong>Do not close or refresh the browser</strong> during the test.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Important Warning */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-800">Important</p>
                    <p className="text-sm text-orange-700">
                      This is a timed test. Once the audio starts, it cannot be stopped. 
                      Make sure you are in a quiet environment with working headphones.
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => setPhase("audio-check")}
                  >
                    Continue to Audio Check
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Audio Check */}
        {phase === "audio-check" && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-navy-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="w-8 h-8 text-brand-navy-900" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Audio & Headphone Check</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Before starting the test, please check that your audio is working properly.
                  Click the button below to play a short audio sample.
                </p>
              </div>

              {/* Audio Check Area */}
              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handlePlayCheckAudio}
                      disabled={isPlayingCheck}
                      className="w-20 h-20 bg-brand-red-500 hover:bg-brand-red-600 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                      {isPlayingCheck ? (
                        <div className="flex gap-1">
                          <span className="w-1 h-4 bg-white rounded-full animate-pulse" />
                          <span className="w-1 h-6 bg-white rounded-full animate-pulse delay-75" />
                          <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-150" />
                        </div>
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>
                    <p className="text-sm text-gray-600">
                      {isPlayingCheck ? "Playing sample audio..." : "Click to play sample audio"}
                    </p>
                  </div>
                </div>

                {/* Confirmation */}
                {audioChecked && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800 font-medium">Audio is working correctly!</p>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={audioChecked}
                      onChange={(e) => setAudioChecked(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-brand-navy-900 focus:ring-brand-navy-500"
                    />
                    <span className="text-sm text-gray-700">I can hear the audio clearly</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <Button variant="ghost" onClick={() => setPhase("intro")}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!audioChecked}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => setPhase("ready")}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Ready to Start */}
        {phase === "ready" && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start!</h2>
              <p className="text-gray-500 max-w-lg mx-auto mb-8">
                You are about to begin the IELTS Listening test. Once you click Start, the audio will begin playing
                and cannot be paused or replayed. Make sure you are ready.
              </p>

              {/* Quick Summary */}
              <div className="bg-brand-navy-50 rounded-xl p-5 max-w-sm mx-auto mb-8">
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{test.duration_minutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium text-gray-900">40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parts:</span>
                    <span className="font-medium text-gray-900">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Audio:</span>
                    <span className="font-medium text-red-600">Plays once only</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="ghost" onClick={() => setPhase("audio-check")}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="xl"
                  rightIcon={<Headphones className="w-5 h-5" />}
                  onClick={handleStartTest}
                >
                  Start Listening Test
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
