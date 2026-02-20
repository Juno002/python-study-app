import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useStudyPlan } from '@/lib/study-plan-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { activePlan, progress, isLoading } = useStudyPlan();
  const router = useRouter();
  const [nextTopic, setNextTopic] = useState<string | null>(null);

  useEffect(() => {
    if (activePlan && activePlan.topics.length > 0) {
      const incompleteTopic = activePlan.topics.find((t) => !t.isCompleted);
      setNextTopic(incompleteTopic?.title || null);
    }
  }, [activePlan]);

  const handleContinueLearning = () => {
    // Navigate to study plan tab
    router.push('/(tabs)/study-plan');
  };

  const handleViewPlan = () => {
    router.push('/(tabs)/study-plan');
  };

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-lg text-foreground">Cargando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Hero Section */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Bienvenido</Text>
            <Text className="text-base text-muted">
              Aprende Python a tu propio ritmo
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="grid grid-cols-2 gap-4">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Temas completados</Text>
              <Text className="text-3xl font-bold text-primary">
                {progress.totalTopicsCompleted}
              </Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Racha actual</Text>
              <Text className="text-3xl font-bold text-secondary">
                {progress.currentStreak}
              </Text>
            </View>
          </View>

          {/* Active Plan Section */}
          {activePlan ? (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Plan activo</Text>
              <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    {activePlan.name}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    {activePlan.topics.filter((t) => t.isCompleted).length} de{' '}
                    {activePlan.topics.length} temas completados
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="h-2 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${
                        (activePlan.topics.filter((t) => t.isCompleted).length /
                          activePlan.topics.length) *
                        100
                      }%`,
                    }}
                  />
                </View>

                {/* Next Topic */}
                {nextTopic && (
                  <View className="bg-background rounded-lg p-3">
                    <Text className="text-xs text-muted uppercase tracking-wide">
                      Siguiente tema
                    </Text>
                    <Text className="text-sm font-semibold text-foreground mt-1">
                      {nextTopic}
                    </Text>
                  </View>
                )}

                {/* Continue Button */}
                <TouchableOpacity
                  onPress={handleContinueLearning}
                  className="bg-primary rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-white font-semibold text-center">
                    Continuar aprendiendo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="bg-surface rounded-2xl p-6 border border-border gap-3 items-center">
              <Text className="text-lg font-semibold text-foreground text-center">
                Sin plan activo
              </Text>
              <Text className="text-sm text-muted text-center">
                Crea tu primer plan de estudio para comenzar
              </Text>
              <TouchableOpacity
                onPress={handleViewPlan}
                className="bg-primary rounded-lg px-6 py-3 mt-2 active:opacity-80"
              >
                <Text className="text-white font-semibold">Crear plan</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Recent Activities */}
          {activePlan && activePlan.topics.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Temas recientes</Text>
              <View className="gap-2">
                {activePlan.topics.slice(0, 3).map((topic) => (
                  <View
                    key={topic.id}
                    className="bg-surface rounded-lg p-3 border border-border flex-row items-center justify-between"
                  >
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-foreground">
                        {topic.title}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {topic.isCompleted ? '✓ Completado' : 'En progreso'}
                      </Text>
                    </View>
                    {topic.isCompleted && (
                      <View className="w-6 h-6 bg-success rounded-full items-center justify-center">
                        <Text className="text-white text-xs font-bold">✓</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
