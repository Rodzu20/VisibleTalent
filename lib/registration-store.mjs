import { createHash } from 'node:crypto';
import { put, head, BlobNotFoundError } from '@vercel/blob';

export async function saveRegistration(lead) {
  const id = createHash('sha256').update(lead.email).digest('hex');
  const pathname = `registrations/v1/${id}.json`;
  try {
    await head(pathname);
    return;
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) throw error;
  }
  try {
    await put(pathname, JSON.stringify(lead), {
      access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: false,
    });
  } catch (error) {
    // Reintentos y registros repetidos no crean duplicados ni sobreescriben consentimientos.
    // La respuesta es la misma para no revelar si un correo ya está registrado.
    try { await head(pathname); } catch { throw error; }
  }
}
