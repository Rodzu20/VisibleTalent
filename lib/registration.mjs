export const PRIVACY_VERSION = '2026-11-10';
export const MAX_BODY_BYTES = 4096;

export class RegistrationError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function cleanText(value, maximum, required = false) {
  if (typeof value !== 'string') {
    if (!required && value === undefined) return '';
    throw new RegistrationError(400, 'Revisa los datos del formulario.');
  }
  const text = value.normalize('NFC').trim().replace(/\s+/g, ' ');
  if ((required && text.length < 2) || text.length > maximum || /[<>\u0000-\u001f]/.test(text)) {
    throw new RegistrationError(400, 'Revisa el nombre y la carrera que ingresaste.');
  }
  return text;
}

export function validateRegistration(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RegistrationError(400, 'Revisa los datos del formulario.');
  const name = cleanText(body.name, 80, true);
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    throw new RegistrationError(400, 'Escribe un correo electrónico válido.');
  }
  if (body.privacyAccepted !== true) throw new RegistrationError(400, 'Necesitamos tu aceptación para guardar el registro.');
  if (typeof body.marketingConsent !== 'boolean') throw new RegistrationError(400, 'Revisa tu preferencia de comunicaciones.');
  return { name, email, career: cleanText(body.career, 120), privacyAccepted: true, marketingConsent: body.marketingConsent, privacyVersion: PRIVACY_VERSION };
}

async function readBody(req) {
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) throw new RegistrationError(413, 'El formulario contiene demasiados datos.');
  // Vercel proporciona req.body; el servidor local utiliza el mismo validador.
  let body;
  try { body = req.body; } catch { throw new RegistrationError(400, 'No pudimos leer el formulario.'); }
  if (body !== undefined) {
    if (Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body)) > MAX_BODY_BYTES) throw new RegistrationError(413, 'El formulario contiene demasiados datos.');
    try { return typeof body === 'string' ? JSON.parse(body) : body; } catch { throw new RegistrationError(400, 'No pudimos leer el formulario.'); }
  }
  let text = '';
  for await (const chunk of req) {
    text += chunk.toString();
    if (Buffer.byteLength(text) > MAX_BODY_BYTES) throw new RegistrationError(413, 'El formulario contiene demasiados datos.');
  }
  try { return JSON.parse(text); } catch { throw new RegistrationError(400, 'No pudimos leer el formulario.'); }
}

export function createRegistrationHandler({ save, available, origins }) {
  return async (req, res) => {
    const reply = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, { error: 'Usa el formulario para enviar tu registro.' }); }
    if (!origins().includes(req.headers.origin)) return reply(403, { error: 'Envía el formulario desde la página de VisibleTalent.' });
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') return reply(415, { error: 'No pudimos leer el formulario.' });
    try {
      const body = await readBody(req);
      // Campo trampa: se rechaza sin registrar ni mostrar una confirmación falsa.
      if (body?.companyWebsite) throw new RegistrationError(400, 'No pudimos enviar este registro. Actualiza la página e inténtalo otra vez.');
      const lead = validateRegistration(body);
      if (!available()) throw new RegistrationError(503, 'El registro no está disponible por el momento. Inténtalo más tarde.');
      await save({ ...lead, createdAt: new Date().toISOString(), source: 'visibletalent-landing' });
      return reply(200, { ok: true });
    } catch (error) {
      // Nunca registrar nombres, correos, cuerpos del formulario o credenciales.
      if (!(error instanceof RegistrationError)) console.error('registration_save_failed');
      return reply(error instanceof RegistrationError ? error.status : 503, { error: error instanceof RegistrationError ? error.message : 'No pudimos guardar tu registro. Vuelve a intentarlo en unos momentos.' });
    }
  };
}
