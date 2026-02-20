import { CodeExecutionRequest, CodeExecutionResult } from './types';

const API_BASE_URL = 'http://127.0.0.1:3000';

/**
 * Ejecuta código Python en el servidor backend
 */
export async function executePythonCode(
  request: CodeExecutionRequest
): Promise<CodeExecutionResult> {
  try {
    const startTime = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/code/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: request.code,
        timeout: request.timeout || 5,
      }),
    });

    const executionTime = Date.now() - startTime;

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: `Error del servidor: ${error}`,
        executionTime,
      };
    }

    const data = await response.json();

    return {
      success: data.success,
      output: data.output,
      error: data.error,
      executionTime,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      executionTime: 0,
    };
  }
}

/**
 * Valida código Python básico antes de enviarlo al servidor
 */
export function validatePythonCode(code: string): { valid: boolean; error?: string } {
  if (!code.trim()) {
    return { valid: false, error: 'El código no puede estar vacío' };
  }

  if (code.length > 10000) {
    return { valid: false, error: 'El código es demasiado largo (máximo 10000 caracteres)' };
  }

  // Verificar patrones peligrosos (básico)
  const dangerousPatterns = [
    /import\s+os/,
    /import\s+sys/,
    /import\s+subprocess/,
    /open\s*\(/,
    /__import__/,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        valid: false,
        error: 'Algunas operaciones no están permitidas por seguridad',
      };
    }
  }

  return { valid: true };
}
