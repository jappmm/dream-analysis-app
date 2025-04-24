# Documentación de la API

## Información General

La API de Dream Analysis proporciona endpoints para gestionar usuarios, sueños y análisis en la plataforma. Esta API sigue los principios RESTful y utiliza JSON para la comunicación de datos.

- **URL Base**: `https://api.dreamanalysis.app/v1` (producción)
- **URL Desarrollo**: `http://localhost:5000/api` (desarrollo)
- **Autenticación**: JWT (JSON Web Tokens)
- **Formato de Respuesta**: JSON

## Autenticación

Todas las rutas protegidas requieren un token JWT válido en el encabezado de autorización:

```
Authorization: Bearer <token>
```

### Endpoints de Autenticación

#### Registro de Usuario

```
POST /users/register
```

**Cuerpo de la solicitud**:
```json
{
  "name": "Nombre Completo",
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura",
  "confirmPassword": "contraseña_segura"
}
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Nombre Completo",
    "email": "usuario@ejemplo.com"
  }
}
```

#### Inicio de Sesión

```
POST /users/login
```

**Cuerpo de la solicitud**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Nombre Completo",
    "email": "usuario@ejemplo.com"
  }
}
```

#### Verificar Token

```
GET /users/check-token
```

**Encabezados**:
```
Authorization: Bearer <token>
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Nombre Completo",
    "email": "usuario@ejemplo.com"
  }
}
```

## API de Sueños

### Obtener Sueños del Usuario

```
GET /dreams
```

**Parámetros de consulta**:
- `limit` (opcional): Número máximo de sueños a devolver (por defecto: 10)
- `offset` (opcional): Número de sueños a omitir (para paginación)
- `sort` (opcional): Campo para ordenar ('date', 'createdAt', etc.)
- `order` (opcional): Dirección de ordenación ('asc' o 'desc')

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "count": 5,
  "total": 12,
  "dreams": [
    {
      "id": "dream_id_1",
      "title": "Volando sobre montañas",
      "narrative": "Estaba volando sobre montañas nevadas...",
      "date": "2023-05-20T00:00:00.000Z",
      "mood": "joy",
      "status": "analyzed",
      "createdAt": "2023-05-21T14:35:12.000Z"
    },
    // Más sueños...
  ]
}
```

### Obtener un Sueño Específico

```
GET /dreams/:dreamId
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "dream": {
    "id": "dream_id_1",
    "title": "Volando sobre montañas",
    "narrative": "Estaba volando sobre montañas nevadas...",
    "date": "2023-05-20T00:00:00.000Z",
    "mood": "joy",
    "contextAnswers": {
      "sleep_quality": "Buena",
      "bedtime_routine": "Leí un libro",
      "emotional_state": "Tranquilo",
      "recurring": false,
      "significant_events": "Recibí una buena noticia"
    },
    "status": "analyzed",
    "createdAt": "2023-05-21T14:35:12.000Z",
    "analysis": {
      "id": "analysis_id_1",
      "summary": "Este sueño refleja una sensación de libertad y superación...",
      "symbols": [
        {
          "name": "Volar",
          "meaning": "Sensación de libertad, superación de límites",
          "context": "En el contexto del soñador, puede indicar deseo de libertad"
        },
        // Más símbolos...
      ],
      "patterns": [
        {
          "description": "Sueños recurrentes de vuelo o elevación",
          "significance": "Posible deseo de escapar de restricciones actuales"
        }
        // Más patrones...
      ],
      "reflectionQuestions": [
        "¿Te sientes limitado en algún aspecto de tu vida actualmente?",
        "¿Qué significaría la libertad para ti en este momento?"
        // Más preguntas...
      ],
      "recommendations": [
        "Reflexionar sobre áreas de la vida donde te sientes restringido",
        "Explorar actividades que te den sensación de libertad"
        // Más recomendaciones...
      ]
    }
  }
}
```

### Crear un Nuevo Sueño

```
POST /dreams
```

