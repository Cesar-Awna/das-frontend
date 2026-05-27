# CLAUDE.md · Contexto del proyecto DAS Concepción

> Este documento le da contexto completo del proyecto a un asistente IA (Claude Code, Cursor, etc.). Léelo antes de hacer cualquier cambio.

---

## 1. CONTEXTO DE NEGOCIO

Este es el frontend de un **Sistema de Gestión Documental Web de Calidad** para la **Dirección de Salud Municipal (DAS) de Concepción, Chile**. Es la implementación técnica de una propuesta para la **Licitación pública 2421-16-LE26**, presentada por **Awna Digital Spa**.

El sistema debe cumplir con **46 ítems funcionales** definidos en el Anexo N°3 del documento de licitación, organizados en 5 secciones:

1. **Acreditación de Prestadores** (14 ítems) — Manual de Acreditación de la Superintendencia de Salud
2. **Autorización Sanitaria NTB** (4 ítems) — Normas Técnicas Básicas
3. **Gestión de Calidad** (12 ítems) — Documental + Pautas de supervisión
4. **Eventos Adversos** (11 ítems) — Administración + Seguimiento + Planes de mejora
5. **Otras herramientas** (5 ítems) — Workspace unificado, búsqueda, cálculo muestral, reportes

**Usuarios objetivo**: gestores de calidad, jefes de servicio, enfermeras coordinadoras, dentistas, farmacéuticos y administrativos de los CEMSCO, CESFAM y Dirección DAS Concepción.

**Lenguaje**: todo en **español de Chile**. Cuando hables conmigo (el dev) puedes usar español informal chileno. Cuando escribas texto que verá el usuario final, usa español formal/profesional.

---

## 2. STACK TÉCNICO

| Componente | Tecnología | Versión |
|---|---|---|
| UI | React | 18.3.1 |
| Build | Vite | 5.4.11 |
| Routing | React Router DOM | v7.0.2 |
| Server State | TanStack React Query | 5.59.0 |
| HTTP Client | Axios | 1.7.7 |
| Estilos | Tailwind CSS v4 | 4.0.0 (CSS-first config con `@theme`) |
| Iconos | Tabler Icons | via CDN |
| Fuentes | Fraunces + Inter + JetBrains Mono | via Google Fonts |

**NO usamos**: Ant Design, Material UI, Bootstrap, Chakra, styled-components, ni ninguna otra librería de UI. **El sistema de diseño es 100% propio.**

**Backend** (separado, en otro repo): Node.js + Express + MongoDB + Mongoose + JWT. URL configurada via `VITE_API_APP` (por defecto `http://localhost:5001`).

---

## 3. ESTRUCTURA DEL PROYECTO

