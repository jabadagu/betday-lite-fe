# BetDay Lite

Mini app web en Next.js para visualizar eventos deportivos del dia, seleccionar cuotas 1X2 y gestionar apuestas desde una betslip con autenticacion.

## Que incluye la app hoy

- Home publica (`/`) con timeline diario por horas y ligas.
- Seleccion de cuotas `1`, `X`, `2` para crear apuestas simples o multiples.
- Betslip responsive (sidebar en desktop + modal/fab en mobile).
- Autenticacion con NextAuth (credenciales demo).
- Perfil protegido (`/profile`) con resumen y listado de apuestas del usuario.
- Detalle protegido de apuesta en `/bets/[betId]`.
- API Routes para eventos y apuestas (`/api/events`, `/api/bets`, `/api/bets/[betId]`).
- Integracion con Supabase para persistencia de apuestas.
- SEO tecnico en rutas publicas (metadata, Open Graph, JSON-LD, robots y sitemap).

## Stack

- Next.js 16.2.1 (App Router)
- React 19
- TypeScript
- NextAuth 4
- Tailwind CSS 4
- TanStack Query
- Framer Motion
- Zod
- Zustand
- Supabase

## Requisitos

- Node.js 20+
- npm 10+
- Proyecto/configuracion de Supabase con tabla `bets`

## Variables de entorno

Crea un archivo `.env.local` en la raiz con estas variables:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=betday-lite-local-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
# alternativa opcional si no usas la variable anterior:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

SUPABASE_SERVICE_ROLE_KEY=...
```

Notas:
- `NEXTAUTH_SECRET` y `NEXTAUTH_URL` son necesarios para auth y middleware.
- La app usa cliente de Supabase del lado servidor para crear/listar apuestas.
- Si defines ambas (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`), se prioriza `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.

## Arranque local

1. Instalar dependencias.

```bash
npm install
```

2. Crear y completar `.env.local` con las variables del bloque anterior.

3. Levantar en desarrollo.

```bash
npm run dev
```

4. Abrir `http://localhost:3000`.

## Credenciales demo

Ingresa manualmente en `/login`:

- `ana@betday.dev / betday123`
- `jose@betday.dev / betday123`

## Scripts disponibles

- `npm run dev`: inicia modo desarrollo.
- `npm run build`: genera build de produccion.
- `npm run start`: sirve el build de produccion.
- `npm run lint`: ejecuta ESLint.
- `npm run typecheck`: ejecuta TypeScript sin emitir.
- `npm run test`: actualmente corre `typecheck`.
- `npm run format`: formatea codigo con Prettier.
- `npm run format:check`: valida formato sin escribir cambios.

## Flujo rapido para probar

1. Abre la home y selecciona una o varias cuotas.
2. Revisa la betslip (desktop lateral o mobile con FAB).
3. Inicia sesion en `/login` con las credenciales demo.
4. Confirma la apuesta y revisa resultado en `/profile`.
5. Entra al detalle desde la lista para validar `/bets/[betId]`.

## Rutas principales

- Publicas:
  - `/`
  - `/login`
- Privadas (middleware + session check):
  - `/profile`
  - `/bets/[betId]`
- API:
  - `/api/events`
  - `/api/bets`
  - `/api/bets/[betId]`

## Notas tecnicas

- La proteccion de rutas se define en `middleware.ts` con matcher para `/profile/*` y `/bets/*`.
- El servicio de apuestas (`src/services/bets.service.ts`) es server-only.
- La home usa datos mock (`src/data/mock-events.ts`) para eventos.
- Las apuestas se persisten en Supabase.
- En SEO:
  - la home incluye metadata + canonical + JSON-LD,
  - `robots.ts` permite indexar publico y bloquea `/profile`, `/bets` y `/api`,
  - `sitemap.ts` expone rutas publicas indexables.

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
		layout.tsx
		page.tsx
		robots.ts
		sitemap.ts
	components/
		bets/
		betslip/
		layout/
		timeline/
		ui/
	config/
		env.ts
	data/
		mock-events.ts
	lib/
		auth.ts
		schemas.ts
		seo.ts
		server-url.ts
	providers/
		index.tsx
	services/
		bets.service.ts
		betslip-api.service.ts
	store/
		betslip-store.ts
		ui-state-store.ts
	supabase/
		index.ts
	types/
		bet.ts
		event.ts
		next-auth.d.ts
```

## Deploy (Vercel)

1. Importar el repo en Vercel.
2. Configurar las mismas variables de entorno del entorno local.
3. Ejecutar deploy.

Recomendacion: usa valores de `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL` con la URL final de produccion.
