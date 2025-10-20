// Mobile drawer com acessibilidade e backdrop
function toggleDrawer(force){
  const d = document.getElementById('drawer');
  const btn = document.querySelector('.hamburger');
  const backdrop = document.getElementById('drawerBackdrop');
  const open = force !== undefined ? force : d.style.display !== 'block';

  d.style.display = open ? 'block' : 'none';
  if (backdrop) backdrop.style.display = open ? 'block' : 'none';
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.classList.toggle('noscroll', open);

  if (open) {
    const firstLink = d.querySelector('a');
    firstLink && firstLink.focus();
  } else {
    btn && btn.focus();
  }
}

document.addEventListener('keydown', (e) => {
  const d = document.getElementById('drawer');
  if (!d) return;
  if (e.key === 'Escape' && d.style.display === 'block') toggleDrawer(false);
});

// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// ====== TIMELINE (ajuste fino de alinhamento) ======
(function(){
  const tl = document.querySelector('[data-animate-line]');
  const progress = document.getElementById('timelineProgress');
  if (!tl || !progress) return;

  const items = Array.from(tl.querySelectorAll('.t-item'));
  let centers = [];
  let start = 0;
  let maxH = 0;

  function measure(){
    const tRect = tl.getBoundingClientRect();
    const tTop = tRect.top + window.scrollY;

    centers = items.map(el => {
      const r = el.getBoundingClientRect();
      const absTop = r.top + window.scrollY;
      return absTop - tTop + (r.height / 2);
    });

    if (!centers.length) return;
    const firstCenter = centers[0];
    const lastCenter  = centers[centers.length - 1];

    start = firstCenter;               // linha começa exatamente no centro do 1º ponto
    maxH  = lastCenter - firstCenter;  // termina no centro do último ponto

    progress.style.top = `${start}px`;
  }

  function update(){
  const tRect = tl.getBoundingClientRect();
  const tlTop = tRect.top + window.scrollY;
  const viewportBottom = window.scrollY + window.innerHeight;

  // ➜ se o usuário está acima da sessão (a parte de baixo do viewport
  // ainda não alcançou o topo da timeline), resetamos tudo
  if (viewportBottom < tlTop) {
    progress.style.height = '0px';
    items.forEach(el => el.classList.remove('is-visible'));
    return;
  }

  const visible = viewportBottom - (tlTop + start);
  const height = Math.max(0, Math.min(visible, maxH));

  progress.style.height = `${height}px`;

  centers.forEach((pos, i) => {
    if (height >= (pos - start) - 8) items[i].classList.add('is-visible');
  });
}

  const ro = new ResizeObserver(() => { measure(); update(); });
  ro.observe(tl);
  ['scroll','resize'].forEach(evt => window.addEventListener(evt, update, { passive:true }));
  window.addEventListener('load', () => { measure(); update(); });
})();

// === Sensory Radar (auto-contido) ============================================
(() => {
  const svg = document.getElementById('radarChart');
  if (!svg) return;

  // Dados (0–1) nas 3 dimensões mostradas na lista: Texture, Taste, Aroma.
  // Ajuste se quiser calibrar o desenho, mas pode usar esses valores padrão.
  const values = [0.85, 0.78, 0.65]; // [Texture, Taste, Aroma]

  const size = 220;
  const cx = size / 2, cy = size / 2;
  const radius = 90;           // raio útil
  const levels = 4;            // linhas de grade
  const strokeGrid = '#cfc8b7'; // --muted
  const strokePoly = '#c8a96a'; // --gold

  // util
  const toPolar = (val, angleRad) => {
    const r = val * radius;
    return [cx + r * Math.cos(angleRad), cy + r * Math.sin(angleRad)];
  };

  // limpa antes de desenhar (idempotente)
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // container (opcional, ajuda se quiser estilos futuros)
  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('transform', `translate(0,0)`);
  svg.appendChild(g);

  // grade (polígonos concêntricos)
  for (let l = 1; l <= levels; l++) {
    const frac = l / levels;
    const pts = [];
    for (let i = 0; i < values.length; i++) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / values.length;
      const [x, y] = toPolar(frac, angle);
      pts.push(`${x},${y}`);
    }
    const poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', strokeGrid);
    poly.setAttribute('stroke-opacity', '0.25');
    poly.setAttribute('stroke-width', '1');
    g.appendChild(poly);
  }

  // eixos
  for (let i = 0; i < values.length; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / values.length;
    const [x, y] = toPolar(1, angle);
    const axis = document.createElementNS('http://www.w3.org/2000/svg','line');
    axis.setAttribute('x1', cx); axis.setAttribute('y1', cy);
    axis.setAttribute('x2', x);  axis.setAttribute('y2', y);
    axis.setAttribute('stroke', strokeGrid);
    axis.setAttribute('stroke-opacity', '0.35');
    axis.setAttribute('stroke-width', '1');
    g.appendChild(axis);
  }

  // polígono de valores
  const valPts = [];
  for (let i = 0; i < values.length; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / values.length;
    const [x, y] = toPolar(values[i], angle);
    valPts.push(`${x},${y}`);
  }
  const polyVal = document.createElementNS('http://www.w3.org/2000/svg','polygon');
  polyVal.setAttribute('points', valPts.join(' '));
  polyVal.setAttribute('fill', 'none');
  polyVal.setAttribute('stroke', strokePoly);
  polyVal.setAttribute('stroke-width', '2');
  polyVal.setAttribute('stroke-linejoin', 'round');
  g.appendChild(polyVal);

  // pontinhos nos vértices
  valPts.forEach(pt => {
    const [x, y] = pt.split(',').map(parseFloat);
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '2.5');
    c.setAttribute('fill', strokePoly);
    g.appendChild(c);
  });

  // acessibilidade
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Sensory radar chart');

  // responsivo: o SVG já tem viewBox; não precisa redimensionar nada
})();

