import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const files = ['index.html', 'styles.css', 'script.js', 'favicon.png', 'favicon.ico', 'apple-touch-icon.png'];
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
  if (file === 'index.html' && publicOrigin) {
    const html = await readFile(join(root, file), 'utf8');
    const withCanonical = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${publicOrigin}/$2`);
    const withSocialUrl = withCanonical.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${publicOrigin}/$2`);
    await writeFile(destination, withSocialUrl, 'utf8');
  } else {
    await copyFile(join(root, file), destination);
  }
}
console.log(`VisibleTalent: ${files.length} archivos públicos preparados en dist/.`);
