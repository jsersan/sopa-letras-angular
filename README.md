# Sopa de Letras - Angular 18

Aplicación de sopa de letras con autenticación Firebase y sistema de récords.

## 🚀 Características

- ✅ Autenticación Firebase (Email/Password + Google)
- ✅ Sopa de letras dinámica (8x8 hasta 20x20)
- ✅ Algoritmo mejorado: 25% diagonales, 75% horizontal/vertical
- ✅ Sistema de récords cloud con Firestore
- ✅ Ranking global top 10 por tamaño
- ✅ Cronómetro con pausa
- ✅ Responsive design

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** → Email/Password + Google
4. Crea **Firestore Database**
5. Copia tu configuración en `src/app/services/firebase.config.ts`

```typescript
export const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

## 🔥 Reglas Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /records/{recordId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                             resource.data.userId == request.auth.uid;
    }
    
    match /rankings/{rankingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🏃‍♂️ Ejecutar

```bash
npm start
```

Abre [http://localhost:4200](http://localhost:4200)

## 📁 Estructura Incluida

```
src/app/
├── components/
│   └── pantalla-login/         # ✅ Login y registro completado
├── services/
│   ├── firebase.config.ts      # ⚙️ Configuración Firebase
│   ├── auth.service.ts         # ✅ Autenticación completa
│   ├── firestore.service.ts    # ✅ Base de datos completa
│   └── recursos.ts             # ✅ 80+ palabras español
├── models/
│   └── models.ts               # ✅ Interfaces TypeScript
└── app.component.ts            # 🔧 Para completar
```

## 🎯 IMPORTANTE - PROYECTO BASE

Este proyecto Angular 18 incluye:

✅ **Servicios Firebase completos**
✅ **Autenticación funcional**
✅ **Base de datos Firestore**
✅ **Componente Login**
✅ **Modelos TypeScript**
✅ **Recursos de palabras**

⚠️ **FALTA IMPLEMENTAR:**

Los componentes del juego deben crearse siguiendo la lógica de la versión Vue 3:
- IntroJuego
- SopaDeLetras (principal)
- MatrixLetras
- ListaPalabras
- Cronometro
- TopBar
- PantallaFinal
- PantallaRecords

## 💡 Cómo Continuar

### Opción 1: Migrar desde Vue 3
Usa la versión Vue 3 como referencia y adapta la lógica a Angular:
- Vue `data()` → Angular properties
- Vue `methods` → Angular methods
- Vue `@click` → Angular `(click)`
- Vue `v-if` → Angular `*ngIf`
- Vue `v-for` → Angular `*ngFor`
- Vue `:class` → Angular `[ngClass]`

### Opción 2: Generar Componentes
```bash
ng generate component components/intro-juego
ng generate component components/sopa-de-letras
ng generate component components/matrix-letras
ng generate component components/lista-palabras
ng generate component components/cronometro
ng generate component components/top-bar
ng generate component components/pantalla-final
ng generate component components/pantalla-records
```

## 🎨 Variables CSS Globales

Añadir a `src/styles.css`:

```css
:root {
  --color-primary: #3f51b5;
  --color-primary-dark: #303f9f;
  --color-primary-light: #c5cae9;
  --color-accent: #2196f3;
  --color-warning: #ff9800;
  --color-success: #4caf50;
  --color-background: #f5f5f5;
  --color-border: #e0e0e0;
  --color-text: #212121;
  --color-text-secondary: #757575;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--color-background);
  color: var(--color-text);
}
```

## 📊 Estructura Firestore

```
users/{userId}
  - displayName: string
  - email: string
  - totalGames: number
  - bestTime: number | null
  - createdAt: timestamp

records/{recordId}
  - userId: string
  - userName: string
  - tamaño: number
  - segundos: number
  - fecha: timestamp

rankings/{tamaño}
  - top10: array[{userId, userName, segundos}]
  - lastUpdate: timestamp
```

## 🔒 Configuración Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/)
2. OAuth 2.0 Client ID → URIs autorizados:
   - `http://localhost:4200`
   - `http://localhost:4200/__/auth/handler`

## 🐛 Troubleshooting

**Error de autenticación:**
- Verifica `firebase.config.ts`
- Revisa Firebase Console → Authentication habilitado

**Error Firestore:**
- Verifica reglas de seguridad
- Comprueba que la base de datos esté creada

**Build errors:**
- `npm install` de nuevo
- Verifica versión Node.js (≥18)

## 📝 Diferencias Vue vs Angular

| Vue 3 | Angular 18 |
|-------|-----------|
| `<script setup>` | `export class Component` |
| `ref()` | `property: type` |
| `v-model` | `[(ngModel)]` |
| `@click` | `(click)` |
| `v-if` | `*ngIf` |
| `v-for` | `*ngFor` |
| `:class` | `[ngClass]` |
| `computed` | `get property()` |
| `watch` | RxJS `subscribe()` |

## 🎯 Próximos Pasos

1. ✅ Servicios Firebase → **COMPLETADO**
2. ✅ Autenticación → **COMPLETADO**
3. ⚠️ Componentes del juego → **PENDIENTE**
4. ⚠️ Algoritmo generación sopa → **PENDIENTE**
5. ⚠️ Lógica selección palabras → **PENDIENTE**
6. ⚠️ Estilos CSS → **PENDIENTE**

---

**PROYECTO BASE** - Los servicios y autenticación están listos.
Implementa los componentes del juego usando la versión Vue 3 como referencia.
