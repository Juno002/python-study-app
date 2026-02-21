# Guía de Despliegue - Python Study App

Esta guía te ayudará a desplegar la aplicación Python Study App en Vercel.

## Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [GitHub](https://github.com) (ya tienes el repositorio)
- Clave API de [OpenAI](https://platform.openai.com/api-keys)

## Opción 1: Despliegue Automático desde GitHub (Recomendado)

### Paso 1: Conectar Vercel con GitHub

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Import Git Repository"
4. Busca y selecciona `Juno002/python-study-app`
5. Haz clic en "Import"

### Paso 2: Configurar Variables de Entorno

En la pantalla de configuración del proyecto:

1. Desplázate hasta "Environment Variables"
2. Agrega la siguiente variable:
   - **Nombre:** `OPENAI_API_KEY`
   - **Valor:** Tu clave API de OpenAI
   - **Entornos:** Production, Preview, Development

3. Haz clic en "Deploy"

### Paso 3: Esperar a que se Complete el Despliegue

Vercel compilará y desplegará automáticamente tu aplicación. Esto puede tomar 5-10 minutos la primera vez.

Una vez completado, recibirás una URL de tu aplicación en vivo (ej: `https://python-study-app.vercel.app`).

## Opción 2: Despliegue Manual con Vercel CLI

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Autenticarse con Vercel

```bash
vercel login
```

### Paso 3: Desplegar

```bash
cd python-study-app
vercel
```

Sigue las indicaciones en la terminal para configurar el proyecto.

### Paso 4: Agregar Variables de Entorno

```bash
vercel env add OPENAI_API_KEY
```

Ingresa tu clave API de OpenAI cuando se te solicite.

### Paso 5: Redeploy

```bash
vercel --prod
```

## Configuración de Vercel

El proyecto incluye un archivo `vercel.json` que configura automáticamente:

- **Build Command:** `pnpm build:web`
- **Output Directory:** `dist/web`
- **Framework:** Expo
- **Headers de Seguridad:** CORS, X-Frame-Options, etc.
- **Reescrituras:** Para manejar correctamente el routing

## Variables de Entorno Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Clave API de OpenAI para generar cuestionarios | `sk-...` |

## Despliegues Posteriores

Después del despliegue inicial, cualquier push a la rama `main` del repositorio GitHub disparará automáticamente un nuevo despliegue en Vercel.

Para despliegues manuales:

```bash
git push origin main
```

Vercel detectará el cambio y desplegará automáticamente.

## Monitoreo y Logs

### Ver Logs en Vercel

1. Ve a tu proyecto en [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `python-study-app`
3. Ve a la pestaña "Deployments"
4. Haz clic en el despliegue más reciente
5. Ve a "Logs" para ver los detalles de compilación

### Solucionar Problemas

**Error: "Build failed"**
- Verifica que todas las dependencias están instaladas: `pnpm install`
- Asegúrate de que `OPENAI_API_KEY` está configurada
- Revisa los logs de compilación en Vercel

**Error: "Page not found"**
- Verifica que el archivo `vercel.json` está en la raíz del proyecto
- Asegúrate de que el directorio de salida es `dist/web`

**Error: "API calls failing"**
- Verifica que `OPENAI_API_KEY` es válida
- Comprueba que tu cuenta de OpenAI tiene créditos disponibles

## Optimizaciones para Producción

### Caché

El archivo `vercel.json` configura automáticamente:
- Archivos estáticos: cache de 1 año
- Otros archivos: cache de 1 hora

### Compresión

Vercel comprime automáticamente todos los archivos para optimizar la velocidad.

### CDN Global

Tu aplicación se sirve automáticamente desde el CDN global de Vercel para la máxima velocidad.

## Dominios Personalizados

Para usar tu propio dominio:

1. Ve a tu proyecto en Vercel
2. Ve a "Settings" → "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar los registros DNS

## Rollback a Despliegues Anteriores

Si necesitas volver a una versión anterior:

1. Ve a "Deployments" en tu proyecto Vercel
2. Haz clic en el despliegue anterior que deseas restaurar
3. Haz clic en "Promote to Production"

## Límites y Consideraciones

- **Tiempo de compilación:** Máximo 45 minutos
- **Tamaño de despliegue:** Máximo 100 MB
- **Llamadas a API:** Asegúrate de que tu plan de OpenAI puede manejar el tráfico esperado

## Soporte

Para problemas con Vercel:
- [Documentación de Vercel](https://vercel.com/docs)
- [Comunidad de Vercel](https://vercel.com/support)

Para problemas con la aplicación:
- Abre un issue en [GitHub](https://github.com/Juno002/python-study-app/issues)
