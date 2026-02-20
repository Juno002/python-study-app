/**
 * Core data types for Python Study App
 */

export interface StudyPlan {
  id: string;
  name: string;
  description?: string;
  totalDays: number;
  createdAt: Date;
  updatedAt: Date;
  topics: Topic[];
  isActive: boolean;
}

export interface Topic {
  id: string;
  planId: string;
  title: string;
  description: string;
  order: number;
  estimatedDays: number;
  completedAt?: Date;
  isCompleted: boolean;
}

export interface Note {
  id: string;
  topicId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeSnippet {
  id: string;
  topicId: string;
  title: string;
  code: string;
  language: 'python';
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  topicId: string;
  questions: QuizQuestion[];
  createdAt: Date;
  generatedByAI: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'code_completion';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  userAnswer?: string | number;
  isCorrect?: boolean;
}

export interface QuizResult {
  id: string;
  quizId: string;
  topicId: string;
  score: number;
  totalQuestions: number;
  answers: QuizQuestion[];
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface Progress {
  totalTopicsCompleted: number;
  totalTopicsInActivePlan: number;
  currentStreak: number;
  totalStudyTime: number; // in minutes
  averageQuizScore: number;
  lastStudiedDate: Date;
  topicsCompletedByDate: Record<string, number>; // date -> count
  quizResultsHistory: QuizResult[];
}

export interface CodeExecutionRequest {
  code: string;
  timeout?: number; // in seconds
}

export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number; // in milliseconds
}

export interface AIQuizGenerationRequest {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  userNotes?: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AIQuizGenerationResult {
  questions: QuizQuestion[];
  generatedAt: Date;
}
