# VisibleTalent

Landing page local del proyecto VisibleTalent. HTML, CSS y JavaScript sin dependencias ni compilación.

## Ver la página en VS Code

Abre esta carpeta y ejecuta en la terminal:

```powershell
npm run dev
```

Visita http://localhost:5173. Después de editar y guardar, actualiza el navegador. Detén el servidor con Ctrl+C.

También puedes abrir `index.html` directamente en un navegador o usar la extensión Live Server de VS Code.

## Archivos

- `index.html`: contenido y secciones de la landing.
- `styles.css`: colores, tipografía, componentes y adaptación a móvil.
- `script.js`: pestañas del reporte, menú móvil y demostración de diagnóstico.
- El logo original se conserva en `assets/` como archivo de referencia y no se muestra ni se incluye en la publicación.
- `server.mjs`: servidor local de archivos públicos.
- `build.mjs`: prepara los archivos públicos en `dist/` para publicación.

## Blog

La sección «Nuestro blog», su tarjeta, el botón de portada y el enlace del pie llevan a https://visibletalent.blogspot.com/ en una pestaña nueva.

## Diseño

Referencia de estructura: https://uniride-movilidad.vercel.app/. La paleta se aplica a todas las secciones: azul como tono principal y en el nombre VisibleTalent, turquesa, violeta y fondos claros, con componentes inspirados en notas y documentos. Se utiliza únicamente el nombre de la propuesta como texto, sin logo.

Slogan oficial: «Juntos, por carreras más visibles y exitosas».

Sitio público: https://visibletalent.rodzu13.chatgpt.site/

## Preparar para publicación

```powershell
npm run check
npm run build
```

`dist/` contiene únicamente los archivos que debe servir el hosting. La configuración de Sites se conserva en `.openai/hosting.json`; no hay credenciales en ese archivo.

## Alcance

La página incluye una demostración con tres perfiles ficticios. No analiza CV reales, no crea cuentas y no envía ni almacena datos de postulantes. Los indicadores y recomendaciones de ejemplo están identificados como ilustrativos. La revisión por pares y el seguimiento se describen como funcionalidades futuras.

La tipografía se carga opcionalmente desde Google Fonts; hay fuentes alternativas para uso sin conexión. No se utilizan paquetes externos de JavaScript ni herramientas de analítica.

Validación de sintaxis: `npm run check`.
