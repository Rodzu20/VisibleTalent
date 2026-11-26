import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { PAGE_ROUTES, loadPageTemplate, renderPage } from '../lib/pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const template = await loadPageTemplate(root);

test('cada URL muestra únicamente las secciones de su propia página', () => {
  for (const [path, page] of Object.entries(PAGE_ROUTES)) {
    const html = renderPage(template, path);
    const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
    assert.equal((main.match(/<h1\b/g) || []).length, 1, `Título principal en ${path}`);
    for (const id of page.sections) assert.ok(main.includes(`id="${id}"`), `Falta ${id} en ${path}`);
    if (path !== '/') assert.equal(main.includes('id="inicio"'), false, `Inicio se filtra en ${path}`);
    assert.ok(html.includes(`href="https://visibletalent.vercel.app${path}"`));
    assert.ok(html.includes('href="/styles.css"'));
    assert.ok(html.includes('src="/script.js"'));
    assert.ok(html.includes('aria-current="page"'));
  }
});
test('la prueba incluye un único formulario de ejemplo dentro de la página', () => {
  const html = renderPage(template, '/prueba-gratuita');
  assert.equal((html.match(/id="demo-profile"/g) || []).length, 1);
  assert.ok(html.includes('class="demo-inline"'));
  assert.equal(html.includes('<!-- DEMO_INLINE -->'), false);
});
test('la presentación institucional tiene su propia vista, fuera de Inicio', () => {
  const home = renderPage(template, '/');
  assert.equal(home.includes('Nuestra misión'), false);
  assert.equal(home.includes('Nuestra visión'), false);
  assert.equal(home.includes('NUESTROS VALORES'), false);
  assert.equal(home.includes('NUESTRA PROPUESTA DE VALOR'), false);
  assert.equal(home.includes('id="equipo"'), false);
  const team = renderPage(template, '/equipo');
  assert.ok(team.includes('Nuestra misión'));
  assert.ok(team.includes('Nuestra visión'));
  assert.ok(team.includes('NUESTRA PROPUESTA DE VALOR'));
  assert.ok(team.includes('NUESTROS VALORES'));
  assert.ok(team.includes('id="equipo"'));
  assert.ok(team.includes('aria-current="page"'));
  assert.equal(team.includes('id="inicio"'), false);
  assert.equal(/<video|youtube\.com\/embed/.test(home), false);
  assert.equal(home.includes('id="planes"'), false);
  assert.equal(home.includes('id="registro"'), false);
});
test('las rutas desconocidas no devuelven Inicio y las barras finales mantienen la página', () => {
  assert.equal(renderPage(template, '/no-existe'), null);
  assert.equal(renderPage(template, '/planes/'), renderPage(template, '/planes'));
});
