import { ScrollView, Text, View, TouchableOpacity, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCallback, useState } from 'react';
import { useColors } from '@/hooks/use-colors';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = useColors();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implementar cambio de tema
  }, [isDarkMode]);

  const handleToggleNotifications = useCallback(() => {
    setNotificationsEnabled(!notificationsEnabled);
  }, [notificationsEnabled]);

  const handleToggleReminders = useCallback(() => {
    setRemindersEnabled(!remindersEnabled);
  }, [remindersEnabled]);

  const handleResetData = () => {
    // TODO: Implementar reset de datos con confirmación
    alert('Esta función eliminará todos tus datos. ¿Estás seguro?');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Configuración</Text>
            <Text className="text-sm text-muted mt-1">Personaliza tu experiencia</Text>
          </View>

          {/* Appearance Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Apariencia</Text>
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <View className="p-4 flex-row items-center justify-between border-b border-border">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Modo oscuro</Text>
                  <Text className="text-xs text-muted mt-1">Cambia el tema de la app</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={handleToggleDarkMode}
                  trackColor={{ false: '#ccc', true: colors.primary }}
                  thumbColor={isDarkMode ? '#FFB81C' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          {/* Notifications Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Notificaciones</Text>
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <View className="p-4 flex-row items-center justify-between border-b border-border">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Notificaciones</Text>
                  <Text className="text-xs text-muted mt-1">Recibe actualizaciones importantes</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  trackColor={{ false: '#ccc', true: colors.primary }}
                  thumbColor={notificationsEnabled ? '#FFB81C' : '#f4f3f4'}
                />
              </View>

              <View className="p-4 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Recordatorios diarios</Text>
                  <Text className="text-xs text-muted mt-1">Recordatorio para estudiar cada día</Text>
                </View>
                <Switch
                  value={remindersEnabled}
                  onValueChange={handleToggleReminders}
                  trackColor={{ false: '#ccc', true: colors.primary }}
                  thumbColor={remindersEnabled ? '#FFB81C' : '#f4f3f4'}
                  disabled={!notificationsEnabled}
                />
              </View>
            </View>
          </View>

          {/* Data Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Datos</Text>
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <TouchableOpacity
                onPress={handleResetData}
                className="p-4 flex-row items-center justify-between active:opacity-80"
              >
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-error">Restablecer datos</Text>
                  <Text className="text-xs text-muted mt-1">Elimina todos tus planes y progreso</Text>
                </View>
                <Text className="text-lg">⚠️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Acerca de</Text>
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <View className="p-4 border-b border-border">
                <Text className="text-sm font-semibold text-foreground">Python Study App</Text>
                <Text className="text-xs text-muted mt-1">Versión 1.0.0</Text>
              </View>

              <View className="p-4">
                <Text className="text-xs text-muted leading-relaxed">
                  Una app para aprender Python a tu propio ritmo con planes personalizados, editor
                  de código integrado y exámenes generados por IA.
                </Text>
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View className="bg-secondary bg-opacity-10 border border-secondary rounded-lg p-4">
            <Text className="text-sm text-foreground font-semibold">💡 Consejos</Text>
            <View className="gap-2 mt-2">
              <Text className="text-xs text-muted">
                • Estudia regularmente para mantener tu racha
              </Text>
              <Text className="text-xs text-muted">
                • Usa el editor de código para practicar lo que aprendes
              </Text>
              <Text className="text-xs text-muted">
                • Toma los cuestionarios para reforzar tu aprendizaje
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
