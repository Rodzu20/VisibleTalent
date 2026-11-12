import { createRegistrationHandler } from '../lib/registration.mjs';
import { saveRegistration } from '../lib/registration-store.mjs';

export default createRegistrationHandler({
  save: saveRegistration,
  available: () => Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  origins: () => [
    'https://visibletalent.vercel.app',
    ...[process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean).map(host => `https://${host}`),
    ...(process.env.VERCEL ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174']),
  ],
});
