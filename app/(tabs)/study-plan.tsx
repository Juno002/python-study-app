import { ScrollView, Text, View, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useStudyPlan } from '@/lib/study-plan-context';
import { useState } from 'react';
import { StudyPlan, Topic } from '@/lib/types';
import { useRouter } from 'expo-router';

export default function StudyPlanScreen() {
  const { plans, activePlan, addPlan, setActivePlan, isLoading } = useStudyPlan();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [planName, setPlanName] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [topics, setTopics] = useState<Omit<Topic, 'id' | 'planId'>[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentDays, setCurrentDays] = useState('');

  const handleAddTopic = () => {
    if (currentTopic && currentDays) {
      setTopics([
        ...topics,
        {
          title: currentTopic,
          description: currentDescription,
          order: topics.length,
          estimatedDays: parseInt(currentDays),
          isCompleted: false,
        },
      ]);
      setCurrentTopic('');
      setCurrentDescription('');
      setCurrentDays('');
    }
  };

  const handleCreatePlan = async () => {
    if (planName && topics.length > 0) {
      const newPlan: StudyPlan = {
        id: Date.now().toString(),
        name: planName,
        totalDays: parseInt(totalDays),
        createdAt: new Date(),
        updatedAt: new Date(),
        topics: topics.map((t, idx) => ({
          ...t,
          id: `topic-${Date.now()}-${idx}`,
          planId: Date.now().toString(),
        })),
        isActive: true,
      };

      await addPlan(newPlan);
      await setActivePlan(newPlan.id);

      // Reset form
      setPlanName('');
      setTotalDays('');
      setTopics([]);
      setStep(1);
      setShowCreateModal(false);
    }
  };

  const handleSelectPlan = async (plan: StudyPlan) => {
    await setActivePlan(plan.id);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-foreground">Planes de estudio</Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="bg-primary rounded-lg px-4 py-2 active:opacity-80"
            >
              <Text className="text-white font-semibold text-sm">+ Nuevo</Text>
            </TouchableOpacity>
          </View>

          {/* Plans List */}
          {plans.length === 0 ? (
            <View className="bg-surface rounded-2xl p-8 items-center gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Sin planes</Text>
              <Text className="text-sm text-muted text-center">
                Crea tu primer plan de estudio para comenzar a aprender
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  onPress={() => handleSelectPlan(plan)}
                  className={`rounded-2xl p-4 border ${
                    activePlan?.id === plan.id
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <View className="gap-3">
                    <View>
                      <Text
                        className={`text-lg font-semibold ${
                          activePlan?.id === plan.id ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {plan.name}
                      </Text>
                      <Text
                        className={`text-sm mt-1 ${
                          activePlan?.id === plan.id ? 'text-white opacity-80' : 'text-muted'
                        }`}
                      >
                        {plan.topics.filter((t) => t.isCompleted).length} de {plan.topics.length}{' '}
                        temas
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View className={`h-2 rounded-full overflow-hidden ${
                      activePlan?.id === plan.id ? 'bg-white opacity-30' : 'bg-border'
                    }`}>
                      <View
                        className={`h-full rounded-full ${
                          activePlan?.id === plan.id ? 'bg-white' : 'bg-secondary'
                        }`}
                        style={{
                          width: `${
                            (plan.topics.filter((t) => t.isCompleted).length /
                              plan.topics.length) *
                            100
                          }%`,
                        }}
                      />
                    </View>

                    {/* Topics Preview */}
                    <View className="flex-row flex-wrap gap-2">
                      {plan.topics.slice(0, 3).map((topic) => (
                        <View
                          key={topic.id}
                          className={`px-3 py-1 rounded-full text-xs ${
                            topic.isCompleted
                              ? activePlan?.id === plan.id
                                ? 'bg-white bg-opacity-30'
                                : 'bg-success bg-opacity-20'
                              : activePlan?.id === plan.id
                                ? 'bg-white bg-opacity-20'
                                : 'bg-border'
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              activePlan?.id === plan.id ? 'text-white' : 'text-foreground'
                            }`}
                          >
                            {topic.title}
                          </Text>
                        </View>
                      ))}
                      {plan.topics.length > 3 && (
                        <View className={`px-3 py-1 rounded-full ${
                          activePlan?.id === plan.id ? 'bg-white bg-opacity-20' : 'bg-border'
                        }`}>
                          <Text className={`text-xs font-medium ${
                            activePlan?.id === plan.id ? 'text-white' : 'text-muted'
                          }`}>
                            +{plan.topics.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Plan Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent={true}>
        <ScreenContainer className="p-6 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-6">
            {/* Step Indicator */}
            <View className="flex-row gap-2">
              {[1, 2, 3, 4].map((s) => (
                <View
                  key={s}
                  className={`flex-1 h-1 rounded-full ${
                    s <= step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </View>

            {/* Step 1: Plan Name & Duration */}
            {step === 1 && (
              <View className="gap-4">
                <Text className="text-2xl font-bold text-foreground">Nuevo plan</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">
                    Nombre del plan
                  </Text>
                  <TextInput
                    placeholder="Ej: Python Básico"
                    value={planName}
                    onChangeText={setPlanName}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">
                    Duración total (días)
                  </Text>
                  <TextInput
                    placeholder="Ej: 30"
                    value={totalDays}
                    onChangeText={setTotalDays}
                    keyboardType="number-pad"
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            )}

            {/* Step 2: Add Topics */}
            {step === 2 && (
              <View className="gap-4">
                <Text className="text-2xl font-bold text-foreground">Agregar temas</Text>
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">
                    Nombre del tema
                  </Text>
                  <TextInput
                    placeholder="Ej: Variables y tipos de datos"
                    value={currentTopic}
                    onChangeText={setCurrentTopic}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">
                    Descripción
                  </Text>
                  <TextInput
                    placeholder="Breve descripción del tema"
                    value={currentDescription}
                    onChangeText={setCurrentDescription}
                    multiline
                    numberOfLines={3}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-foreground mb-2">
                    Días estimados
                  </Text>
                  <TextInput
                    placeholder="Ej: 3"
                    value={currentDays}
                    onChangeText={setCurrentDays}
                    keyboardType="number-pad"
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Added Topics List */}
                {topics.length > 0 && (
                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-foreground">
                      Temas agregados ({topics.length})
                    </Text>
                    <FlatList
                      data={topics}
                      keyExtractor={(_, idx) => idx.toString()}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => (
                        <View className="bg-background rounded-lg p-3 border border-border mb-2">
                          <Text className="font-semibold text-foreground">{item.title}</Text>
                          <Text className="text-xs text-muted mt-1">
                            {item.estimatedDays} días
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <View className="gap-4">
                <Text className="text-2xl font-bold text-foreground">Revisar plan</Text>
                <View className="bg-background rounded-lg p-4 border border-border gap-2">
                  <View>
                    <Text className="text-xs text-muted">Nombre</Text>
                    <Text className="text-lg font-semibold text-foreground">{planName}</Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted mt-3">Duración</Text>
                    <Text className="text-lg font-semibold text-foreground">
                      {totalDays} días
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted mt-3">Temas</Text>
                    <Text className="text-lg font-semibold text-foreground">
                      {topics.length} temas
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  if (step > 1) {
                    setStep((step - 1) as 1 | 2 | 3 | 4);
                  } else {
                    setShowCreateModal(false);
                  }
                }}
                className="flex-1 border border-border rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-foreground font-semibold text-center">
                  {step === 1 ? 'Cancelar' : 'Atrás'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (step === 3) {
                    handleCreatePlan();
                  } else {
                    setStep((step + 1) as 1 | 2 | 3 | 4);
                  }
                }}
                className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
              >
                <Text className="text-white font-semibold text-center">
                  {step === 3 ? 'Crear' : 'Siguiente'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
