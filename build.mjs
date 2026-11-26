import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_ROUTES, renderPage, loadPageTemplate } from './lib/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const files = ['styles.css', 'script.js', 'favicon.png', 'favicon.ico', 'apple-touch-icon.png'];
const publicUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null);
let publicOrigin;
if (publicUrl) {
  const url = new URL(publicUrl);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('SITE_URL debe ser una URL HTTPS pública sin credenciales.');
  publicOrigin = url.origin;
}
// Retira únicamente el logo que publicaba la versión anterior.
await rm(join(root, 'dist', 'assets', 'visibletalent-logo.png'), { force: true });
await rm(join(root, 'dist', 'favicon.svg'), { force: true });
for (const file of files) {
  const destination = join(root, 'dist', file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(root, file), destination);
}
const template = await loadPageTemplate(root);
for (const pathname of Object.keys(PAGE_ROUTES)) {
  const filename = pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`;
  await writeFile(join(root, 'dist', filename), renderPage(template, pathname, publicOrigin), 'utf8');
}
console.log(`VisibleTalent: ${Object.keys(PAGE_ROUTES).length} páginas con URL propia y ${files.length} recursos preparados en dist/.`);
