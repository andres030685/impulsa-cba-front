---
name: seo-content
description: Genera y revisa páginas del frontend con criterios de SEO moderno, optimizado para buscadores y para comprensión por modelos de IA.
user_invocable: true
---

# SEO Content — Skill para revisión y generación de contenido SEO

Cuando el usuario invoque esta skill sobre una página o componente, seguí este proceso:

## 1. Análisis de intención de búsqueda

Antes de tocar el código, identificá:
- ¿Qué busca el usuario objetivo cuando llega a esta página?
- ¿Qué problema resuelve o qué acción debe tomar?
- ¿Es intención informacional, transaccional o navegacional?

Priorizá la intención de búsqueda por sobre el diseño visual.

## 2. Revisión de estructura semántica

Verificá y corregí:
- **`<title>`**: único, descriptivo, con keyword principal, máximo 60 caracteres.
- **`meta description`**: llamada a la acción clara, máximo 155 caracteres, sin repetir el title.
- **`<h1>`**: uno solo por página, que refleje la intención de búsqueda.
- **`<h2>` / `<h3>`**: jerarquía coherente, sin saltos de nivel, que funcionen como outline del contenido.
- **Contenido escaneable**: párrafos cortos, listas, negritas en puntos clave.

Si la página usa Angular, revisá que los tags SEO se manejen correctamente (por ejemplo, vía `Meta` y `Title` services de `@angular/platform-browser`, o SSR si aplica).

## 3. Copy y contenido

Escribí o reescribí copy que sea:
- **Claro**: sin jerga innecesaria ni frases vacías ("soluciones integrales", "líderes en el mercado").
- **Específico**: datos concretos, beneficios reales, diferenciadores verificables.
- **Útil**: que el usuario obtenga valor al leer, no solo relleno.
- **Orientado a conversión**: cada sección debe acercar al usuario a la acción deseada (contacto, registro, compra).

## 4. Optimización para IA (AIO — AI Overview Optimization)

Además del SEO clásico, optimizá para que modelos de IA puedan interpretar y resumir el contenido:
- **Respuestas directas**: incluí definiciones o respuestas en las primeras líneas de cada sección.
- **FAQs**: agregá solo cuando aporten valor real, con preguntas que la gente realmente haría.
- **Entidades claras**: mencioná explícitamente nombres, ubicaciones, servicios con contexto suficiente.
- **Estructura predecible**: usá patrones que los LLMs puedan parsear (listas, tablas, definiciones).

## 5. SEO técnico

Cuando aplique, sugerí o implementá:
- **`<link rel="canonical">`**: para evitar contenido duplicado.
- **Open Graph tags**: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- **Twitter Card tags**: `twitter:card`, `twitter:title`, `twitter:description`.
- **Structured Data / Schema Markup** (JSON-LD): según el tipo de página:
  - `Organization` / `LocalBusiness` para home o about.
  - `Service` para páginas de servicios.
  - `FAQPage` para secciones de preguntas frecuentes.
  - `BreadcrumbList` para navegación.
- **Hreflang**: si hay versiones en múltiples idiomas.
- **Robots meta**: si alguna página no debe indexarse.

## 6. Enfoque comercial

No optimices solo para tráfico. Cada recomendación debe considerar:
- ¿Esto acerca al usuario a convertir?
- ¿El contenido diferencia a ImpulsaCBA de la competencia?
- ¿Los CTAs son claros y están bien posicionados?

## Formato de respuesta

Cuando revises una página existente, respondé con esta estructura:

### Problemas detectados
Lista de errores SEO concretos encontrados en la página.

### Oportunidades
Mejoras que pueden implementarse para ganar visibilidad o conversión.

### Propuesta de mejora
Cambios concretos con código o copy listo para usar.

### Implementación
Código Angular con los cambios aplicados. Si es necesario, incluí:
- Modificaciones al component (`.ts`) para setear meta tags dinámicos.
- Modificaciones al template (`.html`) para estructura semántica.
- Schema markup en JSON-LD.

## Reglas

- No expliques teoría SEO. Actuá directamente.
- No propongas cambios cosméticos que no impacten en SEO o conversión.
- Si la página está bien, decilo. No inventes problemas.
- Adaptá las recomendaciones al stack del proyecto (Angular, TypeScript).
- Usá español rioplatense en el copy, consistente con el tono del proyecto.
