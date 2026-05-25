"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  DEMO_SPEAKING_SUBMISSIONS, DEMO_SPEAKING_TEST,
  SPEAKING_CRITERIA, BAND_OPTIONS, calculateSpeakingBand,
  SpeakingAttemptData, SpeakingRubricScore,
} from "@/lib/speaking-data";
import {
  Mic, Eye, CheckCircle, Clock, User, Play,
  Send, ArrowLeft, MessageSquare, Headphones,
} from "lucide-react";

type View = "list" | "evaluate";

export default function TeacherSpeakingPage() {
  const [view, setView] = useState<View>("list");
  const [selectedSubmission, setSelectedSubmission] = useState<SpeakingAttemptData | null>(null);
  const [scores, setScores] = useState<SpeakingRubricScore[]>(
    SPEAKING_CRITERIA.map(c => ({ criterion: c, band: 0, comment: "", improvement: "" }))
  );
  const [overallFeedback, setOverallFeedback] = useState("");
  const [fluencyNotes, setFluencyNotes] = useState("");
  const [vocabNotes, setVocabNotes] = useState("");
  const [grammarNotes, setGrammarNotes] = useState("");
  const [pronunciationNotes, setPronunciationNotes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [improvementPlan, setImprovementPlan] = useState("");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const submissions = DEMO_SPEAKING_SUBMISSIONS;

  const openEvaluation = (sub: SpeakingAttemptData) => {
    setSelectedSubmission(sub);
    setView("evaluate");
    if (sub.feedback) {
      setScores(sub.feedback.scores);
      setOverallFeedback(sub.feedback.overall_feedback);
      setFluencyNotes(sub.feedback.fluency_notes);
      setVocabNotes(sub.feedback.vocabulary_notes);
      setGrammarNotes(sub.feedback.grammar_notes);
      setPronunciationNotes(sub.feedback.pronunciation_notes);
      setStrengths(sub.feedback.strengths.join("\n"));
      setWeaknesses(sub.feedback.weaknesses.join("\n"));
      setImprovementPlan(sub.feedback.improvement_plan);
    }
  };

  const updateScore = (idx: number, field: keyof SpeakingRubricScore, value: string | number) => {
    const next = [...scores];
    next[idx] = { ...next[idx], [field]: value };
    setScores(next);
  };

  const finalBand = calculateSpeakingBand(scores);

  if (view === "list") {
    return (
      <DashboardLayout title="Speaking Submissions" subtitle="Listen to recordings and evaluate student speaking.">
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card key={sub.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Mic className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sub.student_name}</p>
                    <p className="text-xs text-gray-500">
                      {DEMO_SPEAKING_TEST.title} • {sub.recordings.length} recordings • {Math.round(sub.total_duration_seconds / 60)} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={sub.status === "pending" ? "pending" : "success"}>
                    {sub.status === "pending" ? "Pending" : `Band ${sub.final_band}`}
                  </Badge>
                  <Button variant={sub.status === "pending" ? "primary" : "outline"} size="sm"
                    leftIcon={sub.status === "pending" ? <Headphones className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    onClick={() => openEvaluation(sub)}>
                    {sub.status === "pending" ? "Review" : "View"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  // EVALUATE VIEW
  return (
    <DashboardLayout title="Evaluate Speaking" subtitle={`${selectedSubmission?.student_name} — Speaking Submission`}>
      {showPublishConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Publish Feedback</h3>
            <p className="text-sm text-gray-600 mb-3">Final band: <strong>{finalBand}</strong></p>
            <p className="text-sm text-gray-500 mb-4">The student will see this feedback immediately.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowPublishConfirm(false)}>Cancel</Button>
              <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}
                onClick={() => { setShowPublishConfirm(false); setView("list"); }}>Publish</Button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Submissions
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Recordings */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{selectedSubmission?.student_name}</span>
              <Badge variant="info">{selectedSubmission?.recordings.length} recordings</Badge>
            </div>
            <p className="text-xs text-gray-500">Total speaking: {Math.round((selectedSubmission?.total_duration_seconds || 0) / 60)} min</p>
          </Card>

          {/* Part-by-part recordings */}
          {[1, 2, 3].map((partNum) => {
            const partRecordings = selectedSubmission?.recordings.filter(r => r.part_number === partNum) || [];
            const partData = DEMO_SPEAKING_TEST.parts.find(p => p.part_number === partNum);
            return (
              <Card key={partNum} className="p-5">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">{partNum}</span>
                  {partData?.title}
                </h4>
                <div className="space-y-2">
                  {partRecordings.map((rec, i) => {
                    const question = DEMO_SPEAKING_TEST.parts
                      .flatMap(p => p.questions)
                      .find(q => q.id === rec.question_id);
                    return (
                      <div key={rec.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <button className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                          <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 truncate">{question?.question_text || `Recording ${i + 1}`}</p>
                          <p className="text-xs text-gray-400">{rec.duration_seconds}s</p>
                        </div>
                      </div>
                    );
                  })}
                  {partRecordings.length === 0 && <p className="text-xs text-gray-400">No recordings for this part</p>}
                </div>
                {partNum === 2 && selectedSubmission?.cue_card_notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Student Notes:</p>
                    <p className="text-xs text-gray-600 bg-yellow-50 rounded p-2 whitespace-pre-line">{selectedSubmission.cue_card_notes}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right: Scoring */}
        <div className="space-y-4">
          <Card className="p-5 bg-orange-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 font-medium">Calculated Band</p>
                <p className="text-3xl font-bold text-orange-900">{finalBand || "—"}</p>
              </div>
              <div className="flex gap-3">
                {scores.map(s => (
                  <div key={s.criterion} className="text-center">
                    <p className="text-[10px] text-orange-600 truncate w-12">{s.criterion.split(" ")[0]}</p>
                    <p className="text-sm font-bold text-orange-800">{s.band || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Rubric */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Speaking Rubric</h4>
            <div className="space-y-3">
              {scores.map((score, idx) => (
                <div key={score.criterion} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">{score.criterion}</span>
                    <select value={score.band} onChange={(e) => updateScore(idx, "band", Number(e.target.value))}
                      className="px-2 py-1 border border-gray-200 rounded text-sm bg-white font-bold text-orange-700 w-16">
                      {BAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="Comment..." value={score.comment}
                    onChange={(e) => updateScore(idx, "comment", e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mb-1 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                  <input type="text" placeholder="Improvement..." value={score.improvement}
                    onChange={(e) => updateScore(idx, "improvement", e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>
              ))}
            </div>
          </Card>

          {/* Feedback */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-600" /> Feedback
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Overall Feedback</label>
                <textarea value={overallFeedback} onChange={(e) => setOverallFeedback(e.target.value)}
                  placeholder="General feedback..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mt-1 min-h-[60px] focus:outline-none focus:ring-1 focus:ring-orange-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Strengths</label>
                  <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)}
                    placeholder="One per line..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-1 min-h-[50px] focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Weaknesses</label>
                  <textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)}
                    placeholder="One per line..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-1 min-h-[50px] focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Improvement Plan</label>
                <textarea value={improvementPlan} onChange={(e) => setImprovementPlan(e.target.value)}
                  placeholder="Steps to improve..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-1 min-h-[50px] focus:outline-none focus:ring-1 focus:ring-orange-300" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">Fluency Notes</label>
                  <input type="text" value={fluencyNotes} onChange={(e) => setFluencyNotes(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Vocabulary Notes</label>
                  <input type="text" value={vocabNotes} onChange={(e) => setVocabNotes(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Grammar Notes</label>
                  <input type="text" value={grammarNotes} onChange={(e) => setGrammarNotes(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Pronunciation Notes</label>
                  <input type="text" value={pronunciationNotes} onChange={(e) => setPronunciationNotes(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-orange-300" />
                </div>
              </div>
            </div>
          </Card>

          <Button variant="primary" size="lg" fullWidth leftIcon={<Send className="w-4 h-4" />}
            onClick={() => setShowPublishConfirm(true)}>
            Publish Feedback (Band {finalBand})
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
