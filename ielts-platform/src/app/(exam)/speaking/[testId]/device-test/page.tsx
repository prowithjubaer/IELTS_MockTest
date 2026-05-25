"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Headphones, Mic, Play, CheckCircle, AlertCircle, ArrowRight, Volume2, Square } from "lucide-react";

type Step = "headphone" | "microphone" | "ready";

export default function DeviceTestPage() {
  const params = useParams();
  const router = useRouter();
  const [step, setStep] = useState<Step>("headphone");
  const [audioChecked, setAudioChecked] = useState(false);
  const [isPlayingCheck, setIsPlayingCheck] = useState(false);
  const [micPermission, setMicPermission] = useState<"idle" | "granted" | "denied">("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlayback, setIsPlayback] = useState(false);
  const [micConfirmed, setMicConfirmed] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayCheck = () => {
    setIsPlayingCheck(true);
    setTimeout(() => { setIsPlayingCheck(false); setAudioChecked(true); }, 2000);
  };

  const handleRequestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicPermission("granted");
    } catch {
      setMicPermission("denied");
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 5) { handleStopRecording(); return 5; }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setHasRecorded(true);
  };

  const handlePlayback = () => {
    setIsPlayback(true);
    setTimeout(() => { setIsPlayback(false); setMicConfirmed(true); }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-brand-navy-900 text-sm">Device Test</span>
          </div>
          <div className="flex items-center gap-2">
            {["headphone", "microphone", "ready"].map((s, i) => (
              <div key={s} className={cn("w-3 h-3 rounded-full transition-colors",
                step === s ? "bg-orange-500" : i < ["headphone","microphone","ready"].indexOf(step) ? "bg-green-500" : "bg-gray-300")} />
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Headphone Check */}
        {step === "headphone" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Headphone Check</h2>
            <p className="text-gray-500 mb-6">Click the button below to play a short audio sample. Make sure you can hear it clearly.</p>

            <button onClick={handlePlayCheck} disabled={isPlayingCheck}
              className="w-20 h-20 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg hover:shadow-xl active:scale-95 mb-4">
              {isPlayingCheck ? (
                <div className="flex gap-1"><span className="w-1 h-4 bg-white rounded-full animate-pulse" /><span className="w-1 h-6 bg-white rounded-full animate-pulse" style={{animationDelay:"75ms"}} /><span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{animationDelay:"150ms"}} /></div>
              ) : (
                <Volume2 className="w-8 h-8 text-white" />
              )}
            </button>
            <p className="text-sm text-gray-500 mb-6">{isPlayingCheck ? "Playing..." : "Click to play sample audio"}</p>

            {audioChecked && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Audio working!</span>
              </div>
            )}

            <label className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer mb-6">
              <input type="checkbox" checked={audioChecked} onChange={(e) => setAudioChecked(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
              <span className="text-sm text-gray-700">I can hear the audio clearly</span>
            </label>

            <Button variant="primary" size="lg" fullWidth disabled={!audioChecked}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => setStep("microphone")}>
              Continue to Mic Check
            </Button>
          </div>
        )}

        {/* Microphone Check */}
        {step === "microphone" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Microphone Check</h2>
            <p className="text-gray-500 mb-6">Let&apos;s make sure your microphone is working. Record yourself saying a short sentence.</p>

            {micPermission === "idle" && (
              <div className="mb-6">
                <Button variant="secondary" size="lg" leftIcon={<Mic className="w-5 h-5" />} onClick={handleRequestMic}>
                  Allow Microphone Access
                </Button>
              </div>
            )}

            {micPermission === "denied" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-800">Microphone Access Denied</p>
                  <p className="text-sm text-red-700">Please allow microphone permission in your browser settings and reload this page.</p>
                </div>
              </div>
            )}

            {micPermission === "granted" && (
              <>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-3">Read aloud:</p>
                  <p className="text-lg font-medium text-gray-900 italic">&ldquo;I love English. My English is improving every day.&rdquo;</p>
                </div>

                {!hasRecorded && (
                  <button onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg mb-4",
                      isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-orange-500 hover:bg-orange-600")}>
                    {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                  </button>
                )}

                {isRecording && (
                  <p className="text-sm text-red-600 font-mono font-bold mb-4">Recording... {recordingTime}s</p>
                )}

                {hasRecorded && !micConfirmed && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Recording complete!</span>
                    </div>
                    <Button variant="outline" leftIcon={<Play className="w-4 h-4" />}
                      onClick={handlePlayback} isLoading={isPlayback}>
                      {isPlayback ? "Playing..." : "Play Recording"}
                    </Button>
                  </div>
                )}

                {micConfirmed && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center justify-center gap-2 animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Microphone is working!</span>
                  </div>
                )}
              </>
            )}

            {micPermission === "granted" && (
              <label className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer mb-6">
                <input type="checkbox" checked={micConfirmed} onChange={(e) => setMicConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="text-sm text-gray-700">My microphone is working correctly</span>
              </label>
            )}

            <Button variant="primary" size="lg" fullWidth disabled={!micConfirmed}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => setStep("ready")}>
              Continue
            </Button>
          </div>
        )}

        {/* Ready */}
        {step === "ready" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re Ready!</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Your headphones and microphone are working. The examiner will ask questions through video. 
              Listen carefully, then record your answers.
            </p>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 max-w-sm mx-auto mb-8">
              <div className="space-y-2 text-sm text-left text-gray-700">
                <div className="flex justify-between"><span>Duration:</span><span className="font-medium">~13 minutes</span></div>
                <div className="flex justify-between"><span>Parts:</span><span className="font-medium">3</span></div>
                <div className="flex justify-between"><span>Questions:</span><span className="font-medium">12</span></div>
                <div className="flex justify-between"><span>Scoring:</span><span className="font-medium text-orange-700">Expert Teacher</span></div>
              </div>
            </div>

            <Button variant="primary" size="xl" rightIcon={<Mic className="w-5 h-5" />}
              onClick={() => router.push(`/speaking/${params.testId}/exam`)}>
              Start Speaking Test
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
