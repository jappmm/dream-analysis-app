# Guía de Configuración de Dream Analysis App

Esta guía proporciona instrucciones detalladas para configurar y ejecutar la aplicación Dream Analysis, tanto para entornos de desarrollo como de producción.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

- Node.js (v16.x o posterior)
- npm (v8.x o posterior) o Yarn (v1.22.x o posterior)
- MongoDB (v5.0 o posterior)
- Git

## Estructura del Proyecto

El proyecto está organizado en dos componentes principales:

- **Frontend**: Aplicación React
- **Backend**: API REST con Node.js y Express

## Configuración del Backend

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/dream-analysis-app.git
cd dream-analysis-app/backend
```

### 2. Instalar Dependencias

```bash
npm install
# o con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:

```
# Configuración de Servidor
PORT=5000
NODE_ENV=development

# Configuración de Base de Datos
MONGO_URI=mongodb://localhost:27017/dream_analysis

# Configuración de JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Configuración de Email (opcional para desarrollo)
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_EMAIL=tu-email@ejemplo.com
SMTP_PASSWORD=tu_contraseña
FROM_EMAIL=noreply@dreamanalysis.app
FROM_NAME=Dream Analysis App

# Configuración de IA (opcional si usas stub para desarrollo)
AI_API_KEY=tu_clave_api_de_ia
AI_ENDPOINT=https://api.openai.com/v1/completions
```

### 4. Configurar la Base de Datos

Asegúrate de que MongoDB esté en ejecución en tu sistema. Para inicializar la base de datos con datos de prueba:

```bash
npm run seed
# o con yarn
yarn seed
```

### 5. Iniciar el Servidor

Para desarrollo con recarga automática:

```bash
npm run dev
# o con yarn
yarn dev
```

Para producción:

```bash
npm run start
# o con yarn
yarn start
```

El servidor estará disponible en `http://localhost:5000`.

## Configuración del Frontend

### 1. Navegar a la Carpeta Frontend

```bash
cd ../frontend
```

### 2. Instalar Dependencias

```bash
npm install
# o con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `frontend` con las siguientes variables:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 4. Iniciar la Aplicación

Para desarrollo:

```bash
npm start
# o con yarn
yarn start
```

La aplicación estará disponible en `http://localhost:3000`.

Para construir para producción:

```bash
npm run build
# o con yarn
yarn build
```

## Configuración para Producción

### Despliegue del Backend

#### Opción 1: Servidor VPS o Dedicado

1. Configura un servidor con Node.js y MongoDB
2. Clona el repositorio en el servidor
3. Configura las variables de entorno para producción
4. Instala PM2 para gestionar el proceso:

```bash
npm install -g pm2
pm2 start server.js --name dream-analysis-backend
pm2 save
```

#### Opción 2: Servicios en la Nube

**Heroku**:
```bash
heroku create dream-analysis-backend
heroku config:set VARIABLES_DE_ENTORNO
git push heroku main
```

**AWS Elastic Beanstalk**:
1. Instala la CLI de EB: `pip install awsebcli`
2. Inicializa: `eb init`
3. Crea entorno: `eb create`
4. Despliega: `eb deploy`

### Despliegue del Frontend

#### Opción 1: Servicios de Hosting Estático

**Netlify**:
1. Construye la aplicación: `npm run build`
2. Despliega la carpeta `build` en Netlify (mediante interfaz web o CLI)

**Vercel**:
```bash
npm install -g vercel
vercel login
vercel
```

#### Opción 2: Servidor Web Tradicional (Nginx)

1. Construye la aplicación: `npm run build`
2. Configura Nginx:

```nginx
server {
    listen 80;
    server_name tudominio.com;

    root /path/to/dream-analysis-app/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Configuración de la IA

La aplicación utiliza modelos de IA para el análisis de sueños. Puedes configurar esto de varias maneras:

### Opción 1: API de OpenAI (recomendado para producción)

1. Obtén una clave API de OpenAI
2. Configura `AI_API_KEY` y `AI_ENDPOINT` en el archivo `.env` del backend
3. Asegúrate de que el módulo `aiService.js` esté configurado para usar OpenAI

### Opción 2: Modo de Desarrollo con Stub

Para desarrollo, puedes usar respuestas predefinidas:

1. En `config/ai.js`, establece `useStubResponses` en `true`
2. Las respuestas de análisis se tomarán de `utils/aiStubResponses.js`

## Pruebas

### Pruebas de Backend

```bash
cd backend
npm test
# o específicas
npm test -- --grep "User API"
```

### Pruebas de Frontend

```bash
cd frontend
npm test
# con cobertura
npm test -- --coverage
```

## Resolución de Problemas Comunes

### Error de Conexión a MongoDB

Verifica que:
- MongoDB esté en ejecución
- La URI de conexión sea correcta
- Los puertos necesarios estén abiertos

### Error CORS en Desarrollo

Asegúrate de que:
- El backend tenga habilitado CORS para `http://localhost:3000`
- La URL de la API en el frontend sea correcta

### Problemas con la API de IA

- Verifica los límites de tu cuota de API
- Asegúrate de que las credenciales sean correctas
- Revisa los logs del servidor para errores específicos

## Recursos Adicionales

- [Documentación de la API](./API.md)
- [Guía de Seguridad](./SECURITY.md)
- [Sitio para Desarrolladores](https://developers.dreamanalysis.app)

## Soporte

Si encuentras problemas durante la configuración, puedes:

1. Revisar los problemas existentes en el repositorio GitHub
2. Contactar al equipo de soporte en support@dreamanalysis.app
3. Unirte a nuestro canal de Discord para soporte comunitario