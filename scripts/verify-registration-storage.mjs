import { createHash, randomUUID } from 'node:crypto';
import { get, del } from '@vercel/blob';
import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:5174';
const origin = new URL(base).origin;
const email = `verification-${randomUUID()}@example.invalid`;
const pathname = `registrations/v1/${createHash('sha256').update(email).digest('hex')}.json`;
let created = false;
try {
  const body = { name: 'Prueba técnica temporal', email, career: 'Prueba técnica', privacyAccepted: true, marketingConsent: false };
  const submit = () => fetch(`${base}/api/registro`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
  const response = await submit();
  assert.equal(response.status, 200, `API status ${response.status}`);
  assert.deepEqual(await response.json(), { ok: true });
  created = true;
  const saved = await get(pathname, { access: 'private', useCache: false });
  assert.ok(saved);
  const lead = await new Response(saved.stream).json();
  assert.equal(lead.email, email);
  assert.equal(lead.marketingConsent, false);
  assert.equal(lead.privacyAccepted, true);
  const repeated = await submit();
  assert.equal(repeated.status, 200);
  const privateUrl = saved.blob.url;
  if (privateUrl) {
    const anonymous = await fetch(privateUrl);
    assert.ok([401, 403, 404].includes(anonymous.status), `Private blob returned ${anonymous.status}`);
  }
  console.log('Registro real verificado: guardado privado, consentimiento conservado y reintento sin duplicado.');
} finally {
  if (created) { await del(pathname); console.log('Registro temporal de prueba eliminado. No se enviaron correos.'); }
}
