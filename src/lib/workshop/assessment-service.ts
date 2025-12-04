/**
 * Assessment Service for Vita Workshop
 * Handles quiz management, scoring, and recommendations
 */

import { prisma } from '../prisma';
import type { WorkshopAssessment, WorkshopAssessmentResult } from '@prisma/client';

export interface Question {
  id: string;
  text: string;
  category: string;
  options: string[];
  correctAnswer: number;
  ageMin?: number;
  ageMax?: number;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  childId: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
}

export interface AnswerFeedback {
  isCorrect: boolean;
  message: string;
  correctAnswer?: string;
}

export interface CategoryBreakdown {
  category: string;
  score: number;
  questionCount: number;
}

// ============ ASSESSMENT OPERATIONS ============

/**
 * Start an assessment
 */
export async function startAssessment(
  childId: string,
  assessmentId: string,
  childAge?: number
): Promise<AssessmentAttempt> {
  const assessment = await prisma.workshopAssessment.findUnique({
    where: { id: assessmentId },
  });

  if (!assessment) {
    throw new Error(`Assessment not found: ${assessmentId}`);
  }

  const questions: Question[] = JSON.parse(assessment.questions);

  // Filter by age if provided
  let filteredQuestions = questions;
  if (childAge !== undefined) {
    filteredQuestions = questions.filter(
      (q) =>
        (!q.ageMin || q.ageMin <= childAge) &&
        (!q.ageMax || q.ageMax >= childAge)
    );
  }

  // Randomize question order
  const randomized = [...filteredQuestions].sort(() => Math.random() - 0.5);

  return {
    id: `attempt_${Date.now()}`,
    assessmentId,
    childId,
    questions: randomized,
    currentQuestionIndex: 0,
    answers: {},
  };
}

/**
 * Submit an answer
 */
export function submitAnswer(
  attempt: AssessmentAttempt,
  questionId: string,
  answerIndex: number
): AnswerFeedback {
  const question = attempt.questions.find((q) => q.id === questionId);

  if (!question) {
    throw new Error(`Question not found: ${questionId}`);
  }

  const isCorrect = answerIndex === question.correctAnswer;

  attempt.answers[questionId] = answerIndex;

  return {
    isCorrect,
    message: isCorrect
      ? 'Correct! Great job!'
      : `Incorrect. The correct answer is: ${question.options[question.correctAnswer]}`,
    correctAnswer: question.options[question.correctAnswer],
  };
}

/**
 * Complete an assessment
 */
export async function completeAssessment(
  childId: string,
  assessmentId: string,
  attempt: AssessmentAttempt
): Promise<WorkshopAssessmentResult> {
  // Calculate score
  let correctCount = 0;
  const categoryScores: Record<string, { correct: number; total: number }> = {};

  for (const question of attempt.questions) {
    const answerIndex = attempt.answers[question.id];
    const isCorrect = answerIndex === question.correctAnswer;

    if (isCorrect) {
      correctCount++;
    }

    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { correct: 0, total: 0 };
    }
    categoryScores[question.category].total++;
    if (isCorrect) {
      categoryScores[question.category].correct++;
    }
  }

  const score =
    attempt.questions.length > 0
      ? Math.round((correctCount / attempt.questions.length) * 100 * 100) / 100
      : 0;

  // Calculate category scores
  const categoryScoresMap: Record<string, number> = {};
  for (const [category, counts] of Object.entries(categoryScores)) {
    categoryScoresMap[category] =
      counts.total > 0
        ? Math.round((counts.correct / counts.total) * 100 * 100) / 100
        : 0;
  }

  // Store result
  const result = await prisma.workshopAssessmentResult.create({
    data: {
      assessmentId,
      childId,
      score,
      categoryScores: JSON.stringify(categoryScoresMap),
      answers: JSON.stringify(
        attempt.questions.map((q) => ({
          questionId: q.id,
          answer: attempt.answers[q.id],
          correct: attempt.answers[q.id] === q.correctAnswer,
        }))
      ),
    },
  });

  return result;
}

/**
 * Get assessment results for a child
 */
export async function getResults(childId: string): Promise<WorkshopAssessmentResult[]> {
  return prisma.workshopAssessmentResult.findMany({
    where: { childId },
    orderBy: { completedAt: 'desc' },
  });
}

/**
 * Get category breakdown for a result
 */
export function getCategoryBreakdown(
  result: WorkshopAssessmentResult
): CategoryBreakdown[] {
  const categoryScores: Record<string, number> = JSON.parse(result.categoryScores);
  const answers = JSON.parse(result.answers);

  const categoryQuestionCounts: Record<string, number> = {};
  for (const answer of answers) {
    // Count questions per category (would need question data for this)
    // For now, return scores
  }

  return Object.entries(categoryScores).map(([category, score]) => ({
    category,
    score,
    questionCount: 0, // Would need question data
  }));
}

// ============ RECOMMENDATION TRIGGERING ============

/**
 * Check if low scores trigger recommendations
 */
export async function checkAndTriggerRecommendations(
  childId: string,
  result: WorkshopAssessmentResult
): Promise<string[]> {
  const categoryScores: Record<string, number> = JSON.parse(result.categoryScores);
  const weakCategories: string[] = [];

  for (const [category, score] of Object.entries(categoryScores)) {
    if (score < 60) {
      weakCategories.push(category);
    }
  }

  // Create recommendations for weak categories
  if (weakCategories.length > 0) {
    const modules = await prisma.contentModule.findMany({
      where: {
        category: { in: weakCategories },
        status: 'published',
      },
      take: weakCategories.length * 2,
    });

    for (const module of modules) {
      await prisma.recommendation.create({
        data: {
          childId,
          moduleId: module.id,
          priority: 100 - (categoryScores[module.category] || 0),
          rationale: `You scored ${categoryScores[module.category] || 0}% in ${module.category}. This module will help you improve!`,
          category: module.category,
          basedOn: 'assessment',
        },
      });
    }
  }

  return weakCategories;
}
