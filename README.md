# Sello Club

Programa de lealtad de **sellos** para restaurantes. El cliente se registra con nombre y correo desde un QR/enlace, obtiene una tarjeta digital y la guarda en Google Wallet. El personal escanea el QR (o teclea el código de 8 caracteres) para sumar sellos. Incluye dashboard de visitas, clientes nuevos, frecuencia e inactivos.

Stack: **Next.js 16** (App Router, Cache Components), **Prisma + Postgres** (Neon/Supabase), **SWR**, Tailwind v4 y Google Wallet API. Todo el backend son route handlers de Next; no hay Convex ni servicios externos de datos.

## Puesta en marcha

```bash
pnpm install
# 1. Copia .env.local y pon tu DATABASE_URL real (Neon/Supabase)
pnpm db:push      # crea las tablas desde prisma/schema.prisma
pnpm dev
```

Abre:

- `/` — menú
- `/admin` — configurar el restaurante, publicar y obtener el QR
- `/c/<slug>` — enlace público del cliente (registro + tarjeta)
- `/scan` — escáner del personal (cámara, QR o código manual de 8 caracteres)
- `/scan/<código>` — confirmación al abrir el código de barras de Wallet
- `/dashboard` — métricas

El demo trabaja con **un solo restaurante**; `/admin` crea el primero si no existe.

## Variables de entorno

```dotenv
DATABASE_URL=postgresql://...              # requerida
NEXT_PUBLIC_APP_URL=http://localhost:3000  # fallback; se detecta desde la petición
GOOGLE_ISSUER_ID=...
GOOGLE_SERVICE_EMAIL=...
GOOGLE_PRIVATE_KEY=...                     # con \n o con saltos de línea reales
```

La URL pública se detecta **automáticamente** de cada petición (`host` / `x-forwarded-*`), así que funciona igual en localhost, ngrok o Vercel sin cambiar variables. Los QR de la app usan `window.location.origin`; el JWT de Wallet usa la URL detectada. `NEXT_PUBLIC_APP_URL` solo es un fallback si no hay cabeceras de host (caso muy raro). En Vercel, de todos modos conviene ponerlo al dominio real HTTPS como red de seguridad.

## Google Wallet

Sin credenciales la app funciona igual: la tarjeta in-app con su QR sigue siendo válida y el botón de Wallet muestra un error claro. Para pases reales:

1. Invita al service account (`GOOGLE_SERVICE_EMAIL`) como **Developer** en Google Pay & Wallet Console → *Users*.
2. Invita también como Developer (o test account) cada cuenta de Google con la que vayas a probar en el móvil.
3. Los issuers nuevos están en **modo demo** y los pases llevan `[TEST ONLY]`. Para clientes reales hay que completar el *Business Profile* y pedir **Request publishing access**. Google retira el sello al aprobar; no hace falta cambiar código.

El JWT incluye los campos obligatorios `iat` y `programLogo` (se genera una imagen pública con los colores de la marca si no hay logo). No se usa `heroImage`: un túnel ngrok sirve su página de aviso en vez de la imagen y Google rechazaría el pase.

## Android

`/scan` usa `BarcodeDetector` (Chrome Android) con `getUserMedia`. La cámara exige HTTPS: `localhost` funciona, `http://192.168.x.x:3000` no. Para probar en un teléfono usa ngrok sobre el puerto 3000 (solo hace falta un túnel, porque ya no hay backend separado):

```bash
ngrok http 3000
```

No hace falta cambiar ninguna variable: la URL se detecta sola. `next.config.ts` ya permite `*.ngrok-free.app`, `*.ngrok-free.dev`, `*.ngrok.app` e `*.ngrok.io`.

## Desplegar en Vercel

1. Crea una base Postgres (Neon/Supabase) y pega `DATABASE_URL` en las variables de Vercel.
2. Añade `GOOGLE_ISSUER_ID`, `GOOGLE_SERVICE_EMAIL` y `GOOGLE_PRIVATE_KEY`. Opcionalmente `NEXT_PUBLIC_APP_URL` con tu dominio HTTPS como fallback.
3. Deploy. `postinstall` ejecuta `prisma generate` automáticamente.
4. Ejecuta `pnpm db:push` una vez contra la base de producción (o usa `prisma migrate`).

No hay nada más que configurar: el feed de datos se lee con SWR desde los route handlers.
