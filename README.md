# BetDay Lite

Mini app web para visualizar eventos deportivos del dia en un timeline por horas, simular apuestas de mercado 1X2 y revisar apuestas en una seccion de perfil protegida.

## Stack

- Next.js 15 (App Router)
- React 18
- TypeScript
- NextAuth
- Tailwind CSS
- Framer Motion
- Zod

## Funcionalidades implementadas

- Home en `/` con timeline diario por horas.
- Eventos con liga, equipos y cuotas 1X2.
- Simulacion de apuesta al hacer click en `1`, `X` o `2`.
- Feedback visual inmediato con toast animado.
- Perfil en `/profile` protegido con NextAuth.
- Perfil mostrando solo apuestas del usuario autenticado.
- Empty state para usuarios sin apuestas.
- Detalle de apuesta en `/bets/[betId]`.
- API Routes para eventos y apuestas.
- Server Components + fetch desde API Routes + loading UI.

## Estructura principal

```text
src/
	app/
		api/
			auth/[...nextauth]/route.ts
			events/route.ts
			bets/route.ts
			bets/[betId]/route.ts
		bets/[betId]/page.tsx
		login/page.tsx
		profile/page.tsx
		profile/loading.tsx
		loading.tsx
		layout.tsx
		page.tsx
	components/
		auth-actions.tsx
		bet-list.tsx
		login-form.tsx
		providers.tsx
		timeline-client.tsx
	lib/
		auth.ts
		bet-store.ts
		mock-events.ts
		server-url.ts
	types/
		bet.ts
		event.ts
		next-auth.d.ts
```

## Ejecutar en local

1. Instalar dependencias:

```bash
npm install
```

2. Crear variables de entorno desde `.env.example`:

```bash
cp .env.example .env.local
```

3. Ejecutar app:

```bash
npm run dev
```

4. Abrir `http://localhost:3000`.

## Credenciales demo

- `ana@betday.dev / betday123`
- `carlos@betday.dev / betday123`

## Scripts

- `npm run dev` inicia modo desarrollo.
- `npm run lint` ejecuta eslint.
- `npm run build` genera build de produccion.
- `npm run start` levanta el build de produccion.

## Notas tecnicas

- Se usa `middleware.ts` para proteger `/profile` y `/bets/*`.
- La persistencia de apuestas es en memoria (demo técnica), aislada por usuario autenticado.
- Para una version productiva, se recomienda reemplazar el store por base de datos (Prisma + Postgres).

## Deploy en Vercel

1. Importar el repo en Vercel.
2. Configurar variables:
	- `NEXTAUTH_URL`
	- `NEXTAUTH_SECRET`
	- `NEXT_PUBLIC_APP_URL`
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy.

## Auth y datos

- El login actual usa credenciales demo con NextAuth.
- Existe un helper de Supabase listo en `src/lib/supabase.ts` para conectar capas de datos o persistencia.
- Las apuestas en curso muestran la hora del partido en cards y detalle.

## Supabase

El esquema inicial para persistir apuestas está en `supabase/migrations/0001_create_bets.sql`.

## Documento de plan

El plan de implementacion del reto se encuentra en `docs/implementation-plan.md`.
