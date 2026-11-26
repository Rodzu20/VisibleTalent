import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function loadPageTemplate(root) {
  const [index, ...content] = await Promise.all(['index.html', 'content/home.html', 'content/prueba-gratuita.html', 'content/descargar-app.html'].map(file => readFile(join(root, file), 'utf8')));
  return index.replace('</main>', `${content.join('\n')}\n</main>`);
}

export const PAGE_ROUTES = {
  '/': { name: 'Inicio', title: 'VisibleTalent · Juntos, por carreras más visibles y exitosas', sections: ['inicio', 'presentacion', 'proposito', 'valores', 'beneficios', 'como-funciona', 'ejemplo', 'confianza', 'preguntas', 'cierre'], description: 'Conoce VisibleTalent: orientación para presentar tus proyectos y habilidades en tu CV y preparar tus primeras postulaciones.' },
  '/planes': { name: 'Planes', title: 'Planes | VisibleTalent', sections: ['planes'], description: 'Explora los planes de la propuesta VisibleTalent y compara qué incluye cada alternativa para tu camino profesional.' },
  '/blog': { name: 'Blog', title: 'Blog | VisibleTalent', sections: ['blog'], description: 'Artículos y guías de VisibleTalent para preparar tu CV, presentar tus proyectos y explorar tu primer empleo.' },
  '/webinar': { name: 'Webinar', title: 'Webinar | VisibleTalent', sections: ['webinar'], description: 'Conoce el taller de VisibleTalent sobre proyectos universitarios, habilidades y preparación de un CV para tu primer empleo.' },
  '/prueba-gratuita': { name: 'Prueba gratuita', title: 'Prueba gratuita | VisibleTalent', sections: ['prueba-gratuita'], description: 'Explora recomendaciones para un CV con perfiles de ejemplo de Marketing, Sistemas y Administración. Sin subir archivos.' },
  '/descargar-app': { name: 'Descargar la app', title: 'Aplicación móvil | VisibleTalent', sections: ['descargar-app'], description: 'Conoce la propuesta móvil de VisibleTalent y registra tu interés en la experiencia para Android y iOS.' },
  '/registro': { name: 'Registro', title: 'Registro gratuito | VisibleTalent', sections: ['registro'], description: 'Registra tu interés en VisibleTalent con tu nombre y correo. Carrera opcional y comunicaciones por correo a tu elección.' },
};

export function normalizePagePath(pathname) {
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

export function renderPage(template, pathname, origin = 'https://visibletalent.vercel.app') {
  const path = normalizePagePath(pathname);
  const page = PAGE_ROUTES[path];
  if (!page) return null;
  const main = template.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);
  if (!main) throw new Error('Falta el contenido principal de la plantilla.');
  const sections = new Map();
  // La plantilla mantiene secciones hermanas, sin anidar etiquetas <section>.
  for (const match of main[1].matchAll(/<section\b([^>]*)>[\s\S]*?<\/section>/g)) {
    const id = match[1].match(/\bid="([^"]+)"/)?.[1];
    if (id) sections.set(id, match[0]);
  }
  const content = page.sections.map(id => {
    if (!sections.has(id)) throw new Error(`Falta la sección ${id} para ${path}.`);
    return sections.get(id);
  }).join('\n\n');
  const breadcrumb = path === '/' ? '' : `<div class="page-breadcrumb container" aria-label="Ubicación"><a href="/">Inicio</a><span aria-hidden="true">/</span><span>${page.name}</span></div>`;
  let html = template.replace(main[0], `<main id="contenido" class="${path === '/' ? 'home-page' : 'route-page'}">${breadcrumb}\n${content}\n</main>`);
  if (path === '/prueba-gratuita') {
    const dialog = html.match(/<dialog id="demo-dialog"[^>]*>([\s\S]*?)<\/dialog>/);
    if (!dialog) throw new Error('Falta la demostración de CV.');
    const inner = dialog[1].replace(/<button\b[^>]*data-close-dialog[^>]*>[\s\S]*?<\/button>/, '');
    html = html.replace(dialog[0], '').replace('<!-- DEMO_INLINE -->', `<div id="demo-dialog" class="demo-inline">${inner}</div>`);
  }
  if (path !== '/') {
    // Cada respuesta tiene su propio título principal, sin mostrar el Hero de Inicio.
    html = html.replace(/(<main\b[\s\S]*?)<h2\b([^>]*)>([\s\S]*?)<\/h2>/, '$1<h1$2>$3</h1>');
  }
  html = html.replace('<body>', `<body data-page="${path === '/' ? 'inicio' : path.slice(1)}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*/, `$1${page.description}`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*/, `$1${page.title}`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*/, `$1${page.description}`);
  for (const pattern of [/(<link rel="canonical" href=")[^"]*/, /(<meta property="og:url" content=")[^"]*/]) html = html.replace(pattern, `$1${origin}${path}`);
  html = html.replace(/<nav id="main-nav"[\s\S]*?<\/nav>/, nav => nav.replace(/<a\b([^>]*\bhref="([^"]+)"[^>]*)>/g, (tag, attributes, href) => href === path ? `<a${attributes} aria-current="page">` : tag));
  return html;
}
