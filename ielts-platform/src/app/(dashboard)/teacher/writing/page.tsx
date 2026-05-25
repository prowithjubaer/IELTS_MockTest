"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  DEMO_WRITING_SUBMISSIONS, DEMO_WRITING_TEST,
  WRITING_TASK1_CRITERIA, WRITING_TASK2_CRITERIA, BAND_OPTIONS,
  calculateTaskBand, calculateOverallWritingBand,
  WritingAttemptData, WritingRubricScore,
} from "@/lib/writing-data";
import {
  Pencil, Eye, CheckCircle, Clock, User, FileText,
  Star, AlertCircle, Send, ArrowLeft, MessageSquare,
} from "lucide-react";

type View = "list" | "evaluate";

export default function TeacherWritingPage() {
  const [view, setView] = useState<View>("list");
  const [selectedSubmission, setSelectedSubmission] = useState<WritingAttemptData | null>(null);
  const [task1Scores, setTask1Scores] = useState<WritingRubricScore[]>(
    WRITING_TASK1_CRITERIA.map(c => ({ criterion: c, band: 0, comment: "", improvement: "" }))
  );
  const [task2Scores, setTask2Scores] = useState<WritingRubricScore[]>(
    WRITING_TASK2_CRITERIA.map(c => ({ criterion: c, band: 0, comment: "", improvement: "" }))
  );
  const [overallFeedback, setOverallFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [improvementPlan, setImprovementPlan] = useState("");
  const [grammarNotes, setGrammarNotes] = useState("");
  const [vocabNotes, setVocabNotes] = useState("");
  const [coherenceNotes, setCoherenceNotes] = useState("");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const submissions = DEMO_WRITING_SUBMISSIONS;

  const openEvaluation = (sub: WritingAttemptData) => {
    setSelectedSubmission(sub);
    setView("evaluate");
    // Pre-fill if already checked
    if (sub.feedback) {
      setTask1Scores(sub.feedback.task1_scores);
      setTask2Scores(sub.feedback.task2_scores);
      setOverallFeedback(sub.feedback.overall_feedback);
      setStrengths(sub.feedback.strengths.join("\n"));
      setWeaknesses(sub.feedback.weaknesses.join("\n"));
      setImprovementPlan(sub.feedback.improvement_plan);
      setGrammarNotes(sub.feedback.grammar_notes);
      setVocabNotes(sub.feedback.vocabulary_notes);
      setCoherenceNotes(sub.feedback.coherence_notes);
    }
  };

  const updateTask1Score = (idx: number, field: keyof WritingRubricScore, value: string | number) => {
    const next = [...task1Scores];
    next[idx] = { ...next[idx], [field]: value };
    setTask1Scores(next);
  };

  const updateTask2Score = (idx: number, field: keyof WritingRubricScore, value: string | number) => {
    const next = [...task2Scores];
    next[idx] = { ...next[idx], [field]: value };
    setTask2Scores(next);
  };

  const task1Band = calculateTaskBand(task1Scores);
  const task2Band = calculateTaskBand(task2Scores);
  const finalBand = calculateOverallWritingBand(task1Band, task2Band);

  // LIST VIEW
  if (view === "list") {
    return (
      <DashboardLayout title="Writing Submissions" subtitle="Review and score student writing submissions.">
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card key={sub.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sub.student_name}</p>
                    <p className="text-xs text-gray-500">
                      {DEMO_WRITING_TEST.title} • Submitted {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500">T1: {sub.task1_word_count}w • T2: {sub.task2_word_count}w</p>
                  </div>
                  <Badge variant={sub.status === "pending" ? "pending" : "success"}>
                    {sub.status === "pending" ? "Pending" : `Band ${sub.final_band}`}
                  </Badge>
                  <Button variant={sub.status === "pending" ? "primary" : "outline"} size="sm"
                    leftIcon={sub.status === "pending" ? <Eye className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
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
    <DashboardLayout title="Evaluate Writing" subtitle={`${selectedSubmission?.student_name} — Writing Submission`}>
      {/* Publish Confirm */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Publish Feedback</h3>
            <p className="text-sm text-gray-600 mb-3">
              Final band: <strong>{finalBand}</strong> (Task 1: {task1Band}, Task 2: {task2Band})
            </p>
            <p className="text-sm text-gray-500 mb-4">The student will be able to see this feedback immediately.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowPublishConfirm(false)}>Cancel</Button>
              <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}
                onClick={() => { setShowPublishConfirm(false); setView("list"); }}>
                Publish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Submissions
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Student Answers */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{selectedSubmission?.student_name}</span>
              <Badge variant="info">{DEMO_WRITING_TEST.test_type}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Task 1</p>
                <p className={cn("font-bold", (selectedSubmission?.task1_word_count || 0) >= 150 ? "text-green-600" : "text-orange-600")}>
                  {selectedSubmission?.task1_word_count} words
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Task 2</p>
                <p className={cn("font-bold", (selectedSubmission?.task2_word_count || 0) >= 250 ? "text-green-600" : "text-orange-600")}>
                  {selectedSubmission?.task2_word_count} words
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Task 1 Answer
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedSubmission?.task1_answer || "(No answer)"}
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Task 2 Answer
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedSubmission?.task2_answer || "(No answer)"}
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Scoring Form */}
        <div className="space-y-4">
          {/* Band Summary */}
          <Card className="p-5 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium">Calculated Band</p>
                <p className="text-3xl font-bold text-purple-900">{finalBand || "—"}</p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-xs text-purple-600">Task 1</p>
                  <p className="text-lg font-bold text-purple-800">{task1Band || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600">Task 2</p>
                  <p className="text-lg font-bold text-purple-800">{task2Band || "—"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Task 1 Rubric */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Task 1 Scoring</h4>
            <div className="space-y-3">
              {task1Scores.map((score, idx) => (
                <div key={score.criterion} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">{score.criterion}</span>
                    <select value={score.band} onChange={(e) => updateTask1Score(idx, "band", Number(e.target.value))}
                      className="px-2 py-1 border border-gray-200 rounded text-sm bg-white font-bold text-purple-700 w-16">
                      {BAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="Comment..." value={score.comment}
                    onChange={(e) => updateTask1Score(idx, "comment", e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mb-1 focus:outline-none focus:ring-1 focus:ring-purple-300" />
                  <input type="text" placeholder="Improvement suggestion..." value={score.improvement}
                    onChange={(e) => updateTask1Score(idx, "improvement", e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-300" />
                </div>
              ))}
            </div>
          </Card>

          {/* Task 2 Rubric */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Task 2 Scoring</h4>
            <div className="space-y-3">
              {task2Scores.map((score, idx) => (
                <div key={score.criterion} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">{score.criterion}</span>
                    <select value={score.band} onChange={(e) => updateTask2Score(idx, "band", Number(e.target.value))}
                      className="px-2 py-1 border border-gray-200 rounded text-sm bg-white font-bold text-purple-700 w-16">
                      {BAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="Comment..." value={score.comment}
                    onChange={(e) => updateTask2Score(idx, "comment", e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mb-1 focus:outline-none focus:ring-1 focus:ring-purple-300" />
                  <input type="text" placeholder="Improvement suggestion..." value={score.improvement}
                    onChange={(e) => updateTask2Score(idx, "improvement", e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-300" />
                </div>
              ))}
            </div>
          </Card>

          {/* Feedback Fields */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" /> Overall Feedback
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Overall Comment</label>
                <textarea value={overallFeedback} onChange={(e) => setOverallFeedback(e.target.value)}
                  placeholder="General feedback about the student's writing..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mt-1 min-h-[60px] focus:outline-none focus:ring-1 focus:ring-purple-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Strengths (one per line)</label>
                  <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)}
                    placeholder="Good points..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-1 min-h-[60px] focus:outline-none focus:ring-1 focus:ring-purple-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Weaknesses (one per line)</label>
                  <textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)}
                    placeholder="Areas to improve..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-1 min-h-[60px] focus:outline-none focus:ring-1 focus:ring-purple-300" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Improvement Plan</label>
                <textarea value={improvementPlan} onChange={(e) => setImprovementPlan(e.target.value)}
                  placeholder="Step-by-step plan..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-1 min-h-[60px] focus:outline-none focus:ring-1 focus:ring-purple-300" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">Grammar</label>
                  <input type="text" value={grammarNotes} onChange={(e) => setGrammarNotes(e.target.value)}
                    placeholder="Notes..." className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-purple-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Vocabulary</label>
                  <input type="text" value={vocabNotes} onChange={(e) => setVocabNotes(e.target.value)}
                    placeholder="Notes..." className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-purple-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Coherence</label>
                  <input type="text" value={coherenceNotes} onChange={(e) => setCoherenceNotes(e.target.value)}
                    placeholder="Notes..." className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-purple-300" />
                </div>
              </div>
            </div>
          </Card>

          {/* Publish Button */}
          <Button variant="primary" size="lg" fullWidth leftIcon={<Send className="w-4 h-4" />}
            onClick={() => setShowPublishConfirm(true)}>
            Publish Feedback (Band {finalBand})
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
