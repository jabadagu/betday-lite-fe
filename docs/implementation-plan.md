# BetDay Lite - Plan de Implementacion

## 1. Objetivo

Construir una mini aplicacion web en Next.js 15 con App Router que permita:

- visualizar eventos del dia en un timeline por horas,
- simular apuestas en mercado 1X2,
- autenticar usuarios con NextAuth,
- mostrar apuestas del usuario autenticado en una vista de perfil protegida,
- demostrar Server Components, consumo desde API Routes y estados de carga.

Este plan esta pensado para ejecutarse sobre un repositorio nuevo y dejar una arquitectura mantenible, facil de extender y lista para despliegue en Vercel.

## 2. Criterios de cumplimiento

El entregable debe cubrir explicitamente lo siguiente:

1. Home en `/` con timeline diario por horas.
2. Eventos con liga, equipos, cuotas 1X2 y CTA para apostar.
3. Simulacion de apuesta con feedback visual inmediato.
4. Perfil en `/profile` mostrando solo apuestas del usuario autenticado.
5. Proteccion de ruta mediante NextAuth.
6. Uso real de Server Components.
7. Fetch desde API Routes.
8. Loading UI o Suspense.
9. Responsive para mobile y desktop.
10. Documentacion y despliegue preparado para Vercel.

## 3. Stack propuesto

- Next.js 15+ con App Router
- TypeScript
- React 18+ segun compatibilidad del proyecto
- NextAuth
- Tailwind CSS para velocidad de construccion UI
- Framer Motion para animaciones del timeline, feedback de apuesta y transiciones
- Zod para validacion de payloads en API Routes
- Zustand o estado local acotado para interaccion cliente si hiciera falta
- Prisma con SQLite para entorno local y Postgres en Vercel si se quiere persistencia real

## 4. Alcance funcional

### MVP obligatorio

- Login con NextAuth.
- Home con timeline de eventos del dia.
- Apuesta simulada sobre mercado 1X2.
- Persistencia de apuesta ligada al usuario autenticado.
- Perfil con listado de apuestas propias.
- Empty state en perfil.
- Loading states visibles.

### Extra recomendado

- Ruta `/bets/[betId]` con detalle completo de la apuesta.
- Filtros por hora o liga.
- Skeletons de carga.
- Toasts accesibles y animados.

## 5. Arquitectura propuesta

### Capas

1. App Router para composicion de paginas, layouts y loading states.
2. API Routes para exponer eventos y apuestas.
3. Capa de servicios para encapsular acceso a datos.
4. Componentes de UI reutilizables y componentes de dominio.
5. Capa de autenticacion centralizada con NextAuth.

### Estrategia de renderizado

- `/` como Server Component que obtiene la fecha actual y consume eventos desde API Route.
- Timeline y botones de apuesta como Client Components donde haya interaccion.
- `/profile` como pagina protegida que valida sesion en servidor antes de renderizar.
- `loading.tsx` y Suspense para estados de carga de home y perfil.

## 6. Estructura de carpetas sugerida

```text
src/
  app/
    api/
      auth/[...nextauth]/route.ts
      events/route.ts
      bets/route.ts
      bets/[betId]/route.ts
    bets/[betId]/page.tsx
    profile/page.tsx
    profile/loading.tsx
    loading.tsx
    layout.tsx
    page.tsx
  components/
    auth/
    bets/
    layout/
    timeline/
    ui/
  lib/
    auth.ts
    db.ts
    date.ts
    mock-data.ts
    validations/
  services/
    bets.service.ts
    events.service.ts
  types/
    bet.ts
    event.ts
```

## 7. Modelo de datos

### Entidad Event

- id
- league
- startTime
- homeTeam
- awayTeam
- odds.home
- odds.draw
- odds.away
- status opcional

### Entidad Bet

- id
- userId
- eventId
- selection: `1 | X | 2`
- odd
- status: `PENDING | WON | LOST`
- createdAt

### Entidad User

- id
- name
- email
- image

## 8. Flujo de autenticacion

### Opcion pragmatica para el reto

- Configurar NextAuth con Credentials Provider para una demo controlada.
- Permitir login simple con email de prueba para no depender de OAuth real.
- Guardar sesion con JWT o adapter de base de datos segun el nivel de persistencia deseado.

### Proteccion de ruta

- Validar sesion en servidor en `/profile`.
- Si no hay sesion, redirigir a login o a home con CTA para iniciar sesion.
- Filtrar apuestas por `userId` tanto en UI como en backend.

## 9. Contratos de API Routes

### GET `/api/events`

Respuesta:

- lista de eventos del dia actual, agrupables por hora en frontend.

### GET `/api/bets`

Respuesta:

- apuestas del usuario autenticado.

### POST `/api/bets`

Payload:

- eventId
- selection

Comportamiento:

- validar sesion,
- resolver cuota segun seleccion,
- crear apuesta en estado `PENDING`,
- devolver apuesta creada.

### GET `/api/bets/[betId]`

Respuesta:

- detalle completo de apuesta si pertenece al usuario.

## 10. Estrategia UI

### Home

- Hero corto con fecha del dia y resumen de actividad.
- Timeline vertical en mobile y layout mas ancho en desktop.
- Cada bloque horario contiene tarjetas de eventos.
- Cada tarjeta resalta el mercado 1X2 con tres CTAs equivalentes visualmente.
- Seleccion apostada con estado visual inmediato y toast.

### Perfil

