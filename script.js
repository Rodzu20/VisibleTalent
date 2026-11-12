const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// Todos los datos de la demo son ficticios y se muestran sin procesamiento remoto.
const reportPanels = {
  resumen: `<div class="score-summary"><div class="score-ring"><div><strong>78<span style="font-size:12px;letter-spacing:0">/100</span></strong><small>Índice ilustrativo</small></div></div><div class="score-copy"><strong>Vas por buen camino</strong><p>Tu CV tiene una buena base. Hay oportunidades para contar mejor tus proyectos.</p></div></div><div class="report-recommendation">${icon('spark')}<div><strong>Tu siguiente mejora</strong><p>Explica tu aporte en el proyecto de campaña digital.</p></div></div>`,
  palabras: `<p class="report-title">Tu perfil frente a la oferta</p><div class="keyword-list"><span class="keyword">✓ Marketing digital</span><span class="keyword">✓ Contenido</span><span class="keyword">✓ Excel</span><span class="keyword missing">Por revisar: análisis de audiencia</span></div><p class="report-explainer">La oferta menciona análisis de audiencia. Si lo aplicaste en un proyecto, explica cómo. Incluye solo habilidades reales.</p>`,
  estructura: `<p class="report-title">Un documento más fácil de recorrer</p><div class="structure-item"><span>Información de contacto</span><span>Clara ✓</span></div><div class="structure-item"><span>Formación y habilidades</span><span>Presentes ✓</span></div><div class="structure-item"><span>Descripción de proyectos</span><span>Por mejorar ↗</span></div><p class="report-explainer">Resultados ilustrativos sobre el CV de ejemplo.</p>`
};

const tabs = [...document.querySelectorAll('[data-tab]')];
function activateTab(tab, focus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const panel = document.querySelector('#report-panel');
  panel.innerHTML = reportPanels[tab.dataset.tab];
  panel.setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      activateTab(tabs[next], true);
    }
  });
});
activateTab(tabs[0]);

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a, button').forEach((element) => element.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);

const profiles = {
  marketing: {
    name: 'Valeria · Estudiante de Marketing',
    summary: 'Preparó una campaña académica para un emprendimiento local. En su CV menciona el proyecto, pero no explica sus tareas.',
    target: 'Oferta: contenido digital, análisis de audiencia y Excel.',
    recommendations: [
      ['Describe tu aporte', 'Explica si investigaste la audiencia, propusiste contenido o construiste un calendario. Usa acciones que realmente realizaste.'],
      ['Conecta con la oferta', 'El análisis de audiencia aparece en la vacante. Si lo aplicaste en el curso, describe el método y el entregable.'],
      ['Organiza tus herramientas', 'Agrupa herramientas como Excel y plataformas de contenido en una sección de habilidades, indicando tu nivel real.']
    ]
  },
  desarrollo: {
    name: 'Diego · Egresado de Ingeniería de Sistemas',
    summary: 'Creó una aplicación web para un curso. Su CV enumera lenguajes de programación sin relacionarlos con el proyecto.',
    target: 'Oferta: JavaScript, Git y desarrollo de interfaces web.',
    recommendations: [
      ['Explica qué construiste', 'Describe la función de la aplicación, qué parte desarrollaste y con qué tecnologías trabajaste.'],
      ['Muestra evidencia', 'Si tienes un repositorio público sin datos privados, añade un enlace y un README que explique cómo ejecutar el proyecto.'],
      ['Relaciona habilidades y proyectos', 'Si utilizaste JavaScript y Git, menciona en qué tareas. No agregues tecnologías solo por aparecer en la oferta.']
    ]
  },
  administracion: {
    name: 'Lucía · Estudiante de Administración',
    summary: 'Coordinó actividades de un voluntariado y creó una hoja de seguimiento. En su CV solo figura el nombre de la organización.',
    target: 'Oferta: organización de procesos, seguimiento y Excel.',
    recommendations: [
      ['Haz visible tu responsabilidad', 'Explica qué actividades coordinaste y cómo organizaste al equipo. El voluntariado también puede demostrar habilidades.'],
      ['Describe el recurso que creaste', 'Cuenta para qué servía la hoja de seguimiento y cómo ayudaba a organizar las tareas, sin inventar porcentajes de mejora.'],
      ['Prioriza la información pertinente', 'Coloca el voluntariado y tus herramientas cerca de la formación para que se identifique su relación con la vacante.']
    ]
  }
};

const demoDialog = document.querySelector('#demo-dialog');
const appDialog = document.querySelector('#app-dialog');
const profileSelect = document.querySelector('#demo-profile');
const selection = document.querySelector('#demo-selection');
const result = document.querySelector('#demo-result');
let dialogTrigger;