```
das-frontend/
├── public/                  # estáticos
├── src/
│   ├── apis/
│   │   └── app.js           # instancia única de axios (baseURL desde env)
│   ├── libs/
│   │   └── axios.js         # createInstance(baseURL) + interceptors JWT/401
│   ├── services/            # 15 clases, una por dominio
│   │   ├── Auth.js
│   │   ├── Users.js
│   │   ├── Indicators.js
│   │   ├── Documents.js
│   │   ├── Events.js
│   │   └── ... (10 más)
│   ├── hooks/               # React Query hooks
│   │   ├── useDashboard.js
│   │   ├── useIndicators.js
│   │   ├── useDocuments.js
│   │   ├── useEvents.js
│   │   └── useDomain.js     # hooks de los demás dominios
│   ├── components/
│   │   ├── PrivateRoute.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/              # COMPONENTES UI COMPARTIDOS (úsalos siempre)
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── KpiCard.jsx
│   │       ├── PageHeader.jsx
│   │       ├── ProgressBar.jsx
│   │       ├── Modal.jsx
│   │       ├── Toast.jsx       # exporta useToast() y ToastProvider
│   │       ├── States.jsx      # Loader, EmptyState, ErrorState
│   │       └── index.js        # barrel export — IMPORTAR DESDE ACÁ
│   ├── config/
│   │   └── menu.js          # ÚNICA fuente de verdad del sidebar
│   ├── pages/
│   │   ├── public/
│   │   │   └── Login.jsx
│   │   └── private/         # 20 páginas, una por ruta
│   │       ├── Dashboard.jsx
│   │       ├── Workspace.jsx
│   │       ├── Acreditacion.jsx
│   │       ├── IndicadorDetalle.jsx
│   │       ├── Autoevaluacion.jsx
│   │       ├── Comparativa.jsx
│   │       ├── AutorizacionSanitaria.jsx
│   │       ├── Documental.jsx
│   │       ├── Supervision.jsx
│   │       ├── Eventos.jsx
│   │       ├── EventoDetalle.jsx
│   │       ├── PlanMejora.jsx
│   │       ├── CatalogosEventos.jsx
│   │       ├── FormulariosEventos.jsx
│   │       ├── Busqueda.jsx
│   │       ├── CalculoMuestral.jsx
│   │       ├── Reportes.jsx
│   │       ├── Usuarios.jsx
│   │       ├── Organizacion.jsx
│   │       ├── Configuracion.jsx
│   │       └── Auditoria.jsx
│   ├── styles/
│   │   ├── tokens.css       # variables CSS: colores, fuentes, espacios
│   │   └── components.css   # clases reutilizables (.btn, .badge, etc.)
│   ├── App.jsx              # rutas
│   ├── main.jsx             # QueryClient + ToastProvider
│   └── index.css            # @import tailwind + tokens + components + @theme
├── .env.example
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── STYLES.md                # documentación del sistema de diseño
```

---

## 4. FLUJO DE DATOS (regla inmutable)

**Todo dato del backend debe pasar por esta cadena, sin saltarse pasos**:

```
Page (JSX) → Hook (React Query) → Service (clase Axios) → API
```

### Ejemplo: Dashboard pide su resumen

**`src/services/Dashboard.js`** (capa de HTTP):
```js
import instance from '../apis/app.js';
class DashboardService {
  summary = () => instance.get('/api/dashboard/summary');
}
export default new DashboardService();
```

**`src/hooks/useDashboard.js`** (capa de cache/estado):
```js
import { useQuery } from '@tanstack/react-query';
import Dashboard from '../services/Dashboard.js';

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => Dashboard.summary(),
    refetchOnWindowFocus: false,
    retry: 1,
  });
```

**`src/pages/private/Dashboard.jsx`** (capa de UI):
```jsx
import { useDashboardSummary } from '../../hooks/useDashboard.js';
const Dashboard = () => {
  const summary = useDashboardSummary();
  const data = summary.data?.data || defaultSummary; // fallback siempre
  return <>...</>;
};
```

### Reglas estrictas

- **NUNCA** llamar a `axios` o `fetch` directamente desde un componente. Siempre vía service.
- **NUNCA** crear un nuevo `axios.create()`. Solo existe la instancia de `src/apis/app.js`.
- **NUNCA** poner lógica de servidor en componentes — eso va en services.
- **SIEMPRE** usar fallback `defaultXxx` para que la página renderice aunque el backend esté caído.
- **SIEMPRE** los services devuelven `{ success, message, data }` (interceptor de axios devuelve `res.data`).

---

## 5. SISTEMA DE DISEÑO (regla inmutable)

### Filosofía: **CENTRALIZADO · MODULAR · ESCALABLE · CERO REPETICIÓN**

### Capas del sistema

```
┌────────────────────────────────────────┐
│ 4. Componentes (Badge, Button, Card)   │ ← lo que usas en JSX
├────────────────────────────────────────┤
│ 3. Clases (.btn, .badge, .nav-item)    │ ← components.css
├────────────────────────────────────────┤
│ 2. Tailwind tokens (@theme)            │ ← index.css
├────────────────────────────────────────┤
│ 1. Variables CSS (--color-*)           │ ← tokens.css (única fuente de verdad)
└────────────────────────────────────────┘
```

### Paleta editorial

