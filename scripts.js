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

    // se o usuário está acima da sessão, reset
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

// === Sensory Profiles + Radar (tabs + desenho) ===============================
(function(){
  // Perfis sensoriais (fatos consolidados). Escala do radar: 0–1 (equiv. 3=0.6, 4=0.8, 5=1.0)
  const PROFILES = {
    "Oscietra": {
      texture: "Silky, firm pearls with a gentle pop",
      taste: "Nutty, buttery, creamy depth with subtle minerality",
      aroma: "Clean, refined, faint sea-breeze",
      pairings: [
        "Champagne Blanc de Blancs (Brut) — Freshness lifts nutty/buttery notes.",
        "Chablis / Sancerre — Precise acidity highlights minerality.",
        "Premium Vodka — Neutral, palate-cleansing between bites.",
        "Blinis & Crème Fraîche — Supports texture and creaminess."
      ],
      radar: [0.8, 0.8, 0.6]
    },
    "Schrenkii": {
      texture: "Medium-large pearls, smooth pop, silky finish",
      taste: "Roasted almond, creamy richness, subtle spice",
      aroma: "Delicate with warm nut nuance",
      pairings: [
        "Champagne Blanc de Noirs (Brut) — Structure matches richness.",