function renderProfile() {
  const profile = profiles[profileSelect.value];
  document.querySelector('#sample-profile').innerHTML = `<strong>${profile.name}</strong><p>${profile.summary}</p><small>${profile.target}</small>`;
}
function resetDemo() {
  selection.hidden = false;
  result.hidden = true;
  result.innerHTML = '';
  renderProfile();
  demoDialog.scrollTop = 0;
}
function openDialog(dialog, trigger) {
  dialogTrigger = trigger;
  closeMenu();
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('[data-open-demo]').forEach((button) => button.addEventListener('click', () => {
  resetDemo();
  openDialog(demoDialog, button);
}));
document.querySelectorAll('[data-open-app-modal]').forEach((button) => button.addEventListener('click', () => {
  if (appDialog) openDialog(appDialog, button);
}));

const planViewButtons = [...document.querySelectorAll('[data-plan-view]')];
const plansCardsPanel = document.querySelector('#plans-cards-panel');
const plansMatrixPanel = document.querySelector('#plans-matrix-panel');
planViewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.planView;
    planViewButtons.forEach((item) => {
      const active = item === btn;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    if (plansCardsPanel && plansMatrixPanel) {
      plansCardsPanel.hidden = view !== 'cards';
      plansMatrixPanel.hidden = view !== 'matrix';
    }
  });
});

// Blog: vista en tarjetas + lector dentro de la página + sincronización automática con Blogger
const blogViewButtons = [...document.querySelectorAll('[data-blog-view]')];
const blogCardsPanel = document.querySelector('#blog-cards-panel');
const blogEmbedPanel = document.querySelector('#blog-embed-panel');
blogViewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.blogView;
    blogViewButtons.forEach((item) => {
      const active = item === btn;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    if (blogCardsPanel && blogEmbedPanel) {
      blogCardsPanel.hidden = view !== 'cards';
      blogEmbedPanel.hidden = view !== 'embed';
    }
  });
});

let blogArticles = [
  {
    category: 'GUÍA PRÁCTICA CV',
    date: 'Blog VisibleTalent',
    title: 'Cómo transformar tus proyectos universitarios en experiencia atractiva para tu primer CV',
    summary: '¿Sientes que tu CV está en blanco porque aún no has tenido un trabajo formal? Aprende el método Acción + Contexto + Aporte para presentar trabajos de curso, laboratorios y voluntariados.',
    url: 'https://visibletalent.blogspot.com/',
    contentHtml: `<p>Uno de los mayores bloqueos al postular a tus primeras prácticas preprofesionales es pensar que "sin trabajo previo no hay nada que poner en el CV". Sin embargo, los reclutadores de talento joven evalúan tu potencial a través de lo que ya has resuelto en la universidad.</p>
      <h4>1. Usa la fórmula Acción + Contexto + Aporte</h4>
      <p>En lugar de escribir <em>"Realicé un trabajo grupal de marketing"</em>, estructura tu viñeta explicando qué hiciste exactamente, para qué caso o proyecto y cuál fue el entregable concreto.</p>
      <ul>
        <li><strong>Acción:</strong> Diseñé, analicé, programé, coordiné, estructuré.</li>
        <li><strong>Contexto:</strong> Para un emprendimiento local, un curso integrador o una organización estudiantil.</li>
        <li><strong>Aporte:</strong> Entregando un calendario de contenidos, un prototipo funcional o una matriz de control en Excel.</li>
      </ul>
      <h4>2. Destaca tus herramientas reales</h4>
      <p>Menciona los programas, lenguajes o metodologías que utilizaste durante el proyecto para que tu perfil conecte de forma honesta con los requisitos de la convocatoria.</p>`
  },
  {
    category: 'FILTROS ATS',
    date: 'Blog VisibleTalent',
    title: 'Qué es un filtro ATS y por qué las plantillas con exceso de diseño pueden jugar en tu contra',
    summary: 'Descubre cómo leen los sistemas automatizados tu currículum en convocatorias de prácticas en Lima y qué estructura de texto facilita que un reclutador encuentre tus habilidades clave.',
    url: 'https://visibletalent.blogspot.com/',
    contentHtml: `<p>Muchas convocatorias de prácticas y primer empleo reciben cientos de postulaciones en pocos días. Para organizarlas, las empresas utilizan sistemas de seguimiento de candidatos (ATS) que extraen el texto de tu PDF.</p>
      <h4>¿Por qué fallan los CVs con exceso de elementos gráficos?</h4>
      <ul>
        <li><strong>Columnas complejas y tablas flotantes:</strong> Pueden mezclar el orden de lectura de tu educación y tus proyectos.</li>
        <li><strong>Barras de porcentaje en habilidades:</strong> Un sistema automatizado no interpreta "80% de barra en Excel"; es mucho más claro escribir <em>"Excel intermedio (tablas dinámicas y reportes)"</em>.</li>
        <li><strong>Textos convertidos en imagen:</strong> Si exportas tu CV como imagen en vez de texto seleccionable, el lector automático verá una hoja en blanco.</li>
      </ul>
      <p>En VisibleTalent promovemos pasar de formatos gráficos confusos a una estructura limpia, legible tanto por sistemas ATS como por personas.</p>`
  },
  {
    category: 'PRIMER EMPLEO',
    date: 'Blog VisibleTalent',
    title: 'Palabras clave en ofertas de prácticas: cómo conectar tu perfil con lo que pide la empresa',
    summary: 'Analizamos ejemplos reales de Marketing, Ingeniería de Sistemas y Administración para que identifiques las competencias técnicas y blandas que ya aplicaste sin exagerar ni inventar datos.',
    url: 'https://visibletalent.blogspot.com/',
    urlLabel: 'Ver en Blogger',
    contentHtml: `<p>Cada aviso de prácticas incluye pistas claras sobre lo que el equipo necesita. Leer una oferta con atención te ayuda a decidir qué proyectos académicos priorizar en tu CV.</p>
      <h4>Tres pasos antes de enviar tu postulación:</h4>
      <ul>
        <li><strong>Identifica los términos clave:</strong> Subraya las 3 o 4 actividades principales del puesto (por ejemplo: <em>análisis de audiencia, desarrollo frontend con JavaScript o seguimiento de indicadores</em>).</li>
        <li><strong>Revisa tu historial académico:</strong> Busca en qué curso, taller o voluntariado pusiste en práctica esa habilidad.</li>
        <li><strong>Usa el mismo lenguaje con honestidad:</strong> Si en tu curso hiciste "investigación de público objetivo" y la oferta pide "análisis de audiencia", utiliza el término claro explicando cómo lo trabajaste.</li>
      </ul>`
  }
];

