# Python Study App 🐍📚

Una aplicación moderna (móvil y web) para aprender Python a tu propio ritmo, con planes de estudio personalizados, editor de código integrado y exámenes automáticos generados por IA.

**🌐 Disponible en:** [Versión Web](#despliegue-en-vercel) | 📱 iOS/Android (Expo Go)

**Demo en vivo:** Próximamente en Vercel

## Características Principales

### 📋 Plan de Estudio Personalizado
Crea tu propio programa de aprendizaje especificando temas, orden y plazos. La app dosifica el contenido día a día según tu ritmo personal, permitiéndote avanzar a tu velocidad.

### 📝 Apuntes por Tema
Escribe y guarda apuntes vinculados a cada tema del plan. Estos apuntes se utilizan para generar cuestionarios personalizados y reforzar tu aprendizaje.

### 💻 Editor de Código Python Integrado
Practica Python directamente en la app con un editor completo que incluye:
- Plantillas de código predefinidas (bucles, funciones, listas, diccionarios)
- Validación de código antes de ejecutar
- Ejecución en tiempo real con captura de salida y errores
- Interfaz limpia y fácil de usar

### 🤖 Exámenes Automáticos con IA
Genera cuestionarios personalizados automáticamente usando OpenAI (gpt-4-mini) basados en:
- Los temas que estés estudiando
- Tus apuntes personales
- Tu nivel de dificultad preferido

Tipos de preguntas soportadas:
- Opción múltiple
- Verdadero/Falso
- Completar código

### 📊 Progreso Visual
Pantalla de estadísticas completa que muestra:
- Porcentaje de completitud general
- Racha de estudio actual (días consecutivos)
- Tiempo total de estudio
- Puntuación promedio en cuestionarios
- Desglose de progreso por plan
- Historial de cuestionarios recientes

### ⚙️ Configuración Personalizable
- Modo oscuro/claro
- Notificaciones y recordatorios diarios
- Opción para restablecer datos

## Tecnología

- **Framework:** React Native + Expo
- **Lenguaje:** TypeScript
- **Estilos:** NativeWind (Tailwind CSS para React Native)
- **Gestión de Estado:** React Context + AsyncStorage
- **API:** OpenAI (gpt-4-mini) para generación de cuestionarios
- **Diseño:** Tema Python con colores azul (#0066CC) y amarillo (#FFB81C)

## Estructura del Proyecto

```
python-study-app/
├── app/
│   ├── _layout.tsx              # Layout raíz con proveedores
│   └── (tabs)/
│       ├── _layout.tsx          # Configuración de navegación por tabs
│       ├── index.tsx            # Pantalla de inicio
│       ├── study-plan.tsx       # Planes de estudio
│       ├── code-editor.tsx      # Editor de código Python
│       ├── quiz.tsx             # Cuestionarios con IA
│       ├── notes.tsx            # Apuntes por tema
│       ├── progress.tsx         # Estadísticas y progreso
│       └── settings.tsx         # Configuración
├── lib/
│   ├── types.ts                 # Tipos TypeScript
│   ├── study-plan-context.tsx   # Contexto para planes
│   ├── notes-context.tsx        # Contexto para notas
│   ├── quiz-context.tsx         # Contexto para cuestionarios
│   ├── code-execution-service.ts # Servicio de ejecución de código
│   ├── ai-quiz-service.ts       # Servicio de generación de IA
│   └── utils.ts                 # Utilidades
├── components/
│   ├── screen-container.tsx     # Contenedor con SafeArea
│   └── ui/
│       └── icon-symbol.tsx      # Mapeo de iconos
├── hooks/
│   ├── use-colors.ts            # Hook para colores del tema
│   ├── use-color-scheme.ts      # Hook para modo oscuro/claro
│   └── use-auth.ts              # Hook de autenticación
├── assets/
│   └── images/
│       ├── icon.png             # Logo de la app
│       ├── splash-icon.png      # Icono de splash
│       └── favicon.png          # Favicon
├── theme.config.js              # Configuración de colores
├── tailwind.config.js           # Configuración de Tailwind
├── app.config.ts                # Configuración de Expo
└── package.json                 # Dependencias
```

## Pantallas

| Pantalla | Descripción |
|----------|-------------|
| **Inicio** | Bienvenida, resumen de progreso y acceso rápido a funciones |
| **Plan** | Crear y gestionar planes de estudio con temas |
| **Código** | Editor Python con ejecución en tiempo real |
| **Quiz** | Cuestionarios generados por IA con retroalimentación |
| **Notas** | Escribir y editar apuntes por tema |
| **Progreso** | Estadísticas, racha y historial de cuestionarios |
| **Configuración** | Preferencias de usuario y opciones de datos |

## Instalación Local

### Requisitos
- Node.js 18+ y npm/pnpm
- Expo CLI
- Python 3.7+ (para ejecutar código en el backend)

### Pasos

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Juno002/python-study-app.git
cd python-study-app
```

2. **Instalar dependencias:**
```bash
pnpm install
```

3. **Configurar variables de entorno:**
```bash
# Crear archivo .env
echo "OPENAI_API_KEY=tu_clave_aqui" > .env
```

4. **Iniciar el servidor de desarrollo:**
```bash
pnpm dev
```

5. **Abrir en dispositivo:**
   - **iOS:** Escanea el código QR con la cámara
   - **Android:** Escanea el código QR con Expo Go
   - **Web:** Abre el navegador en `http://localhost:8081`

### Desarrollo Web Solo

Para desarrollar solo la versión web:

```bash
pnpm dev:web
```

Luego abre `http://localhost:8081` en tu navegador.

### Build Web para Producción

Para crear un build optimizado para web:

```bash
pnpm build:web
```

Los archivos compilados estarán en `dist/web/`.

## Uso

### Crear un Plan de Estudio

1. Ve a la pestaña **Plan**
2. Toca "Crear plan"
3. Ingresa el nombre del plan
4. Agrega temas con descripción y plazo
5. El plan se dosificará automáticamente

### Escribir Apuntes

1. Ve a la pestaña **Notas**
2. Toca "+ Nuevo"
3. Escribe tus apuntes
4. Guarda para usarlos en cuestionarios

### Practicar Código

1. Ve a la pestaña **Código**
2. Escribe o selecciona una plantilla
3. Toca "▶ Ejecutar"
4. Ve los resultados en tiempo real

### Tomar un Cuestionario

1. Ve a la pestaña **Quiz**
2. Toca "Generar cuestionario con IA"
3. Responde las preguntas
4. Envía para ver tu puntuación y retroalimentación

### Ver Progreso

1. Ve a la pestaña **Progreso**
2. Visualiza tus estadísticas y racha
3. Revisa el historial de cuestionarios

## Configuración de Backend

La app requiere un backend para:
- Ejecutar código Python de forma segura
- Generar cuestionarios con OpenAI

### Endpoints Requeridos

```
POST /api/code/execute
  Body: { code: string, timeout: number }
  Response: { success: boolean, output?: string, error?: string }

POST /api/quiz/generate
  Body: { topicId, topicTitle, topicDescription, userNotes, questionCount, difficulty }
  Response: { questions: QuizQuestion[] }
```

## Despliegue en Vercel

### Despliegue Automático (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Import Git Repository"
4. Busca y selecciona `Juno002/python-study-app`
5. En "Environment Variables", agrega:
   - `OPENAI_API_KEY`: Tu clave API de OpenAI
6. Haz clic en "Deploy"

Vercel compilará y desplegará automáticamente tu aplicación. Recibirás una URL pública (ej: `https://python-study-app.vercel.app`).

### Despliegue Manual

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas.

### Características del Despliegue

- ✅ Compilación automática con `pnpm build:web`
- ✅ Caché optimizado para archivos estáticos
- ✅ Headers de seguridad (CORS, X-Frame-Options, etc.)
- ✅ CDN global para máxima velocidad
- ✅ Despliegues automáticos en cada push a `main`
- ✅ Rollback fácil a versiones anteriores

### Monitoreo

En el dashboard de Vercel puedes:
- Ver logs de compilación
- Monitorear el rendimiento
- Gestionar dominios personalizados
- Configurar variables de entorno

## Características Futuras

- ☐ Sincronización con la nube
- ☐ Autenticación de usuarios
- ☐ Compartir planes de estudio
- ☐ Comunidad de estudiantes
- ☐ Certificados de completitud
- ☐ Análisis avanzado de progreso
- ☐ Integración con recursos externos
- ☐ Modo offline mejorado

## Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Autor

Creado con ❤️ para estudiantes de Python

## Plataformas Soportadas

| Plataforma | Estado | Instrucciones |
|-----------|--------|---------------|
| **Web** | ✅ Listo | [Despliegue en Vercel](#despliegue-en-vercel) |
| **iOS** | ✅ Listo | Escanea QR con cámara en desarrollo local |
| **Android** | ✅ Listo | Usa Expo Go app |
| **Desktop** | 🔄 Próximamente | Electron/Tauri |

## Soporte

Si encuentras problemas o tienes sugerencias:
- Abre un [issue en GitHub](https://github.com/Juno002/python-study-app/issues)
- Consulta [DEPLOYMENT.md](./DEPLOYMENT.md) para problemas de despliegue

---

**Nota:** Esta app está en desarrollo activo. Algunas características pueden cambiar o mejorarse en futuras versiones.
