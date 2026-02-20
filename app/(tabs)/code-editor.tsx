import { ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import { executePythonCode, validatePythonCode } from '@/lib/code-execution-service';

export default function CodeEditorScreen() {
  const [code, setCode] = useState('# Escribe tu código Python aquí\nprint("¡Hola, Python!")');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setError('');
      setOutput('Ejecutando...');

      const validation = validatePythonCode(code);
      if (!validation.valid) {
        setError(validation.error || 'Código inválido');
        setOutput('');
        setIsRunning(false);
        return;
      }

      const result = await executePythonCode({ code });

      if (result.success) {
        setOutput(result.output || '');
        setError('');
      } else {
        setError(result.error || 'Error desconocido');
        setOutput('');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearCode = () => {
    setCode('');
    setOutput('');
    setError('');
  };

  const handleClearOutput = () => {
    setOutput('');
    setError('');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Editor Python</Text>
            <Text className="text-sm text-muted mt-1">Escribe y ejecuta código en tiempo real</Text>
          </View>

          {/* Code Editor */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">Código</Text>
              <TouchableOpacity onPress={handleClearCode} className="active:opacity-80">
                <Text className="text-xs text-primary font-semibold">Limpiar</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-background border border-border rounded-lg overflow-hidden">
              <TextInput
                value={code}
                onChangeText={setCode}
                multiline
                numberOfLines={12}
                placeholder="Escribe tu código Python aquí..."
                placeholderTextColor="#999"
                className="p-4 text-foreground font-mono text-sm"
                style={{ fontFamily: 'Courier New' }}
              />
            </View>
          </View>

          {/* Run Button */}
          <TouchableOpacity
            onPress={handleRunCode}
            disabled={isRunning}
            className={`rounded-lg py-3 active:opacity-80 ${
              isRunning ? 'bg-muted opacity-50' : 'bg-primary'
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {isRunning ? 'Ejecutando...' : '▶ Ejecutar'}
            </Text>
          </TouchableOpacity>

          {/* Output Section */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">Resultado</Text>
              {(output || error) && (
                <TouchableOpacity onPress={handleClearOutput} className="active:opacity-80">
                  <Text className="text-xs text-primary font-semibold">Limpiar</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Output Display */}
            <View className="bg-background border border-border rounded-lg p-4 min-h-24">
              {error ? (
                <Text className="text-error font-mono text-sm">{error}</Text>
              ) : output ? (
                <Text className="text-success font-mono text-sm">{output}</Text>
              ) : (
                <Text className="text-muted font-mono text-sm">El resultado aparecerá aquí...</Text>
              )}
            </View>
          </View>

          {/* Code Templates */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Plantillas</Text>
            <View className="gap-2">
              <TouchableOpacity
                onPress={() =>
                  setCode(
                    '# Bucle for\nfor i in range(5):\n    print(f"Iteración {i}")'
                  )
                }
                className="bg-surface border border-border rounded-lg p-3 active:opacity-80"
              >
                <Text className="text-sm font-semibold text-foreground">Bucle for</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setCode(
                    '# Función\ndef saludar(nombre):\n    return f"¡Hola, {nombre}!"\n\nprint(saludar("Python"))'
                  )
                }
                className="bg-surface border border-border rounded-lg p-3 active:opacity-80"
              >
                <Text className="text-sm font-semibold text-foreground">Función</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setCode(
                    '# Lista\nnumeros = [1, 2, 3, 4, 5]\nprint(f"Suma: {sum(numeros)}")\nprint(f"Promedio: {sum(numeros) / len(numeros)}")'
                  )
                }
                className="bg-surface border border-border rounded-lg p-3 active:opacity-80"
              >
                <Text className="text-sm font-semibold text-foreground">Lista</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setCode(
                    '# Diccionario\npersona = {"nombre": "Juan", "edad": 25, "ciudad": "Madrid"}\nfor clave, valor in persona.items():\n    print(f"{clave}: {valor}")'
                  )
                }
                className="bg-surface border border-border rounded-lg p-3 active:opacity-80"
              >
                <Text className="text-sm font-semibold text-foreground">Diccionario</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-secondary bg-opacity-10 border border-secondary rounded-lg p-4">
            <Text className="text-sm text-foreground font-semibold">💡 Consejo</Text>
            <Text className="text-xs text-muted mt-2">
              Usa este editor para practicar Python. Escribe código, ejecútalo y ve los resultados
              en tiempo real.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