const blogReaderDialog = document.querySelector('#blog-reader-dialog');
const blogPostsGrid = document.querySelector('#blog-posts-grid');

function openBlogArticle(index, trigger) {
  const post = blogArticles[index];
  if (!post || !blogReaderDialog) return;
  document.querySelector('#blog-reader-category').textContent = post.category || 'BLOG VISIBLETALENT';
  document.querySelector('#blog-reader-title').textContent = post.title;
  document.querySelector('#blog-reader-date').textContent = post.date || '';
  document.querySelector('#blog-reader-body').innerHTML = post.contentHtml;
  const linkEl = document.querySelector('#blog-reader-url');
  if (linkEl) linkEl.href = post.url || 'https://visibletalent.blogspot.com/';
  openDialog(blogReaderDialog, trigger);
}

function bindBlogReadButtons() {
  document.querySelectorAll('[data-read-post]').forEach((btn) => {
    btn.addEventListener('click', () => openBlogArticle(Number(btn.dataset.readPost), btn));
  });
}
bindBlogReadButtons();

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window.handleVisibleTalentBlogger = function (data) {
  const entries = data?.feed?.entry;
  if (!Array.isArray(entries) || entries.length === 0 || !blogPostsGrid) return;
  const loaded = entries.slice(0, 6).map((entry, idx) => {
    const title = entry.title?.$t || `Artículo ${idx + 1}`;
    const rawHtml = entry.content?.$t || entry.summary?.$t || '';
    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;
    temp.querySelectorAll('script, style, iframe').forEach((el) => el.remove());
    const plainText = (temp.textContent || '').replace(/\s+/g, ' ').trim();
    const summary = plainText.length > 180 ? `${plainText.slice(0, 177)}…` : plainText;
    const altLink = (entry.link || []).find((l) => l.rel === 'alternate')?.href || 'https://visibletalent.blogspot.com/';
    const category = entry.category?.[0]?.term?.toUpperCase() || 'BLOG VISIBLETALENT';
    const pubDate = entry.published?.$t ? new Date(entry.published.$t).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'VisibleTalent Blog';
    return {
      category,
      date: pubDate,
      title,
      summary: summary || 'Haz clic para leer el artículo completo publicado en el blog de VisibleTalent.',
      url: altLink,
      contentHtml: temp.innerHTML || `<p>${escapeHtml(summary)}</p>`
    };
  });
  blogArticles = loaded;
  blogPostsGrid.innerHTML = loaded.map((post, i) => `
    <article class="blog-post-card">
      <div class="blog-post-meta">
        <span class="tag ${i % 2 === 1 ? 'tag-lilac' : ''}">${escapeHtml(post.category)}</span>
        <time>${escapeHtml(post.date)}</time>
      </div>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.summary)}</p>
      <div class="blog-post-actions">
        <button type="button" class="button button-small button-navy" data-read-post="${i}">Leer artículo aquí ${icon('arrow')}</button>
        <a class="blog-ext-link" href="${escapeHtml(post.url)}" target="_blank" rel="noopener noreferrer">Ver en Blogger ↗</a>
      </div>
    </article>
  `).join('');
  const statusEl = document.querySelector('#blog-feed-status');
  if (statusEl) statusEl.textContent = `Mostrando ${loaded.length} artículo(s) en directo desde visibletalent.blogspot.com · Léelos aquí mismo sin salir de la página.`;
  bindBlogReadButtons();
};

