import { list, get } from '@vercel/blob';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Falta la conexión privada. Ejecuta npx --yes vercel@latest env pull .env.local y vuelve a intentar.');
  process.exit(1);
}
const rows = [['Nombre', 'Correo', 'Carrera', 'Acepto registro', 'Acepto correos', 'Fecha UTC', 'Version del aviso', 'Origen']];
let cursor;
do {
  const page = await list({ prefix: 'registrations/v1/', limit: 1000, cursor });
  for (const blob of page.blobs) {
    const response = await get(blob.url, { access: 'private', useCache: false });
    if (!response || response.statusCode !== 200) throw new Error('No se pudo leer un registro.');
    const lead = await new Response(response.stream).json();
    rows.push([lead.name, lead.email, lead.career, lead.privacyAccepted ? 'Sí' : 'No', lead.marketingConsent ? 'Sí' : 'No', lead.createdAt, lead.privacyVersion, lead.source]);
  }
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);
const csvCell = value => {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
const folder = fileURLToPath(new URL('../private-exports/', import.meta.url));
await mkdir(folder, { recursive: true });
const destination = `${folder}VisibleTalent_Registros_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
await writeFile(destination, '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'), 'utf8');
console.log(`Exportados ${rows.length - 1} registros a ${destination}`);
