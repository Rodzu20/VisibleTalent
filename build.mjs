import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const files = ['index.html', 'styles.css', 'script.js'];
// Retira únicamente el logo que publicaba la versión anterior.
await rm(join(root, 'dist', 'assets', 'visibletalent-logo.png'), { force: true });
for (const file of files) {
  const destination = join(root, 'dist', file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(root, file), destination);
}
console.log(`VisibleTalent: ${files.length} archivos públicos preparados en dist/.`);
