# VisibleTalent

Landing page del proyecto VisibleTalent. HTML, CSS y JavaScript con una función de registro y almacenamiento privado en Vercel Blob.

Código fuente: https://github.com/Rodzu20/VisibleTalent

Al clonar el repositorio, ejecuta `npm ci`. La plantilla `.env.example` indica la variable de servidor necesaria para guardar registros; las credenciales reales y los contactos se conservan fuera de GitHub.

## Ver la página en VS Code

Abre esta carpeta, instala las dependencias con `npm install` y ejecuta en la terminal:

```powershell
npm run dev
```

Visita http://localhost:5173. Después de editar y guardar, actualiza el navegador. Detén el servidor con Ctrl+C.

Para probar el registro utiliza este servidor, no Live Server ni la apertura directa de `index.html`. `.env.local` contiene la conexión privada para desarrollo y nunca debe compartirse, incluirse en Git ni publicarse. Si falta, ejecuta `npx --yes vercel@latest env pull .env.local` desde la carpeta vinculada al proyecto.

## Archivos

- `index.html`: contenido y secciones de la landing.
- `styles.css`: colores, tipografía, componentes y adaptación a móvil.
- `script.js`: pestañas del reporte, menú móvil, envío del formulario y demostración de recomendaciones.
- `api/registro.js`: función de Vercel que recibe los registros.
- `lib/registration.mjs`: validación, límites y respuestas de la API.
- `lib/registration-store.mjs`: guardado privado sin duplicar correos ni sobreescribir consentimientos anteriores.
- `scripts/export-registrations.mjs`: exportación local de los registros a CSV.
- El logo original se conserva en `assets/` como archivo de referencia y no se muestra ni se incluye en la publicación.
- `server.mjs`: servidor local de archivos públicos.
- `build.mjs`: prepara los archivos públicos en `dist/` para publicación.

## Blog

El apartado complementario del blog y el enlace del pie llevan a https://visibletalent.blogspot.com/ en una pestaña nueva. La portada concentra la acción en explorar un ejemplo gratuito de recomendaciones para el CV.
El header incluye acceso directo a Inicio, Beneficios, Cómo funciona, Blog y Preguntas, además del botón de registro. El enlace Blog abre directamente el blog en una pestaña nueva.

## Diseño

Referencia de estructura: https://uniride-movilidad.vercel.app/. La paleta se aplica a todas las secciones: azul como tono principal y en el nombre VisibleTalent, turquesa, violeta y fondos claros, con componentes inspirados en notas y documentos. Se utiliza únicamente el nombre de la propuesta como texto, sin logo.

Slogan oficial: «Juntos, por carreras más visibles y exitosas».

Tipografía principal: Manrope para títulos, texto, nombre y botones; las etiquetas de las notas conservan su estilo monoespaciado.

Sitio público activo: https://visibletalent.vercel.app/

## Preparar para publicación

```powershell
npm run check
npm run build
```

`dist/` contiene únicamente los archivos que debe servir el hosting. La configuración de Sites se conserva en `.openai/hosting.json`; no hay credenciales en ese archivo.

## Publicación en Vercel

`vercel.json` configura el proyecto como sitio estático y publica únicamente `dist/`. `.vercelignore` excluye los archivos del alojamiento anterior y los recursos sin uso.

La landing ya está publicada en el proyecto `visibletalent` de Vercel. Para publicar cambios desde esta carpeta con la cuenta autorizada:

```powershell
npm run deploy
```

Si la sesión caduca, ejecuta `npx --yes vercel@latest login`. Durante la compilación, `VERCEL_PROJECT_PRODUCTION_URL` ajusta los metadatos a la dirección real del proyecto. También puedes usar `SITE_URL` para un dominio HTTPS propio. La configuración `.openai/hosting.json` pertenece al alojamiento anterior; las actualizaciones de esta landing se publican en Vercel con el comando anterior.

## Alcance

La página incluye una demostración con tres perfiles ficticios y un formulario que sí guarda los datos de registro. No analiza CV reales ni crea cuentas de acceso con contraseña. Los indicadores y recomendaciones de la demostración están identificados como ilustrativos.

La acción principal es registrarse mediante nombre y correo, con carrera opcional. Los enlaces «Quiero mejorar mi CV» y «Registrarme gratis» llevan a `#registro`. La aceptación para guardar el registro es obligatoria; recibir consejos y novedades por correo es una opción separada, desmarcada por defecto. Tras guardar se muestra la confirmación y el acceso a la demo. También se puede ver un ejemplo antes de registrarse.

## Consultar y exportar los registros

Los datos se guardan en el almacén privado `visibletalent-registros`, dentro de `registrations/v1/`. Puedes consultarlos con tu cuenta en el apartado Storage del proyecto en Vercel. No hay una API pública para listar contactos ni credenciales en el navegador.

Para exportar a un archivo CSV compatible con Excel:

```powershell
npm run export:registros
```

El CSV se guarda en `private-exports/`, excluida de Git, de Vercel y del servidor público. Incluye nombre, correo, carrera, aceptación del registro, preferencia de correos, fecha y versión del aviso. Para campañas de correo, filtra únicamente «Acepto correos = Sí». Los usuarios no verifican la propiedad del correo en esta versión; el formulario no crea cuentas de acceso ni envía correos de bienvenida o campañas automáticamente.

Para eliminar un registro, bórralo desde el almacén privado en Vercel. Volver a enviar un correo ya registrado no modifica sus datos ni sus preferencias. No reutilices esa operación como actualización de consentimiento.

Los detalles de almacenamiento se basan en la [documentación de Vercel Blob privado](https://vercel.com/docs/vercel-blob/private-storage). La configuración actual usa el plan Hobby, sin activar suscripciones de pago.

La tipografía se carga opcionalmente desde Google Fonts; hay fuentes alternativas para uso sin conexión. `@vercel/blob` se utiliza únicamente en el servidor. No se utilizan herramientas de analítica.

Validación de sintaxis: `npm run check`. Pruebas de validación y manejo de errores: `npm test`.
