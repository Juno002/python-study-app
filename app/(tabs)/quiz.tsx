import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import { generateQuizWithAI, validateQuizAnswers, generateFeedback } from '@/lib/ai-quiz-service';
import { useQuiz } from '@/lib/quiz-context';
import { useNotes } from '@/lib/notes-context';
import { QuizQuestion, Quiz } from '@/lib/types';

interface QuizScreenProps {
  topicId?: string;
  topicTitle?: string;
  topicDescription?: string;
}

export default function QuizScreen() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const { addQuiz, addQuizResult } = useQuiz();
  const { notes } = useNotes();

  // Demo topic for testing
  const demoTopic = {
    id: 'demo-topic-1',
    title: 'Variables y Tipos de Datos',
    description: 'Aprende sobre variables, tipos de datos y operaciones básicas en Python',
  };

  useEffect(() => {
    // Load demo questions or generate new ones
    loadDemoQuestions();
  }, []);

  const loadDemoQuestions = () => {
    // Demo questions for testing without API
    const demoQuestions: QuizQuestion[] = [
      {
        id: '1',
        type: 'multiple_choice',
        question: '¿Cuál es el tipo de dato de la variable x = 5?',
        options: ['string', 'int', 'float', 'bool'],
        correctAnswer: 1,
        explanation: 'El número 5 sin punto decimal es un entero (int).',
      },
      {
        id: '2',
        type: 'true_false',
        question: 'En Python, las listas son mutables.',
        options: ['Verdadero', 'Falso'],
        correctAnswer: 0,
        explanation: 'Las listas en Python sí son mutables, lo que significa que se pueden modificar después de su creación.',
      },
      {
        id: '3',
        type: 'multiple_choice',
        question: '¿Qué función se usa para obtener la longitud de una lista?',
        options: ['length()', 'size()', 'len()', 'count()'],
        correctAnswer: 2,
        explanation: 'La función len() devuelve la cantidad de elementos en una lista.',
      },
      {
        id: '4',
        type: 'true_false',
        question: 'Los diccionarios en Python están ordenados por clave.',
        options: ['Verdadero', 'Falso'],
        correctAnswer: 0,
        explanation: 'A partir de Python 3.7, los diccionarios mantienen el orden de inserción.',
      },
      {
        id: '5',
        type: 'multiple_choice',
        question: '¿Cuál es la forma correcta de crear una función en Python?',
        options: ['function miFunc() {}', 'def miFunc():', 'func miFunc():', 'define miFunc():'],
        correctAnswer: 1,
        explanation: 'En Python, las funciones se definen usando la palabra clave "def" seguida del nombre y paréntesis.',
      },
    ];

    setQuestions(demoQuestions);
  };

  const handleGenerateAIQuiz = async () => {
    try {
      setIsGenerating(true);
      const result = await generateQuizWithAI({
        topicId: demoTopic.id,
        topicTitle: demoTopic.title,
        topicDescription: demoTopic.description,
        userNotes: notes.map((n) => n.content).join('\n'),
        questionCount: 5,
        difficulty: 'medium',
      });

      setQuestions(result.questions);
      setCurrentQuestionIndex(0);
      setShowResults(false);
    } catch (error) {
      console.error('Error generando cuestionario:', error);
      // Fallback to demo questions
      loadDemoQuestions();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].userAnswer = answerIndex;
    setQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const validation = validateQuizAnswers(questions);
      setScore(validation.score);
      setCorrectCount(validation.correctCount);
      setShowResults(true);

      // Save quiz result
      const quiz: Quiz = {
        id: `quiz-${Date.now()}`,
        topicId: demoTopic.id,
        questions,
        createdAt: new Date(),
        generatedByAI: true,
      };

      await addQuiz(quiz);

      const result = {
        id: `result-${Date.now()}`,
        quizId: quiz.id,
        topicId: demoTopic.id,
        score: validation.score,
        totalQuestions: validation.totalQuestions,
        answers: questions,
        completedAt: new Date(),
        timeSpent: 0,
      };

      await addQuizResult(result);
    } catch (error) {
      console.error('Error guardando resultado:', error);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
    setCorrectCount(0);
    setQuestions([]);
  };

  if (questions.length === 0 && !isGenerating) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-6 items-center justify-center flex-1">
            <View className="gap-4 items-center">
              <Text className="text-4xl">📝</Text>
              <Text className="text-2xl font-bold text-foreground text-center">
                Cuestionario
              </Text>
              <Text className="text-sm text-muted text-center max-w-xs">
                Prueba tus conocimientos con preguntas generadas por IA basadas en tu tema y apuntes
              </Text>
            </View>

            <View className="w-full gap-3 mt-6">
              <TouchableOpacity
                onPress={handleGenerateAIQuiz}
                disabled={isGenerating}
                className="bg-primary rounded-lg py-4 active:opacity-80"
              >
                <Text className="text-white font-semibold text-center">
                  {isGenerating ? 'Generando...' : 'Generar cuestionario con IA'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={loadDemoQuestions}
                className="bg-surface border border-border rounded-lg py-4 active:opacity-80"
              >
                <Text className="text-foreground font-semibold text-center">
                  Usar cuestionario de demostración
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-secondary bg-opacity-10 border border-secondary rounded-lg p-4 mt-6">
              <Text className="text-sm text-foreground font-semibold">💡 Consejo</Text>
              <Text className="text-xs text-muted mt-2">
                Los cuestionarios se generan automáticamente basándose en tus apuntes y el tema que estés estudiando.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (isGenerating) {
    return (
      <ScreenContainer className="justify-center items-center">
        <View className="gap-4 items-center">
          <ActivityIndicator size="large" color="#0066CC" />
          <Text className="text-lg text-foreground font-semibold">
            Generando cuestionario...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (showResults) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-6 items-center justify-center">
            {/* Results Header */}
            <View className="gap-4 items-center">
              <Text className="text-5xl">
                {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
              </Text>
              <Text className="text-3xl font-bold text-foreground">
                {score.toFixed(1)}%
              </Text>
              <Text className="text-lg text-muted">
                {correctCount} de {questions.length} correctas
              </Text>
            </View>

            {/* Performance Message */}
            <View className="bg-surface rounded-2xl p-6 border border-border w-full gap-3">
              <Text className="text-sm font-semibold text-foreground">
                {score >= 80
                  ? '¡Excelente trabajo!'
                  : score >= 60
                    ? 'Buen esfuerzo'
                    : 'Sigue practicando'}
              </Text>
              <Text className="text-sm text-muted">
                {score >= 80
                  ? 'Dominas muy bien este tema. Continúa con el siguiente.'
                  : score >= 60
                    ? 'Tienes una buena comprensión. Repasa los temas más débiles.'
                    : 'Necesitas más práctica. Revisa tus apuntes y vuelve a intentar.'}
              </Text>
            </View>

            {/* Review Answers */}
            <View className="w-full gap-3">
              <Text className="text-lg font-semibold text-foreground">Revisión de respuestas</Text>
              {questions.map((question, idx) => {
                const isCorrect = question.userAnswer === question.correctAnswer;
                return (
                  <View
                    key={question.id}
                    className={`rounded-lg p-4 border ${
                      isCorrect
                        ? 'bg-success bg-opacity-10 border-success'
                        : 'bg-error bg-opacity-10 border-error'
                    }`}
                  >
                    <View className="flex-row items-center gap-2 mb-2">
                      <Text className="text-lg">{isCorrect ? '✓' : '✗'}</Text>
                      <Text className="text-sm font-semibold text-foreground flex-1">
                        Pregunta {idx + 1}
                      </Text>
                    </View>
                    <Text className="text-sm text-foreground mb-2">{question.question}</Text>
                    <Text className="text-xs text-muted">{question.explanation}</Text>
                  </View>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                onPress={handleRestart}
                className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-white font-semibold text-center">Intentar de nuevo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion.userAnswer !== undefined;

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Progress */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </Text>
              <Text className="text-sm text-muted">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </View>
          </View>

          {/* Question */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              {currentQuestion.question}
            </Text>

            {/* Answer Options */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <View className="gap-2">
                {currentQuestion.options.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleAnswerQuestion(idx)}
                    className={`rounded-lg p-4 border-2 active:opacity-80 ${
                      currentQuestion.userAnswer === idx
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        currentQuestion.userAnswer === idx ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {currentQuestion.type === 'true_false' && currentQuestion.options && (
              <View className="flex-row gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleAnswerQuestion(idx)}
                    className={`flex-1 rounded-lg p-4 border-2 active:opacity-80 ${
                      currentQuestion.userAnswer === idx
                        ? 'bg-primary border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`font-semibold text-center ${
                        currentQuestion.userAnswer === idx ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              onPress={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex-1 rounded-lg py-3 border border-border active:opacity-80 ${
                currentQuestionIndex === 0 ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-foreground font-semibold text-center">Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextQuestion}
              disabled={!isAnswered}
              className={`flex-1 rounded-lg py-3 active:opacity-80 ${
                isAnswered ? 'bg-primary' : 'bg-muted opacity-50'
              }`}
            >
              <Text className="text-white font-semibold text-center">
                {currentQuestionIndex === questions.length - 1 ? 'Enviar' : 'Siguiente'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