| Token | Color | Uso |
|---|---|---|
| `--color-ink-950` | `#0a1628` | Texto, sidebar, botones primarios |
| `--color-paper` | `#fafaf7` | Fondo institucional cálido |
| `--color-paper-100` | `#eaeae0` | Bordes finos |
| `--color-stone-{500-800}` | grises cálidos | Texto secundario |
| `--color-accent` | `#b8854a` | Bronce/ocre — único acento decorativo |
| `--color-status-ok` | `#3d6b4f` | Verde institucional |
| `--color-status-warn` | `#a87830` | Naranja apagado |
| `--color-status-danger` | `#a83a30` | Rojo apagado |

### Tipografía

- **Fraunces** (serif) → `font-display` → títulos, cifras grandes
- **Inter** (sans) → default → cuerpo, UI
- **JetBrains Mono** → `font-mono` → códigos, IDs, RUT

### REGLAS DURAS

✅ **HACER**:
```jsx
// Importar SIEMPRE desde el barrel export
import { Badge, Button, Card, PageHeader, useToast } from '../../components/ui/index.js';

<PageHeader overline="Módulo" title="Mi título" actions={<Button variant="primary" icon="ti-plus">Crear</Button>} />
<Badge variant="ok">Cumple</Badge>
<div className="font-display text-2xl text-ink-950">Mi título</div>
```

❌ **NUNCA HACER**:
```jsx
// Inline styles → PROHIBIDO
<div style={{ background: '#0a1628', padding: 24 }}>...</div>

// Hardcodear colores que existen como token → PROHIBIDO
<div className="bg-[#0a1628]">...</div>

// Recrear botones a mano → PROHIBIDO
<button style={{...}}>...</button>

// Hardcodear fuentes → PROHIBIDO
<h1 style={{ fontFamily: 'Fraunces' }}>...</h1>
```

### Si necesitas un componente nuevo

1. **Antes de crearlo**, revisa `src/components/ui/` por si ya existe.
2. Si lo creas, **agrégalo al barrel export** `src/components/ui/index.js`.
3. Si vas a repetir clases más de 2 veces, **vuélvelas una clase en `components.css`**.

### Componentes UI disponibles

| Componente | Props clave |
|---|---|
| `<PageHeader>` | `overline`, `breadcrumb`, `title`, `actions` |
| `<Badge>` | `variant: 'default' \| 'ok' \| 'warn' \| 'danger' \| 'ink' \| 'accent'` |
| `<Button>` | `variant`, `icon`, `iconRight`, `full`, `disabled` |
| `<Card>` | `padded` (default true) |
| `<KpiCard>` | `label`, `value`, `suffix`, `icon`, `footer`, `footerVariant`, `onClick` |
| `<ProgressBar>` | `value`, `max`, `variant` (auto si no se pasa) |
| `<Modal>` | `open`, `onClose`, `title`, `maxWidth` |
| `<Loader>` `<EmptyState>` `<ErrorState>` | estados de query |
| `useToast()` | `toast.success/error/warn/info(msg)` |

### Clases utilitarias listas para usar

| Clase | Para qué |
|---|---|
| `.overline` | Texto pequeño uppercase gris (etiquetas) |
| `.overline-accent` | Igual pero en bronce |
| `.italic-accent` `.italic-danger` `.italic-ok` | Cursivas semánticas (texto editorial) |
| `.input-line` `.input-box` `.input-label` | Inputs editoriales |
| `.card` `.card-padded` | Contenedores |
| `.table-row` `.table-header` | Tablas en grid |
| `.tab-btn` `.tab-btn.active` | Tabs |
| `.nav-item` `.nav-section` | Items del sidebar |
| `.grain-bg` | Textura sutil de grano |
| `.fade-in` | Animación de entrada |

---

## 6. RUTAS Y MENÚ

### Rutas (en `src/App.jsx`)