// Carga automática de artículos desde el feed público de Blogger
const bloggerScript = document.createElement('script');
bloggerScript.src = 'https://visibletalent.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=6&callback=handleVisibleTalentBlogger';
bloggerScript.async = true;
document.head.appendChild(bloggerScript);
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    const returnTarget = dialogTrigger?.getClientRects().length ? dialogTrigger : menuToggle;
    returnTarget?.focus();
  });
});
profileSelect.addEventListener('change', renderProfile);
document.querySelector('#run-demo').addEventListener('click', () => {
  const profile = profiles[profileSelect.value];
  selection.hidden = true;
  result.hidden = false;
  result.innerHTML = `<div class="result-heading"><span>${icon('check')}</span><div><strong>Ya tienes por dónde empezar</strong><p>${profile.name} · Ejemplo ilustrativo</p></div></div><ol class="result-items">${profile.recommendations.map(([title, description]) => `<li><strong>${title}</strong><p>${description}</p></li>`).join('')}</ol><p class="result-hint">Este ejemplo muestra el tipo de orientación propuesto. No es una evaluación real ni una predicción de contratación.</p><button class="button button-navy full-width" id="restart-demo">Explorar otro perfil ${icon('arrow')}</button>`;
  document.querySelector('#restart-demo').addEventListener('click', () => {
    resetDemo();
    profileSelect.focus();
  });
  // Lleva el foco al resultado para comunicar el cambio también con teclado.
  result.tabIndex = -1;
  result.focus();
});
document.querySelector('#current-year').textContent = String(new Date().getFullYear());
renderProfile();

// El formulario solo confirma el registro después de recibir la respuesta del servidor.
const registrationForm = document.querySelector('#registration-form');
const registrationSuccess = document.querySelector('#registration-success');
const registrationError = document.querySelector('#registration-error');
const registrationSubmit = document.querySelector('#registration-submit');
let registrationPending = false;

document.querySelectorAll('[data-register]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  closeMenu();
  document.querySelector('#registro').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  const focusTarget = registrationForm.hidden ? registrationSuccess : document.querySelector('#registration-name');
  focusTarget.focus({ preventScroll: true });
}));

registrationForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (registrationPending || !registrationForm.reportValidity()) return;
  registrationPending = true;
  registrationError.hidden = true;
  registrationForm.setAttribute('aria-busy', 'true');
  registrationSubmit.disabled = true;
  registrationSubmit.querySelector('span').textContent = 'Guardando tu registro…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('/api/registro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
      body: JSON.stringify({
        name: registrationForm.elements.name.value.trim(),
        email: registrationForm.elements.email.value.trim(),
        career: registrationForm.elements.career.value.trim(),
        privacyAccepted: registrationForm.elements.privacyAccepted.checked,
        marketingConsent: registrationForm.elements.marketingConsent.checked,
        companyWebsite: registrationForm.elements.companyWebsite.value,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.ok !== true) throw new Error(data?.error || 'No pudimos guardar tu registro. Inténtalo otra vez en unos momentos.');
    registrationForm.hidden = true;
    registrationSuccess.hidden = false;
    registrationForm.reset();
    registrationSuccess.focus();
  } catch (error) {
    registrationError.textContent = error.name === 'AbortError' || error instanceof TypeError
      ? 'No pudimos confirmar tu registro. Revisa tu conexión y vuelve a intentarlo.'
      : error.message;
    registrationError.hidden = false;
  } finally {
    clearTimeout(timeout);
    registrationPending = false;
    registrationSubmit.disabled = false;
    registrationSubmit.querySelector('span').textContent = 'Registrarme gratis';
    registrationForm.removeAttribute('aria-busy');
  }
});
