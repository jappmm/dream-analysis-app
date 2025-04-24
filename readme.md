# Dream Analysis App - Aplicación de Análisis de Sueños

Este proyecto es una aplicación web completa que permite a los usuarios registrar, analizar y encontrar patrones en sus sueños. La aplicación utiliza inteligencia artificial para proporcionar interpretaciones y análisis detallados de los sueños registrados.

## Características principales

- **Registro y seguimiento de sueños**: Permite guardar detalladamente tus sueños incluyendo emociones, personajes, escenarios, etc.
- **Análisis avanzado**: Utiliza IA para analizar el contenido de los sueños, identificar símbolos y proporcionar interpretaciones.
- **Detección de patrones**: Encuentra temas recurrentes, emociones predominantes y patrones en tus sueños a lo largo del tiempo.
- **Insights personalizados**: Genera recomendaciones basadas en los patrones identificados.
- **Dashboard interactivo**: Visualiza estadísticas e información relevante sobre tus sueños.
- **Completamente responsivo**: Funciona en cualquier dispositivo móvil, tablet o desktop.
- **Seguridad y privacidad**: Encriptación de datos sensibles y opciones para control de privacidad.

## Estructura del proyecto

El proyecto está organizado en dos componentes principales:

- **Backend**: API REST desarrollada con Node.js, Express y MongoDB
- **Frontend**: Aplicación web desarrollada con React y Chakra UI

### Estructura de directorios

```
dream-analysis-app/
├── backend/              # Servidor y API REST
│   ├── api/              # Controladores, modelos y rutas
│   ├── config/           # Configuraciones
│   ├── services/         # Servicios (IA, encriptación, etc.)
│   └── utils/            # Utilidades
├── frontend/             # Aplicación web
│   ├── public/           # Archivos estáticos
│   └── src/              # Código fuente
│       ├── assets/       # Imágenes y estilos
│       ├── components/   # Componentes React
│       ├── contexts/     # Contextos de React
│       ├── hooks/        # Hooks personalizados
│       ├── pages/        # Páginas de la aplicación
│       └── services/     # Servicios (API, almacenamiento, etc.)
├── ai-prompt/            # Prompt para la IA de análisis
└── docs/                 # Documentación adicional
```

## Requisitos previos

- Node.js (v14.0.0 o superior)
- MongoDB (v4.0.0 o superior)
- API key para el servicio de IA (OpenAI o similar)

## Instalación

### Backend

1. Navega al directorio del backend:
   ```
   cd dream-analysis-app/backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` basado en `.env.example` y configura tus variables de entorno:
   ```
   cp .env.example .env
   ```

4. Completa las siguientes variables en el archivo `.env`:
   - `MONGO_URI`: URI de conexión a MongoDB
   - `JWT_SECRET`: Clave secreta para JWT
   - `AI_API_KEY`: API key para el servicio de IA
   - `ENCRYPTION_KEY`: Clave de 32 caracteres (hex) para encriptación
   - `ENCRYPTION_IV`: Vector de inicialización de 16 caracteres (hex)

5. Inicia el servidor:
   ```
   npm run dev
   ```

### Frontend

1. Navega al directorio del frontend:
   ```
   cd dream-analysis-app/frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` para configurar la conexión con el backend:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Inicia la aplicación de desarrollo:
   ```
   npm start
   ```

## Generación de claves de encriptación

Para generar las claves de encriptación requeridas, puedes usar el siguiente script:

```javascript
const crypto = require('crypto');

// Generar clave de 32 bytes (para AES-256)
const key = crypto.randomBytes(32).toString('hex');

// Generar vector de inicialización de 16 bytes
const iv = crypto.randomBytes(16).toString('hex');

console.log('ENCRYPTION_KEY=', key);
console.log('ENCRYPTION_IV=', iv);
```

## Integración con IA

La aplicación utiliza un servicio de IA para analizar los sueños. Por defecto, está configurada para usar la API de OpenAI, pero se puede adaptar a otras APIs de lenguaje natural.

El prompt para la IA se encuentra en el archivo `ai-prompt/dreamAnalysisPrompt.md`. Puedes personalizar este prompt según tus necesidades.

## Despliegue en producción

### Backend

1. Configura las variables de entorno para producción:
   - `NODE_ENV=production`
   - `PORT=5000` (o el puerto deseado)
   - Asegúrate de usar una base de datos MongoDB segura y con respaldos
   - Configura claves de encriptación seguras

2. Construye y ejecuta la aplicación:
   ```
   npm start
   ```

### Frontend

1. Construye la versión de producción:
   ```
   npm run build
   ```

2. Despliega la carpeta `build` en tu servidor web preferido (Nginx, Apache, Vercel, Netlify, etc.)

## Características de seguridad

- Encriptación de datos sensibles
- Tokens JWT con expiración
- Protección contra ataques comunes (XSS, CSRF, inyección)
- Validación de datos en cliente y servidor
- Anonimización para datos compartidos en investigación

## Documentación de la API

La documentación completa de la API se encuentra en `docs/API.md`. Los endpoints principales son:

- `/api/users`: Gestión de usuarios y autenticación
- `/api/dreams`: CRUD de sueños
- `/api/analysis`: Análisis e insights

## Mantenimiento y soporte

Para reportar problemas o sugerir mejoras, por favor crea un issue en el repositorio. También puedes contribuir al proyecto mediante pull requests.

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).