```
Públicas:                  Privadas (con PrivateRoute + Sidebar):
/login                     /dashboard
                           /mi-dia
                           /acreditacion
                           /indicadores/:id
                           /autoevaluacion
                           /comparativa
                           /autorizacion-sanitaria
                           /documental
                           /supervision
                           /eventos
                           /eventos/:id
                           /plan-mejora/:id
                           /catalogos-eventos
                           /formularios-eventos
                           /busqueda
                           /calculo-muestral
                           /reportes
                           /usuarios
                           /organizacion
                           /configuracion
                           /auditoria

Fallback: * → /dashboard
```

### Sidebar (`src/config/menu.js`)

El sidebar se construye SOLO leyendo `MENU_GROUPS`. **Para agregar/quitar items del menú, editar SOLO este archivo. NUNCA tocar `Sidebar.jsx`**.

```js
export const MENU_GROUPS = [
  {
    title: null, // sin título (primer grupo)
    items: [
      { key: 'dashboard', label: 'Panel principal', icon: 'ti-layout-dashboard', path: '/dashboard' },
      // ...
    ],
  },
  // ...
];
```

Si una sub-ruta debe activar el item padre del menú (ej: `/indicadores/IAAS-03` activa "Acreditación"), agregar al mapa `ROUTE_PARENT_MAP`:

```js
export const ROUTE_PARENT_MAP = {
  '/indicadores/': '/acreditacion',
  '/eventos/': '/eventos',
  // ...
};
```

---

## 7. AUTENTICACIÓN

### Flujo actual

1. Usuario llena `Login.jsx` y submit dispara `Auth.login({mail, password})`.
2. El backend responde `{ success, message, data: { token, user } }`.
3. Frontend guarda `localStorage.setItem('user', JSON.stringify(response.data))`.
4. Navega a `/dashboard`.
5. **Todas las peticiones siguientes** llevan `Authorization: Bearer <token>` automáticamente (interceptor en `libs/axios.js`).
6. Si una respuesta es **401**, el interceptor limpia localStorage y redirige a `/login`.

### `PrivateRoute`

Si `localStorage.getItem('user')` está vacío → redirige a `/login`. Si está, renderiza `<AppLayout><Outlet /></AppLayout>` (que mete sidebar + main).

### ⚠️ MISMATCH PENDIENTE

- El frontend manda `{ mail, password }`
- El backend espera `{ email, password }`
- **Hay que decidir** si arreglarlo en frontend (cambiar `mail` → `email`) o en backend (aceptar ambos).

---

## 8. CÓMO AGREGAR UNA PÁGINA NUEVA (receta)

Supongamos que necesitas una página `/protocolos`:

**1. Crear el service** en `src/services/Protocolos.js`:
```js
import instance from '../apis/app.js';
class ProtocolosService {
  list = (params) => instance.get('/api/protocolos', { params });
  getById = (id) => instance.get(`/api/protocolos/${id}`);
}
export default new ProtocolosService();
```

**2. Crear el hook** en `src/hooks/useDomain.js`:
```js
import Protocolos from '../services/Protocolos.js';
export const useProtocolos = (params) =>
  useQuery({ queryKey: ['protocolos', params], queryFn: () => Protocolos.list(params), ...baseOptions });
```

**3. Crear la página** en `src/pages/private/Protocolos.jsx`:
```jsx
import { PageHeader, Card, Loader, ErrorState } from '../../components/ui/index.js';
import { useProtocolos } from '../../hooks/useDomain.js';

const Protocolos = () => {
  const query = useProtocolos();
  if (query.isLoading) return <Loader />;
  if (query.isError && !query.data) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = query.data?.data || defaultData;

  return (
    <>
      <PageHeader overline="Calidad" title="Protocolos clínicos" />
      <div className="p-10 max-w-7xl">
        {/* contenido */}
      </div>
    </>
  );
};

const defaultData = []; // fallback siempre
export default Protocolos;
```

**4. Registrar la ruta** en `src/App.jsx`:
```jsx
import Protocolos from './pages/private/Protocolos.jsx';
// dentro de <Route element={<PrivateRoute />}>
<Route path="/protocolos" element={<Protocolos />} />
```

**5. Agregar al sidebar** en `src/config/menu.js`:
```js
{ key: 'protocolos', label: 'Protocolos', icon: 'ti-clipboard', path: '/protocolos' }
```

