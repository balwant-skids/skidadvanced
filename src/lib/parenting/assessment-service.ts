import { prisma } from '@/lib/prisma';

/**
 * Assessment System Service for Digital Parenting Platform
 * Handles parenting assessments, scoring, and feedback generation
 */

export interface CreateAssessmentInput {
  title: string;
  description: string;
  category: string;
  questions: AssessmentQuestion[];
  scoringRubric: ScoringRubric;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'scale' | 'text';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  required: boolean;
  weight: number;
}

export interface ScoringRubric {
  maxScore: number;
  categories: {
    name: string;
    weight: number;
    description: string;
  }[];
  feedbackRanges: {
    min: number;
    max: number;
    level: 'excellent' | 'good' | 'needs_improvement' | 'concerning';
    message: string;
    recommendations: string[];
  }[];
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | number;
}

export interface AssessmentResult {
  assessmentId: string;
  parentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  feedback: string;
  recommendations: string[];
  categoryScores: Record<string, number>;
  completedAt: Date;
}

export class AssessmentService {
  /**
   * Create a new assessment
   */
  static async createAssessment(data: CreateAssessmentInput) {
    try {
      const assessment = await prisma.parentingAssessment.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          questions: JSON.stringify(data.questions),
          scoringRubric: JSON.stringify(data.scoringRubric),
          status: 'active',
        },
      });

      return assessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw new Error('Failed to create assessment');
    }
  }

  /**
   * Get available assessments
   */
  static async getAssessments(category?: string) {
    try {
      const where: any = {
        status: 'active',
      };

      if (category) {
        where.category = category;
      }

      const assessments = await prisma.parentingAssessment.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          estimatedDuration: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return assessments;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw new Error('Failed to fetch assessments');
    }
  }

  /**
   * Start an assessment session
   */
  static async startAssessment(assessmentId: string, parentId: string) {
    try {
      const assessment = await prisma.parentingAssessment.findUnique({
        where: { id: assessmentId },
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const session = await prisma.assessmentSession.create({
        data: {
          assessmentId,
          parentId,
          status: 'in_progress',
          responses: '[]',
        },
      });

      const questions = JSON.parse(assessment.questions) as AssessmentQuestion[];

      return {
        sessionId: session.id,
        assessment: {
          id: assessment.id,
          title: assessment.title,
          description: assessment.description,
          estimatedDuration: assessment.estimatedDuration,
        },
        firstQuestion: questions[0],
        totalQuestions: questions.length,
      };
    } catch (error) {
      console.error('Error starting assessment:', error);
      throw new Error('Failed to start assessment');
    }
  }

  /**
   * Submit assessment response
   */
  static async submitResponse(
    sessionId: string,
    questionId: string,
    answer: string | number
  ) {
    try {
      const session = await prisma.assessmentSession.findUnique({
        where: { id: sessionId },
        include: {
          assessment: true,
        },
      });

      if (!session) {
        throw new Error('Assessment session not found');
      }

      if (session.status !== 'in_progress') {
        throw new Error('Assessment session is not active');
      }

      const responses = JSON.parse(session.responses) as AssessmentResponse[];
      const questions = JSON.parse(session.assessment.questions) as AssessmentQuestion[];

      // Update or add response
      const existingIndex = responses.findIndex(r => r.questionId === questionId);
      if (existingIndex >= 0) {
        responses[existingIndex].answer = answer;
      } else {
        responses.push({ questionId, answer });
      }

      // Update session
      await prisma.assessmentSession.update({
        where: { id: sessionId },
        data: {
          responses: JSON.stringify(responses),
        },
      });

      // Find next question
      const currentQuestionIndex = questions.findIndex(q => q.id === questionId);
      const nextQuestion = questions[currentQuestionIndex + 1];

      return {
        nextQuestion,
        progress: {
          current: responses.length,
          total: questions.length,
          percentage: (responses.length / questions.length) * 100,
        },
        isComplete: !nextQuestion,
      };
    } catch (error) {
      console.error('Error submitting response:', error);
      throw new Error('Failed to submit response');
    }
  }

  /**
   * Complete assessment and generate results
   */
  static async completeAssessment(sessionId: string): Promise<AssessmentResult> {
    try {
      const session = await prisma.assessmentSession.findUnique({
        where: { id: sessionId },
        include: {
          assessment: true,
        },
      });

      if (!session) {
        throw new Error('Assessment session not found');
      }

      const responses = JSON.parse(session.responses) as AssessmentResponse[];
      const questions = JSON.parse(session.assessment.questions) as AssessmentQuestion[];
      const scoringRubric = JSON.parse(session.assessment.scoringRubric) as ScoringRubric;

      // Calculate score
      const { score, categoryScores } = this.calculateScore(responses, questions, scoringRubric);
      const percentage = (score / scoringRubric.maxScore) * 100;

      // Generate feedback
      const feedbackRange = scoringRubric.feedbackRanges.find(
        range => percentage >= range.min && percentage <= range.max
      );

      const result: AssessmentResult = {
        assessmentId: session.assessmentId,
        parentId: session.parentId,
        score,
        maxScore: scoringRubric.maxScore,
        percentage,
        level: feedbackRange?.level || 'unknown',
        feedback: feedbackRange?.message || 'Assessment completed',
        recommendations: feedbackRange?.recommendations || [],
        categoryScores,
        completedAt: new Date(),
      };

      // Save result
      await prisma.assessmentResult.create({
        data: {
          sessionId,
          parentId: session.parentId,
          assessmentId: session.assessmentId,
          score,
          maxScore: scoringRubric.maxScore,
          percentage,
          level: result.level,
          feedback: result.feedback,
          recommendations: JSON.stringify(result.recommendations),
          categoryScores: JSON.stringify(categoryScores),
        },
      });

      // Update session status
      await prisma.assessmentSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      return result;
    } catch (error) {
      console.error('Error completing assessment:', error);
      throw new Error('Failed to complete assessment');
    }
  }

  /**
   * Get assessment results for a parent
   */
  static async getResults(parentId: string, assessmentId?: string) {
    try {
      const where: any = {
        parentId,
      };

      if (assessmentId) {
        where.assessmentId = assessmentId;
      }

      const results = await prisma.assessmentResult.findMany({
        where,
        include: {
          assessment: {
            select: {
              title: true,
              category: true,
            },
          },
        },
        orderBy: {
          completedAt: 'desc',
        },
      });

      return results.map(result => ({
        id: result.id,
        assessmentTitle: result.assessment.title,
        category: result.assessment.category,
        score: result.score,
        maxScore: result.maxScore,
        percentage: result.percentage,
        level: result.level,
        feedback: result.feedback,
        recommendations: JSON.parse(result.recommendations),
        categoryScores: JSON.parse(result.categoryScores),
        completedAt: result.completedAt,
      }));
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      throw new Error('Failed to fetch assessment results');
    }
  }

  /**
   * Calculate assessment score
   */
  private static calculateScore(
    responses: AssessmentResponse[],
    questions: AssessmentQuestion[],
    scoringRubric: ScoringRubric
  ) {
    let totalScore = 0;
    const categoryScores: Record<string, number> = {};

    // Initialize category scores
    scoringRubric.categories.forEach(category => {
      categoryScores[category.name] = 0;
    });

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (!question) return;

      let questionScore = 0;

      if (question.type === 'scale') {
        const scaleRange = (question.scaleMax || 5) - (question.scaleMin || 1);
        questionScore = ((response.answer as number) - (question.scaleMin || 1)) / scaleRange;
      } else if (question.type === 'multiple_choice') {
        // Simple scoring for multiple choice (could be more sophisticated)
        questionScore = response.answer === question.options?.[0] ? 1 : 0;
      }

      const weightedScore = questionScore * question.weight;
      totalScore += weightedScore;

      // Add to category score (simplified - would need category mapping)
      const categoryName = scoringRubric.categories[0]?.name || 'general';
      categoryScores[categoryName] += weightedScore;
    });

    return { score: totalScore, categoryScores };
  }
}