# TransUrbano Chat

## Descripción

Chat en tiempo real con soporte para comunidades, desarrollado con Angular 18, NestJS, MongoDB, MySQL y Socket.IO.

## Stack Tecnológico

### Backend
- **Framework**: NestJS
- **Base de Datos**: MySQL (usuarios/comunidades), MongoDB (mensajes)
- **WebSocket**: Socket.IO
- **Autenticación**: JWT
- **Validación**: Class Validator

### Frontend
- **Framework**: Angular 18
- **Estilos**: Tailwind CSS
- **Estado**: RxJS
- **WebSocket**: Socket.IO Client

## Instalación

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Variables de Entorno

### Backend (.env)

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=86400
MONGODB_URI=mongodb://localhost:27017/transurbano-chat
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=transurbano
SOCKET_PORT=3001
CORS_ORIGIN=http://localhost:4200
```

## Base de Datos

### MySQL

```sql
CREATE DATABASE transurbano;
```

### MongoDB

MongoDB se crea automáticamente al conectar.

## Estructura de Carpetas

```
transurbano-chat/
├── backend/
│   ├── src/
│   │   ├── auth/           # Autenticación JWT
│   │   ├── chat/           # Chat y WebSocket
│   │   ├── communities/    # Gestión de comunidades
│   │   ├── users/          # Gestión de usuarios
│   │   ├── database/       # Configuración de bases de datos
│   │   ├── common/         # Utilidades compartidas
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Servicios, guards, interceptors
│   │   │   ├── shared/         # Componentes, modelos, directivas
│   │   │   ├── features/
│   │   │   │   ├── auth/       # Login, Register
│   │   │   │   ├── chat/       # Chat principal
│   │   │   │   └── communities/
│   │   │   ├── app.component.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.config.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   ├── styles.scss
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
```

## Endpoints API

### Auth
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse

### Users
- `GET /users/all` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `POST /users` - Crear usuario

### Communities
- `GET /communities` - Obtener todas las comunidades
- `GET /communities/:id` - Obtener comunidad por ID
- `POST /communities` - Crear comunidad
- `PUT /communities/:id` - Actualizar comunidad
- `DELETE /communities/:id` - Eliminar comunidad

### Chat
- `GET /chat/messages/:communityId` - Obtener mensajes de una comunidad
- `GET /chat/search?communityId=...&term=...` - Buscar mensajes

## WebSocket Events

### Client → Server
- `user-connected` - Conectar usuario
- `join-community` - Unirse a una comunidad
- `leave-community` - Abandonar una comunidad
- `send-message` - Enviar mensaje
- `typing` - Indicar que está escribiendo
- `stop-typing` - Dejar de escribir
- `edit-message` - Editar mensaje
- `delete-message` - Eliminar mensaje

### Server → Client
- `connection-success` - Conexión exitosa
- `joined-community` - Se unió a comunidad
- `left-community` - Abandonó comunidad
- `new-message` - Nuevo mensaje
- `message-sent` - Mensaje enviado
- `user-typing` - Usuario escribiendo
- `user-stop-typing` - Usuario dejó de escribir
- `message-edited` - Mensaje editado
- `message-deleted` - Mensaje eliminado
- `active-users-updated` - Usuarios activos actualizados

## Autenticación

Se usa JWT para la autenticación. El token se envía en el header:

```
Authorization: Bearer <token>
```

## Características

✅ Chat en tiempo real  
✅ Comunidades  
✅ Historial de mensajes  
✅ Notificaciones de usuarios escribiendo  
✅ Editar y eliminar mensajes  
✅ Estados online/offline  
✅ Autenticación JWT  
✅ Diseño responsive  
✅ Modo oscuro  
✅ UI moderna estilo Discord/Telegram  

## Scripts

### Backend

```bash
npm run start           # Ejecutar en producción
npm run start:dev       # Ejecutar en desarrollo con watch
npm run build          # Compilar a JavaScript
```

### Frontend

```bash
npm start              # Ejecutar servidor de desarrollo
npm run build          # Compilar para producción
npm run watch          # Watch mode
```

## Licencia

MIT