**Listo**. La página queda integrada al sistema, con autenticación, sidebar activo, layout, estado de carga/error y mismo estilo editorial.

---

## 9. CONVENCIONES DE CÓDIGO

- **ES Modules**: `import x from 'y'` con extensiones `.js` y `.jsx` explícitas.
- **Sin TypeScript** por ahora — JS puro.
- **Comentarios en español** son aceptables, pero código en inglés (variables, funciones).
- **Imports relativos** con `../../`.
- **Default exports** para componentes y services. Named exports para hooks.
- **Naming**:
  - Componentes y páginas: `PascalCase.jsx`
  - Services: `PascalCase.js` (clases)
  - Hooks: `useCamelCase.js`
  - Variables CSS: `--kebab-case`
- **JSX**: prefiero `<Component variant="..." />` sobre múltiples props booleanos.
- **No usar `index` como `key`** en `.map()` cuando hay un id único disponible.

---

## 10. ÍTEMS DEL ANEXO N°3 Y DÓNDE SE CUMPLEN

| Ítem | Descripción | Ubicación |
|---|---|---|
| 1.1.a | Autoevaluación cumple/no cumple/no aplica | `/autoevaluacion` |
| 1.1.b | Visualización docs e indicadores vigentes y no vigentes | `/documental`, `/acreditacion` |
| 1.2.a | Creación de indicadores + cálculo % | `/acreditacion`, `/indicadores/:id` |
| 1.2.b | Cargar y modificar mediciones | `/indicadores/:id` |
| 1.2.c | Asignación responsables por característica | `/indicadores/:id`, `/usuarios` |
| 1.2.d | Vista previa y descarga PDF | Modal en `/documental` |
| 1.2.e | **Alarma email por retraso** | `/configuracion` → tab Notificaciones |
| 1.2.f | Monitoreo por ámbitos del Manual | `/acreditacion` |
| 1.2.g | Informes asociados a planes de mejora | `/reportes`, `/plan-mejora/:id` |
| 1.2.h | Gráficos históricos con pautas vinculadas | `/indicadores/:id` |
| 1.3.a | Cumplimiento obligatorias vs no obligatorias | `/autoevaluacion` |
| 1.3.b | Visualización por servicio/área/unidad | `/acreditacion`, `/organizacion` |
| 1.3.c | Monitoreo agrupado por servicio | `/acreditacion` |
| 1.3.d | Comparativa entre periodos | `/comparativa` |
| 2.a | Pauta evaluación NTB | `/autorizacion-sanitaria` |
| 2.b | Informe valorizado | `/autorizacion-sanitaria` tab 2 |
| 2.c | Informe de evaluación | `/autorizacion-sanitaria` tab 3 |
| 2.d | Historial de cambios por unidad | `/autorizacion-sanitaria` tab 4 |
| 3.1.a | Versionado con registro de cambios | `/documental` |
| 3.1.b | **Selector de versión por periodo** | Modal en `/documental` |
| 3.1.c | Alarma email vencimiento documento | `/configuracion` → Notificaciones |
| 3.1.d | Documentos históricos no visibles para no-admin | `/documental` tab Archivados |
| 3.1.e | **Ubicación en varias vistas** | Filtros en `/documental` |
| 3.2.a | Crear pautas vinculadas a indicadores | `/supervision` |
| 3.2.b | **Planificación con aviso email día programado** | Modal en `/supervision` |
| 3.2.c | Asignación responsables y suplentes | `/supervision`, `/usuarios` |
| 3.2.d | Informe consolidado pautas aplicadas | `/reportes` |
| 3.2.e | Búsqueda de pautas | `/busqueda` |
| 3.2.f | Monitoreo cumplimiento pautas | `/supervision` |
| 3.2.g | Gráfica criterios evaluados | `/indicadores/:id` |
| 4.1.a | Asignar responsables gestión eventos | `/catalogos-eventos` tab Asignaciones |
| 4.1.b | Notificación email al responsable | `/configuracion` → Notificaciones |
| 4.1.c | Estructura: ámbitos, tipos, medidas preventivas | `/catalogos-eventos` |
| 4.1.d | **Definir formularios de notificación** | `/formularios-eventos` |
| 4.1.e | **Asignar usuarios por servicio** | `/catalogos-eventos` tab Asignaciones |
| 4.1.f | Ingreso de ámbitos/eventos/medidas | `/catalogos-eventos` |
| 4.2.a | Verificación + clasificación + envío automático | `/eventos/:id` timeline |
| 4.2.b | Gestión: medidas + causas + plan + resumen email | `/eventos/:id` |
| 4.2.c | Evaluación Plan: actividades + evidencias | `/plan-mejora/:id` |
| 4.2.d | Seguimiento avance del plan | `/plan-mejora/:id` |
| 4.2.e | Estadísticas de eventos | `/eventos`, `/reportes` |
| 5.a | Indicadores + pautas en una sola ventana | `/mi-dia` |
| 5.b | Búsqueda documental con por vencer/vencidos | `/busqueda` + `/documental` |
| 5.c | Cálculo tamaño muestral | `/calculo-muestral` |
| 5.d | Información para gestión + respaldos | `/dashboard`, `/reportes` |
| 5.e | Notificación rápida de evento adverso | Botón en topbar de varias páginas |

