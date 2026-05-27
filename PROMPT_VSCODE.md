# PROMPT PARA PEGAR EN EL CHAT (Claude/Cursor) AL ABRIR EL PROYECTO

Copia y pega esto al iniciar una sesión nueva con Claude/Cursor sobre este proyecto:

---

```
Hola. Antes de pedirte cualquier cosa, lee el archivo CLAUDE.md de la raíz del proyecto, contiene todo el contexto que necesitas.

Resumen rápido para que ya partas con la idea:

CONTEXTO:
- Soy Awna Digital Spa, construí este sistema para una licitación pública chilena (2421-16-LE26) de la Dirección de Salud Municipal de Concepción.
- Es un Sistema de Gestión Documental Web de Calidad que cubre 46 ítems funcionales del Anexo N°3 del pliego.
- 5 módulos: Acreditación de prestadores, Autorización Sanitaria NTB, Gestión documental + Pautas de supervisión, Eventos adversos + Planes de mejora, y herramientas (búsqueda, cálculo muestral, reportes, workspace unificado).

STACK:
- React 18 + Vite + React Router v7 + TanStack Query + Axios + Tailwind v4
- SIN Ant Design. Sistema de UI 100% propio, editorial (Fraunces serif + Inter + paleta tinta/papel/bronce).
- Backend Node+Express+MongoDB+JWT en repo separado, URL vía VITE_API_APP.

ARQUITECTURA OBLIGATORIA:
- Flujo de datos: Page → Hook (React Query) → Service (Axios) → API. Sin saltarse pasos.
- Una sola instancia axios en src/apis/app.js. Nunca crear otra.
- 15 services, una clase por dominio (Auth, Users, Indicators, etc.).
- Hooks en src/hooks/ por dominio.
- 21 páginas en src/pages/private/ y src/pages/public/.
- Sidebar configurado en src/config/menu.js — única fuente de verdad del menú.

SISTEMA DE DISEÑO (regla dura):
- Tokens CSS en src/styles/tokens.css (colores, fuentes, espacios).
- Clases reutilizables en src/styles/components.css.
- Componentes UI compartidos en src/components/ui/ — importar SIEMPRE desde el barrel index.js.
- PROHIBIDO: style={{...}} inline, colores hexa hardcodeados en JSX, recrear botones/badges/cards a mano, bordes redondeados (el diseño es editorial sin radius), emojis decorativos.
- Componentes disponibles: PageHeader, Badge, Button, Card, KpiCard, ProgressBar, Modal, Loader, EmptyState, ErrorState, useToast.
- Variantes semánticas: ok, warn, danger, ink, accent, default.

CONVENCIONES:
- ES Modules con extensiones .js/.jsx explícitas en imports.
- Sin TypeScript.
- Comentarios en español ok. Variables/funciones en inglés.
- Default exports para componentes y services. Named exports para hooks.
- Estructura típica de página: <><PageHeader /><div className="p-10 max-w-7xl">...</div></>
- Cada página tiene fallback `defaultXxx` para que renderice sin backend.

CÓMO HABLO YO:
- Español de Chile, informal. Tú me puedes responder igual (informal chileno).
- Cuando escribas texto que verá el usuario final del sistema, ahí sí en español formal/institucional.

QUÉ NECESITO AHORA:
[ACÁ ESCRIBE LO QUE NECESITAS — POR EJEMPLO:]
- "Quiero probar el login pero no tengo backend, agrégame un modo demo."
- "Agrégame una página /protocolos siguiendo la receta del CLAUDE.md."
- "Revisa el archivo Eventos.jsx y dime si cumple con las reglas del sistema de diseño."
- "Cámbiame los colores del sidebar a un azul más institucional, manteniendo el sistema centralizado."

Antes de cualquier cambio, sigue el checklist de la sección 12 del CLAUDE.md.
```

---

## VARIANTE CORTÍSIMA (si tienes prisa)

```
Lee CLAUDE.md en la raíz antes de hacer cualquier cosa. Es el contexto completo del proyecto. Resumen: React + Vite + Tailwind v4 + React Query + Axios. Sin Ant Design. Sistema de UI editorial 100% propio (Fraunces/Inter, paleta tinta/papel/bronce, sin radius). 21 páginas para un sistema de gestión de calidad de salud pública chilena. Flujo: Page → Hook → Service → API. Componentes UI en src/components/ui/ — usar SIEMPRE esos, no recrear. Tokens en src/styles/tokens.css. Reglas duras: cero inline styles, cero colores hardcodeados, cero librerías de UI. Sigue checklist sección 12 del CLAUDE.md antes de cada cambio.

Hablo en español de Chile informal. Responde igual.

[acá tu pedido]
```

---

## CONFIGURAR `.cursorrules` (si usas Cursor)

Si trabajas con Cursor IDE, copia el contenido de CLAUDE.md a un archivo `.cursorrules` en la raíz. Cursor lo lee automáticamente en cada conversación.

```bash
cp CLAUDE.md .cursorrules
```
