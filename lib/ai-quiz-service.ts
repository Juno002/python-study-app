import { AIQuizGenerationRequest, AIQuizGenerationResult, QuizQuestion } from './types';

const API_BASE_URL = 'http://127.0.0.1:3000';

/**
 * Genera preguntas de cuestionario automáticamente usando OpenAI
 */
export async function generateQuizWithAI(
  request: AIQuizGenerationRequest
): Promise<AIQuizGenerationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topicId: request.topicId,
        topicTitle: request.topicTitle,
        topicDescription: request.topicDescription,
        userNotes: request.userNotes || '',
        questionCount: request.questionCount || 5,
        difficulty: request.difficulty || 'medium',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error del servidor: ${error}`);
    }

    const data = await response.json();

    return {
      questions: data.questions || [],
      generatedAt: new Date(),
    };
  } catch (error) {
    throw new Error(
      `Error generando cuestionario: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}

/**
 * Valida las respuestas del cuestionario y calcula la puntuación
 */
export function validateQuizAnswers(
  questions: QuizQuestion[]
): { score: number; totalQuestions: number; correctCount: number } {
  let correctCount = 0;
  const totalQuestions = questions.length;

  for (const question of questions) {
    if (question.userAnswer === question.correctAnswer) {
      correctCount++;
    }
  }

  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  return {
    score: Math.round(score * 100) / 100,
    totalQuestions,
    correctCount,
  };
}

/**
 * Formatea una pregunta para mostrar en la UI
 */
export function formatQuestion(question: QuizQuestion): {
  question: string;
  options?: string[];
  type: string;
} {
  return {
    question: question.question,
    options: question.options,
    type: question.type,
  };
}

/**
 * Genera retroalimentación basada en la respuesta del usuario
 */
export function generateFeedback(
  question: QuizQuestion,
  isCorrect: boolean
): string {
  if (isCorrect) {
    return `¡Correcto! ${question.explanation}`;
  } else {
    return `Incorrecto. La respuesta correcta es: ${question.correctAnswer}. ${question.explanation}`;
  }
}