---

## 11. COMANDOS

```bash
npm install         # instalar deps
npm run dev         # servidor desarrollo (http://localhost:5173)
npm run build       # build producción (dist/)
npm run preview     # preview del build
```

Variables de entorno (`.env`):
```
VITE_API_APP=http://localhost:5001
```

---

## 12. CHECKLIST PARA EL ASISTENTE IA (antes de cada cambio)

Antes de modificar código, verificar:

- [ ] ¿Esto se hace mejor con un componente UI ya existente? Revisar `src/components/ui/`.
- [ ] ¿Estoy usando tokens (`var(--color-*)`, clases `text-ink-950`, etc.) y NO hardcodeando colores?
- [ ] ¿La página tiene fallback `defaultXxx` si el backend no responde?
- [ ] ¿Estoy llamando a la API vía service (no directamente con axios/fetch)?
- [ ] ¿Si agrego una ruta, también la agregué a `App.jsx` y a `menu.js`?
- [ ] ¿La página importa `PageHeader` y usa la estructura `<><PageHeader /><div className="p-10 max-w-7xl">...</div></>`?
- [ ] ¿Estoy escribiendo en español de Chile (no español de España)?
- [ ] ¿Los inputs usan `.input-line` o `.input-box` + `.input-label`?
- [ ] ¿Los botones usan `<Button variant="..." />` o `.btn .btn-primary`?
- [ ] ¿Los badges semánticos usan las variantes (`ok`, `warn`, `danger`, `ink`, `accent`)?

---

## 13. NO HACER NUNCA

- ❌ Agregar Ant Design, Material UI, ni ninguna otra librería de UI.
- ❌ Usar `style={{...}}` inline.
- ❌ Hardcodear colores en hexadecimal en JSX.
- ❌ Llamar a `fetch()` o `axios.get()` directamente desde un componente.
- ❌ Crear archivos `.css` sueltos por componente — todo va a `tokens.css` o `components.css`.
- ❌ Bordes redondeados (`rounded-lg`, `border-radius`) — el diseño es editorial, sin radios.
- ❌ Usar emojis decorativos en la UI institucional (sí pueden ir en toasts breves).
- ❌ Duplicar markup que ya existe como componente.
- ❌ Cambiar la estructura de carpetas sin justificación.
- ❌ Modificar `Sidebar.jsx` para agregar items — eso va en `menu.js`.

---

## 14. REFERENCIAS

- `README.md` → cómo levantar el proyecto
- `STYLES.md` → documentación detallada del sistema de diseño
- Anexo N°3 del documento de licitación → fuente de los requisitos funcionales (46 ítems)

---

**Última actualización**: Mayo 2026 · Awna Digital Spa
