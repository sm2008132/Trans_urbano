# 🚀 Guía de Despliegue - TransUrbano

Esta guía te ayudará a desplegar la aplicación TransUrbano en Netlify (frontend) y Render (backend).

## 📋 Prerequisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Netlify](https://netlify.com)
- Cuenta en [Render](https://render.com)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) o servidor MongoDB

---

## 🔧 Paso 1: Preparar el Backend (Render)

### 1.1 Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Ir a "Database" → "Connect"
4. Copiar el connection string (algo como `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### 1.2 Subir código a GitHub

```bash
cd /home/sebastian/Descargas/transurbano-chat
git init
git add .
git commit -m "Initial commit: TransUrbano app"
git remote add origin https://github.com/YOUR_USERNAME/transurbano-chat.git
git push -u origin main
```

### 1.3 Desplegar en Render

1. Ve a [Render](https://render.com) y crea una cuenta
2. Haz clic en "New" → "Web Service"
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: `transurbano-backend`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `/` (mismo repo)

5. Haz clic en "Advanced" y agrega variables de entorno:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transurbano
JWT_SECRET=cambiaEsteSecretoEnProduccion_aleatorioFuerte_12345
JWT_EXPIRATION=7d
CORS_ORIGIN=https://transurbano.netlify.app
NODE_ENV=production
PORT=3000
```

6. Haz clic en "Create Web Service"
7. Espera a que compile y se despliegue (5-10 minutos)
8. Copia la URL de tu backend (ej: `https://transurbano-backend.onrender.com`)

---

## 🎨 Paso 2: Desplegar Frontend (Netlify)

### 2.1 Build del Frontend

```bash
cd frontend
npm run build
```

Esto crea la carpeta `dist/` con los archivos compilados.

### 2.2 Crear archivo de configuración

El archivo `netlify.toml` ya está creado. Asegúrate de que contiene:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2.3 Desplegar en Netlify

#### Opción A: Usando GitHub (Recomendado)

1. Ve a [Netlify](https://netlify.com)
2. Haz clic en "Add new site" → "Import an existing project"
3. Selecciona GitHub y autoriza
4. Elige tu repositorio `transurbano-chat`
5. Configura:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

6. Haz clic en "Deploy site"

#### Opción B: Drag & Drop

1. Haz build del frontend: `npm run build`
2. Ve a [Netlify](https://netlify.com/drop)
3. Arrastra la carpeta `frontend/dist` al área de drop
4. Netlify automáticamente:desplegará tu sitio
5. Obtendrás una URL (ej: `https://transurbano-123.netlify.app`)

---

## 🔗 Paso 3: Conectar Frontend y Backend

### 3.1 Actualizar URLs en Netlify

1. En Netlify, ve a Site settings → Build & deploy → Environment
2. Agrega variable de entorno:

```
VITE_API_URL=https://tu-backend-url.onrender.com
VITE_SOCKET_URL=https://tu-backend-url.onrender.com
```

3. Trigger a new deploy

### 3.2 Actualizar CORS en Render

1. En Render, edita tu Web Service
2. Actualiza la variable `CORS_ORIGIN` con tu URL de Netlify:

```
CORS_ORIGIN=https://your-site.netlify.app
```

---

## ✅ Verificación Final

1. Ve a tu URL de Netlify (ej: `https://transurbano.netlify.app`)
2. Intenta:
   - Registrarte
   - Iniciar sesión
   - Crear una comunidad
   - Enviar un mensaje en tiempo real

Si todo funciona, ¡está desplegado! 🎉

---

## 🐛 Solución de Problemas

### Frontend se ve pero no conecta con backend

- Verifica que las URLs en environment.ts son correctas
- Revisa la consola del navegador (F12) para errores de red
- Asegúrate que CORS_ORIGIN en Render incluye tu URL de Netlify

### Backend no inicia en Render

- Ve a Render → Logs y revisa qué error hay
- Verifica que tienes todas las variables de entorno configuradas
- Comprueba que MongoDB connection string es correcto

### Mensajes no persisten

- Verifica credenciales de MongoDB
- Comprueba que MongoDB está activo en Atlas

---

## 📝 Próximos Pasos (Opcional)

- Configurar dominio personalizado en Netlify
- Configurar SSL/HTTPS (automático en ambos servicios)
- Configurar auto-deploy en GitHub
- Monitoreo y logging

¡Tu aplicación está lista para el mundo! 🌍
