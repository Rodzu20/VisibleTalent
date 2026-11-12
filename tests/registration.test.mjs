import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRegistrationHandler, validateRegistration, RegistrationError } from '../lib/registration.mjs';

const valid = { name: 'Persona de prueba', email: 'qa@example.invalid', career: '', privacyAccepted: true, marketingConsent: false };
test('normaliza datos y conserva que recibir correos es opcional', () => {
  const lead = validateRegistration({ ...valid, name: '  Persona  de prueba ', email: ' QA@Example.Invalid ' });
  assert.equal(lead.email, 'qa@example.invalid');
  assert.equal(lead.name, 'Persona de prueba');
  assert.equal(lead.marketingConsent, false);
  assert.equal(lead.career, '');
});
test('rechaza datos incompletos, consentimientos inválidos y longitudes excesivas', () => {
  for (const patch of [{ name: '' }, { email: 'invalido' }, { email: 'a'.repeat(255) + '@test.invalid' }, { privacyAccepted: false }, { privacyAccepted: 'true' }, { marketingConsent: 'yes' }, { career: 'a'.repeat(121) }, { name: '<script>' }]) {
    assert.throws(() => validateRegistration({ ...valid, ...patch }), RegistrationError);
  }
});
test('la API solo confirma cuando el almacenamiento termina y no expone datos', async () => {
  const saved = [];
  let available = true;
  let failure = false;
  const handler = createRegistrationHandler({ origins: () => ['https://visibletalent.vercel.app'], available: () => available, save: async lead => { if (failure) throw new RegistrationError(503, 'No disponible'); saved.push(lead); } });
  const server = createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/registro`;
  const submit = (body, options = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://visibletalent.vercel.app', ...options.headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
  try {
    assert.equal((await fetch(url)).status, 405);
    assert.equal((await submit(valid, { headers: { Origin: 'https://other.invalid' } })).status, 403);
    assert.equal((await submit(valid, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
    assert.equal((await submit('{malformed')).status, 400);
    assert.equal((await submit({ ...valid, companyWebsite: 'bot' })).status, 400);
    assert.equal((await submit({ ...valid, career: 'x'.repeat(5000) })).status, 413);
    assert.equal((await submit({ ...valid, privacyAccepted: false })).status, 400);
    assert.equal(saved.length, 0);
    available = false;
    assert.equal((await submit(valid)).status, 503);
    assert.equal(saved.length, 0);
    available = true; failure = true;
    assert.equal((await submit(valid)).status, 503);
    assert.equal(saved.length, 0);
    failure = false;
    const response = await submit(valid);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(saved.length, 1);
    assert.equal(saved[0].marketingConsent, false);
    assert.ok(saved[0].createdAt);
    assert.equal(saved[0].source, 'visibletalent-landing');
  } finally { await new Promise(resolve => server.close(resolve)); }
});
