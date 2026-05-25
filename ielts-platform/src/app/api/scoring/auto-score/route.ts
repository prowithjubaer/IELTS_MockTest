/**
 * Auto-scoring API Route
 * Uses service role client to read answer keys (bypasses RLS)
 * Then scores the student's responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { checkAnswer, rawScoreToBand, listeningBandTable, readingAcademicBandTable } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { attemptId, module, responses } = await request.json();

    if (!attemptId || !module || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['listening', 'reading'].includes(module)) {
      return NextResponse.json({ error: 'Auto-scoring only for listening/reading' }, { status: 400 });
    }

    // Verify user is authenticated
    const serverClient = await getSupabaseServerClient();
    if (!serverClient) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { data: { user } } = await serverClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to read answer keys
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Admin client not configured' }, { status: 500 });
    }

    // Get answer keys for the test
    const answerKeyTable = module === 'listening' ? 'listening_answer_keys' : 'reading_answer_keys';
    const { data: answerKeysRaw, error: akError } = await adminClient
      .from(answerKeyTable as 'listening_answer_keys')
      .select('question_id, correct_answer, accepted_alternatives, case_sensitive, ignore_spaces');

    if (akError) {
      return NextResponse.json({ error: 'Failed to fetch answer keys' }, { status: 500 });
    }

    const answerKeys = answerKeysRaw as { question_id: string; correct_answer: string; accepted_alternatives: string[] | null; case_sensitive: boolean | null; ignore_spaces: boolean | null }[] | null;


    // Score each response
    let rawScore = 0;
    const totalPossible = answerKeys?.length || 40;

    for (const key of (answerKeys || [])) {
      const studentAnswer = responses[key.question_id] || '';
      if (!studentAnswer.trim()) continue;

      const isCorrect = checkAnswer(
        studentAnswer,
        key.correct_answer,
        key.accepted_alternatives || [],
        key.case_sensitive || false,
        key.ignore_spaces !== false
      );

      if (isCorrect) rawScore++;
    }

    // Convert raw score to band
    const bandTable = module === 'listening' ? listeningBandTable : readingAcademicBandTable;
    const bandScore = rawScoreToBand(rawScore, bandTable);

    // Save score to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: score, error: scoreError } = await (adminClient as any)
      .from('scores')
      .insert({
        attempt_id: attemptId,
        module,
        raw_score: rawScore,
        total_possible: totalPossible,
        band_score: bandScore,
        scored_by: 'auto',
      })
      .select()
      .single();

    if (scoreError) {
      return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }

    // Update attempt status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('attempts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    return NextResponse.json({
      score,
      rawScore,
      totalPossible,
      bandScore,
    });
  } catch (error) {
    console.error('Auto-score error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