- Cabecera de usuario con datos de sesion.
- Grid o stack de cards responsive.
- Estado visual por resultado de apuesta: pendiente, ganada, perdida.
- Empty state con CTA para volver al timeline.

### Animaciones

- Entrada escalonada del timeline.
- Microinteraccion en los botones de cuota.
- Confirmacion al apostar con motion y toast.
- Transicion suave entre estados de carga y contenido.

## 11. Plan de implementacion por fases

### Fase 1. Bootstrap del proyecto

1. Crear app con Next.js 15, TypeScript, ESLint y Tailwind.
2. Configurar alias de imports y estructura base `src/`.
3. Configurar variables de entorno y plantilla `.env.example`.
4. Definir tema visual y tokens basicos de color, spacing y tipografia.

### Fase 2. Autenticacion

1. Configurar NextAuth con provider de demo.
2. Crear pagina o modal de login simple.
3. Añadir SessionProvider en el arbol cliente donde corresponda.
4. Proteger `/profile` y cualquier mutacion de apuestas.

### Fase 3. Datos y persistencia

1. Definir mocks de eventos diarios.
2. Crear servicio de eventos.
3. Definir modelo de apuestas.
4. Implementar almacenamiento:
   - opcion minima: persistencia en memoria para demo local,
   - opcion solida: Prisma + SQLite local.
5. Crear API Routes de eventos y apuestas.

### Fase 4. Home y timeline

1. Implementar pagina `/` como Server Component.
2. Obtener eventos desde `/api/events`.
3. Agrupar por hora.
4. Renderizar tarjetas de evento.
5. Crear accion de apuesta desde Client Component.

### Fase 5. Perfil protegido

1. Implementar `/profile` como pagina protegida.
2. Obtener apuestas del usuario desde `/api/bets`.
3. Mostrar cards con seleccion, cuota y estado.
4. Añadir empty state.

### Fase 6. Loading y UX avanzada

1. Crear `loading.tsx` para home y perfil.
2. Añadir Suspense en bloques de datos.
3. Añadir skeletons o placeholders.
4. Afinar toasts, focus states y accesibilidad.

### Fase 7. Detalle de apuesta opcional

1. Crear `/bets/[betId]`.
2. Resolver detalle desde API Route protegida.
3. Reutilizar componentes de resumen de apuesta.

### Fase 8. Calidad y despliegue

1. Revisar responsive en mobile y desktop.
2. Verificar estados de error y no autenticado.
3. Documentar instalacion, decisiones tecnicas y despliegue.
4. Desplegar en Vercel.

## 12. Componentes clave

- `TimelineView`
- `TimelineHourGroup`
- `EventCard`
- `OddsButtonGroup`
- `PlaceBetButton`
- `BetToast`
- `ProfileBetsList`
- `BetCard`
- `EmptyBetsState`
- `AuthStatus`

## 13. Decisiones tecnicas recomendadas

### Sobre datos

Para un reto tecnico conviene balancear velocidad y solidez. La mejor relacion esfuerzo/resultado es:

- eventos servidos desde mock data controlada,
- apuestas persistidas con Prisma + SQLite en local,
- migracion sencilla a Postgres para Vercel si el tiempo alcanza.

### Sobre fetch

Aunque en App Router se puede leer directamente desde servidor, el reto pide demostrar fetch desde API Routes. Para cumplirlo de forma explicita:

- home hace fetch a `/api/events`,
- perfil hace fetch a `/api/bets`,
- mutacion de apuesta se hace con `POST /api/bets`.

### Sobre Server Components

Se deben mantener en servidor las paginas que cargan datos iniciales y delegar solo la interactividad puntual a cliente. Eso reduce complejidad y demuestra criterio tecnico.

## 14. Criterios de aceptacion por vista

### `/`

- Se muestran eventos del dia actual.
- Los eventos aparecen agrupados por hora.
- Cada evento tiene tres opciones de apuesta visibles.
- Apostar genera feedback claro.
- La interfaz funciona bien en mobile y desktop.

### `/profile`

- No se puede acceder sin sesion.
- Solo aparecen apuestas del usuario autenticado.
- Cada card muestra equipos, seleccion, cuota y estado.
- Si no hay apuestas, aparece empty state.

### `/bets/[betId]`

- Solo accesible si la apuesta pertenece al usuario.
- Muestra detalle completo y estado actual.

## 15. Riesgos y mitigaciones

### Riesgo: NextAuth consume tiempo de configuracion

Mitigacion:

- usar Credentials Provider para demo,
- evitar OAuth externo en la primera version.

### Riesgo: Persistencia compleja para el tiempo del reto

Mitigacion:

- empezar con mock events y persistencia sencilla,
- migrar a Prisma en una segunda iteracion si el tiempo es corto.

### Riesgo: Exceso de animacion perjudica claridad

Mitigacion:

- usar motion solo donde refuerza feedback y jerarquia.

## 16. Checklist de entrega

- Proyecto funcional en local.
- Variables de entorno documentadas.
- Login funcionando.
- Home con timeline y apuesta simulada.
- Perfil protegido funcionando.
- API Routes implementadas.
- Loading UI o Suspense visibles.
- README con setup, decisiones y deploy.
- Deploy en Vercel enlazado.

## 17. Siguiente ejecucion recomendada

Si el siguiente paso ya es implementar, el orden recomendado es:

1. scaffold del proyecto Next.js,
2. setup de Tailwind y tema visual,
3. NextAuth,
4. mocks + API Routes,
5. home timeline,
6. profile protegido,
7. loading states,
8. detalle opcional,
9. README y deploy.