**Cuerpo de la solicitud**:
```json
{
  "title": "Persecución en laberinto",
  "narrative": "Me encontraba en un laberinto oscuro siendo perseguido...",
  "date": "2023-05-22",
  "mood": "fear",
  "contextAnswers": {
    "sleep_quality": "Mala",
    "bedtime_routine": "Vi una película de terror",
    "emotional_state": "Ansioso",
    "recurring": true,
    "significant_events": "Tengo un plazo de entrega importante mañana"
  }
}
```

**Respuesta exitosa** (201):
```json
{
  "success": true,
  "dream": {
    "id": "new_dream_id",
    "title": "Persecución en laberinto",
    "status": "processing",
    "createdAt": "2023-05-23T09:12:45.000Z"
  },
  "message": "Sueño registrado correctamente. El análisis estará disponible en breve."
}
```

### Actualizar un Sueño

```
PUT /dreams/:dreamId
```

**Cuerpo de la solicitud**:
```json
{
  "title": "Persecución en laberinto oscuro",
  "narrative": "Me encontraba en un laberinto muy oscuro siendo perseguido...",
  "mood": "fear"
}
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "dream": {
    "id": "dream_id",
    "title": "Persecución en laberinto oscuro",
    "status": "processing",
    "updatedAt": "2023-05-23T10:15:30.000Z"
  },
  "message": "Sueño actualizado correctamente. El análisis será actualizado."
}
```

### Eliminar un Sueño

```
DELETE /dreams/:dreamId
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "message": "Sueño eliminado correctamente"
}
```

## API de Análisis

### Obtener Insights del Usuario

```
GET /insights
```

**Parámetros de consulta**:
- `timeframe` (opcional): Período de tiempo ('month', 'quarter', 'year', 'all')
- `category` (opcional): Categoría de insights ('symbols', 'patterns', 'emotions')

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "insights": {
    "symbolFrequency": [
      { "symbol": "Agua", "count": 8, "significance": "Emociones, subconsciente" },
      { "symbol": "Caída", "count": 5, "significance": "Miedo al fracaso" },
      // Más símbolos...
    ],
    "moodDistribution": {
      "joy": 12,
      "fear": 8,
      "confusion": 5,
      "sadness": 3,
      "neutral": 7
    },
    "recurringPatterns": [
      {
        "pattern": "Sueños de persecución",
        "frequency": 4,
        "significance": "Posible evasión de problemas o responsabilidades"
      },
      // Más patrones...
    ],
    "timeBasedTrends": [
      {
        "month": "Enero",
        "dominantMood": "joy",
        "dominantThemes": ["Logros", "Celebración"]
      },
      // Más tendencias...
    ]
  }
}
```

### Guardar Feedback sobre un Análisis

```
POST /analysis/:analysisId/feedback
```

**Cuerpo de la solicitud**:
```json
{
  "rating": 4,
  "comments": "El análisis fue muy útil, me ayudó a entender mis preocupaciones actuales",
  "helpfulInsights": ["símbolo de agua", "patrón de búsqueda"]
}
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "message": "Feedback registrado correctamente. Gracias por tu opinión."
}
```

## Códigos de Estado

- `200`: Éxito
- `201`: Recurso creado exitosamente
- `400`: Solicitud incorrecta (datos inválidos)
- `401`: No autorizado (token inválido o expirado)
- `403`: Prohibido (sin permisos suficientes)
- `404`: Recurso no encontrado
- `409`: Conflicto (p.ej., correo electrónico ya registrado)
- `422`: Error de validación
- `500`: Error interno del servidor

## Límites de Tasa

Para prevenir abusos, la API implementa los siguientes límites:

- 100 solicitudes por minuto para endpoints públicos
- 300 solicitudes por minuto para endpoints autenticados

Las respuestas incluirán las siguientes cabeceras para el seguimiento de límites:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1622825102
```

## Versionado

La API utiliza versionado en la URL (v1, v2, etc.). Se recomienda especificar siempre la versión para evitar incompatibilidades en futuras actualizaciones.

## Soporte

Para soporte técnico relacionado con la API, contacta a:
- Email: api-support@dreamanalysis.app
- Portal de desarrolladores: https://developers.dreamanalysis.app