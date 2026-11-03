import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const files = ['index.html', 'styles.css', 'script.js', 'assets/visibletalent-logo.png'];
for (const file of files) {
  const destination = join(root, 'dist', file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(root, file), destination);
}
console.log(`VisibleTalent: ${files.length} archivos públicos preparados en dist/.`);
