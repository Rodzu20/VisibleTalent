import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import registrationHandler from './api/registro.js';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
const publicFiles = new Set(['index.html', 'styles.css', 'script.js', 'favicon.png', 'favicon.ico', 'apple-touch-icon.png']);

const server = createServer(async (req, res) => {
  if (new URL(req.url, 'http://localhost').pathname === '/api/registro') {
    await registrationHandler(req, res);
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Método no permitido');
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const path = resolve(root, relative);
    if (!publicFiles.has(relative) || !path.startsWith(root + sep)) {
      res.writeHead(404);
      res.end('Archivo no encontrado');
      return;
    }
    const content = await readFile(path);
    res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch {
    res.writeHead(404);
    res.end('Archivo no encontrado');
  }
});
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `El puerto ${port} está ocupado. Usa otro con $env:PORT=5174; npm run dev` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`VisibleTalent disponible en http://localhost:${port}`));
