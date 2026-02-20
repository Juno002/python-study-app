import { ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useStudyPlan } from '@/lib/study-plan-context';
import { useQuiz } from '@/lib/quiz-context';

export default function ProgressScreen() {
  const { plans, progress, isLoading } = useStudyPlan();
  const { quizResults } = useQuiz();

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-lg text-foreground">Cargando...</Text>
      </ScreenContainer>
    );
  }

  const totalTopicsInAllPlans = plans.reduce((sum, plan) => sum + plan.topics.length, 0);
  const completionPercentage =
    totalTopicsInAllPlans > 0
      ? Math.round((progress.totalTopicsCompleted / totalTopicsInAllPlans) * 100)
      : 0;

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Progreso</Text>
            <Text className="text-sm text-muted mt-1">Tu avance en el aprendizaje</Text>
          </View>

          {/* Overall Progress */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <View>
              <Text className="text-sm text-muted uppercase tracking-wide font-semibold">
                Progreso general
              </Text>
              <Text className="text-4xl font-bold text-primary mt-2">{completionPercentage}%</Text>
            </View>

            {/* Progress Bar */}
            <View className="h-3 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </View>

            <Text className="text-sm text-muted">
              {progress.totalTopicsCompleted} de {totalTopicsInAllPlans} temas completados
            </Text>
          </View>

          {/* Stats Grid */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Estadísticas</Text>
            <View className="gap-3">
              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-muted">Racha actual</Text>
                  <Text className="text-2xl font-bold text-secondary mt-1">
                    {progress.currentStreak} días
                  </Text>
                </View>
                <Text className="text-3xl">🔥</Text>
              </View>

              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-muted">Tiempo de estudio</Text>
                  <Text className="text-2xl font-bold text-primary mt-1">
                    {Math.round(progress.totalStudyTime / 60)}h
                  </Text>
                </View>
                <Text className="text-3xl">⏱️</Text>
              </View>

              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-muted">Puntuación promedio</Text>
                  <Text className="text-2xl font-bold text-success mt-1">
                    {progress.averageQuizScore.toFixed(1)}%
                  </Text>
                </View>
                <Text className="text-3xl">📊</Text>
              </View>

              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-muted">Cuestionarios realizados</Text>
                  <Text className="text-2xl font-bold text-foreground mt-1">
                    {quizResults.length}
                  </Text>
                </View>
                <Text className="text-3xl">✅</Text>
              </View>
            </View>
          </View>

          {/* Plans Breakdown */}
          {plans.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Planes de estudio</Text>
              <View className="gap-3">
                {plans.map((plan) => {
                  const planCompletion = Math.round(
                    (plan.topics.filter((t) => t.isCompleted).length / plan.topics.length) * 100
                  );
                  return (
                    <View
                      key={plan.id}
                      className="bg-surface rounded-xl p-4 border border-border gap-3"
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-foreground flex-1">
                          {plan.name}
                        </Text>
                        <Text className="text-sm font-bold text-primary">{planCompletion}%</Text>
                      </View>

                      <View className="h-2 bg-border rounded-full overflow-hidden">
                        <View
                          className="h-full bg-secondary rounded-full"
                          style={{ width: `${planCompletion}%` }}
                        />
                      </View>

                      <Text className="text-xs text-muted">
                        {plan.topics.filter((t) => t.isCompleted).length} de {plan.topics.length}{' '}
                        temas
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Recent Quiz Results */}
          {quizResults.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Últimos cuestionarios</Text>
              <View className="gap-2">
                {quizResults.slice(-5).map((result) => (
                  <View
                    key={result.id}
                    className="bg-surface rounded-lg p-3 border border-border flex-row items-center justify-between"
                  >
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        Cuestionario
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {new Date(result.completedAt).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-lg font-bold text-success">
                        {Math.round((result.score / result.totalQuestions) * 100)}%
                      </Text>
                      <Text className="text-xs text-muted">
                        {result.score}/{result.totalQuestions}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {plans.length === 0 && (
            <View className="bg-surface rounded-2xl p-8 items-center gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Sin datos</Text>
              <Text className="text-sm text-muted text-center">
                Crea un plan de estudio y comienza a aprender para ver tu progreso aquí
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
