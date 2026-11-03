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
window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);

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
const privacyDialog = document.querySelector('#privacy-dialog');
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
document.querySelectorAll('[data-open-privacy]').forEach((button) => button.addEventListener('click', () => openDialog(privacyDialog, button)));
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialogTrigger?.focus();
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
