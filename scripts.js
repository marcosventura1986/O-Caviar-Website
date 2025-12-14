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
    "Oscietra Large": {
      texture: "Larger, silky pearls with a more luxurious pop",
      taste: "Nutty, buttery depth with refined minerality with larger pearls that create a more luxurious sensation in the mouth",
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
        "Junmai Daiginjo — Silky texture mirrors creaminess.",
        "Riesling trocken — Brightness balances toasted notes.",
        "Blinis with clarified butter — Echoes the nutty profile."
      ],
      radar: [0.8, 0.8, 0.6]
    },
    "Beluga": {
      texture: "Extra-large pearls, ultra-soft, almost melting",
      taste: "Buttery, very creamy, lingering with hints of hazelnut",
      aroma: "Delicate, fresh, subtle iodine",
      pairings: [
        "Vintage Champagne (Brut) — Effervescence elevates unctuousness.",
        "Chablis Grand Cru — Fine minerality complements delicacy.",
        "Premium Vodka (ice-cold) — Keeps focus on caviar.",
        "Ultra-thin blinis & light crème fraîche — Classic, unobtrusive base."
      ],
      radar: [1.0, 1.0, 0.6]
    },
    "Kaluga": {
      texture: "Large pearls, firm pop with creamy finish",
      taste: "Buttery, nutty, slight sweetness with gentle umami",
      aroma: "Clean, moderate salinity",
      pairings: [
        "Champagne Brut — Structure and freshness for a fuller profile.",
        "Dry Riesling (GG) — Firm acidity and citrus cleanse the palate.",
        "Premium Vodka — Highlights butter and pop.",
        "Buckwheat blinis — Balance for body and nut notes."
      ],
      radar: [0.8, 1.0, 0.6]
    },
    "Sevruga": {
      texture: "Small pearls, more pronounced pop",
      taste: "Marine-forward, evident salinity, subtle butter and mineral",
      aroma: "More oceanic, saline",
      pairings: [
        "Champagne Extra-Brut — Dryness and lively bubbles for intensity.",
        "Muscadet / Albariño — Salinity and citrus pair with marine notes.",
        "Premium Vodka — Palate reset between servings.",
        "Simple blinis — Neutral base that doesn’t compete."
      ],
      radar: [0.6, 0.6, 0.8]
    },
    "Baerii": {
      texture: "Medium-small pearls, soft with a clean finish",
      taste: "Balanced nutty-buttery character, restrained salinity, slight sweetness",
      aroma: "Fresh, delicate, clean",
      pairings: [
        "Crémant or Champagne Brut Nature — Lift without weight.",
        "Loire Sauvignon Blanc — Lively acidity enhances freshness.",
        "Premium Vodka — Keeps the delicate profile in focus.",
        "Crème fraîche & chives — Gentle herb note without dominance."
      ],
      radar: [0.6, 0.8, 0.6]
    },
    "Hybrid(s)": {
      texture: "Generally large pearls with firm pop and creamy finish",
      taste: "Buttery–nutty with a touch of umami/earth; medium–high intensity",
      aroma: "Clean with subtle marine character",
      pairings: [
        "Champagne Brut — Versatile match for hybrid profiles.",
        "Dry Riesling or Grüner Veltliner — Acidity and freshness cut through creaminess.",
        "Premium Vodka — Transparent read of the blend.",
        "Neutral blinis — Classic base for robust styles."
      ],
      radar: [0.8, 0.8, 0.6]
    },
    "Almas": {
      texture: "Very large pearls, exceptionally delicate and silky",
      taste: "Ultra-buttery, creamy and subtle, light nut sweetness",
      aroma: "Refined, near-ethereal with discreet salinity",
      pairings: [
        "Vintage Blanc de Blancs — Elegance without overpowering.",
        "Crystal-clear vodka, ice-cold — Absolute purity on the palate.",
        "Fine Chablis (light oak or none) — Discreet minerality alongside.",
        "Ultra-thin blinis & light crème fraîche — Maximum delicacy."
      ],
      radar: [1.0, 1.0, 0.8]
    }
  };

  // Desenha o radar no SVG #radarChart com 3 dimensões (Texture, Taste, Aroma)
  function drawRadar(values){
    const svg = document.getElementById('radarChart');
    if (!svg || !values) return;
    const size = 220, cx = size/2, cy = size/2, radius = 90, levels = 4;
    const strokeGrid = '#cfc8b7', strokePoly = '#c8a96a';

    const toPolar = (val, ang) => [cx + (val*radius)*Math.cos(ang), cy + (val*radius)*Math.sin(ang)];

    // limpa
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    svg.appendChild(g);

    // grade
    for (let l=1;l<=levels;l++){
      const frac=l/levels, pts=[];
      for (let i=0;i<values.length;i++){
        const a=-Math.PI/2+(2*Math.PI*i)/values.length;
        pts.push(toPolar(frac,a).join(','));
      }
      const poly=document.createElementNS('http://www.w3.org/2000/svg','polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', strokeGrid);
      poly.setAttribute('stroke-opacity', '0.25');
      poly.setAttribute('stroke-width', '1');
      g.appendChild(poly);
    }

    // eixos
    for (let i=0;i<values.length;i++){
      const a=-Math.PI/2+(2*Math.PI*i)/values.length;
      const [x,y]=toPolar(1,a);
      const axis=document.createElementNS('http://www.w3.org/2000/svg','line');
      axis.setAttribute('x1',cx); axis.setAttribute('y1',cy);
      axis.setAttribute('x2',x);  axis.setAttribute('y2',y);
      axis.setAttribute('stroke',strokeGrid);
      axis.setAttribute('stroke-opacity','0.35');
      axis.setAttribute('stroke-width','1');
      g.appendChild(axis);
    }

    // polígono valores
    const valPts = values.map((v,i)=>{
      const a=-Math.PI/2+(2*Math.PI*i)/values.length;
      return toPolar(v,a).join(',');
    });
    const polyVal=document.createElementNS('http://www.w3.org/2000/svg','polygon');
    polyVal.setAttribute('points', valPts.join(' '));
    polyVal.setAttribute('fill','none');
    polyVal.setAttribute('stroke',strokePoly);
    polyVal.setAttribute('stroke-width','2');
    polyVal.setAttribute('stroke-linejoin','round');
    g.appendChild(polyVal);

    // marcadores
    valPts.forEach(pt=>{
      const [x,y]=pt.split(',').map(parseFloat);
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r','2.5');
      c.setAttribute('fill',strokePoly);
      g.appendChild(c);
    });

     // labels for each axis
  const labels = ["Texture", "Taste", "Aroma"];
  for (let i = 0; i < labels.length; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / values.length;
    const labelRadius = radius + 18; // distance from center
    const x = cx + labelRadius * Math.cos(angle);
    const y = cy + labelRadius * Math.sin(angle) + 4; // +4 for optical centering

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.textContent = labels[i];
    txt.setAttribute('x', x);
    txt.setAttribute('y', y);
    txt.setAttribute('fill', '#bdb7a6');   // muted beige tone
    txt.setAttribute('font-family', 'Poppins, sans-serif');
    txt.setAttribute('font-size', '7');
    txt.setAttribute('text-anchor', 'middle');
    g.appendChild(txt);
  }

  // accessibility attributes
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Sensory radar chart');

  }

  // Aplica um perfil completo (texto + pairings + radar)
  function applyProfile(name){
    const d = PROFILES[name];
    if (!d) return;

    const t = document.getElementById('textureText');
    const ta = document.getElementById('tasteText');
    const a = document.getElementById('aromaText');
    const p = document.getElementById('pairingsList');

    if (t && d.texture) t.innerHTML = `<strong>Texture:</strong> ${d.texture}`;
    if (ta && d.taste)   ta.innerHTML = `<strong>Taste:</strong> ${d.taste}`;
    if (a && d.aroma)    a.innerHTML = `<strong>Aroma:</strong> ${d.aroma}`;

    if (p && Array.isArray(d.pairings))
      p.innerHTML = d.pairings.map(x=>`<li><span class="dot"></span><span>${x}</span></li>`).join("");

    if (Array.isArray(d.radar)) drawRadar(d.radar);
  }

  // Inicialização: desenha radar inicial e conecta tabs (data-species)
  document.addEventListener('DOMContentLoaded', () => {
    // Radar inicial com o perfil padrão da página (Oscietra)
    if (PROFILES["Oscietra"]) drawRadar(PROFILES["Oscietra"].radar || [0.8,0.8,0.6]);

    // Tabs
    document.querySelectorAll('[data-species]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('[data-species]').forEach(b=>b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyProfile(btn.getAttribute('data-species'));
      });
    });
  });

// === Smooth scroll to anchors with sticky-header offset ======================
(function(){
  function getStickyOffset(){
    const header = document.querySelector('.site-header');
    const tabs   = document.querySelector('.species-tabs');
    const h = (header?.offsetHeight || 0) + (tabs?.offsetHeight || 0);
    // small breathing room
    return h + 12;
  }

  function setCSSVar(){
  const header = document.querySelector('.site-header');
  const tabs   = document.querySelector('.species-tabs');
  const headerH = (header?.offsetHeight || 0);
  const off = headerH + (tabs?.offsetHeight || 0) + 12; // 12px de respiro

  // expõe variáveis para CSS
  document.documentElement.style.setProperty('--header-h', headerH + 'px');
  document.documentElement.style.setProperty('--sticky-offset', off + 'px');
}

  function scrollWithOffset(target){
    const el = (typeof target === 'string') ? document.querySelector(target) : target;
    if (!el) return;
    const off = getStickyOffset();
    const top = el.getBoundingClientRect().top + window.scrollY - off;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Intercept in-page anchors (e.g., #sensory, #about)
  function bindAnchorLinks(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        // ignore empty or just '#'
        if (!href || href === '#') return;
        // skip if it's an external link (has http/https)
        if (href.includes('http')) return;
        const target = document.querySelector(href);
        if (target){
          e.preventDefault();
          scrollWithOffset(target);
        }
      });
    });
  }

  // Init
  window.addEventListener('load', () => {
    setCSSVar();
    bindAnchorLinks();
  });
  window.addEventListener('resize', setCSSVar);
})();
// === Products Carousel (simple linear scroll with arrow visibility) ==========
(function(){
  const root = document.getElementById('productsCarousel');
  if (!root) return;

  const track = root.querySelector('#productTrack');
  const btnPrev = root.querySelector('[data-prev]');
  const btnNext = root.querySelector('[data-next]');

  let slideW = 0;
  let isScrolling = false;

  function measure(){
    const first = track.querySelector('.c-slide');
    slideW = first ? first.getBoundingClientRect().width + 16 /*gap*/ : 0;
  }

  function updateArrowVisibility(){
    if (!btnPrev || !btnNext) return;
    
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    
    // Seta esquerda: hidden se está no início
    if (scrollLeft <= 5) {
      btnPrev.classList.add('hidden');
    } else {
      btnPrev.classList.remove('hidden');
    }
    
    // Seta direita: hidden se está no fim
    if (scrollLeft >= maxScroll - 5) {
      btnNext.classList.add('hidden');
    } else {
      btnNext.classList.remove('hidden');
    }
  }

  function scrollTo(direction) {
    if (isScrolling) return;
    
    isScrolling = true;
    const scrollAmount = slideW * 1.2; // scroll um pouco mais que 1 slide
    
    track.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
    
    // Libera após a animação
    setTimeout(() => {
      isScrolling = false;
      updateArrowVisibility();
    }, 400);
  }

  // Swipe/touch support
  let startX = 0;
  let startScrollLeft = 0;
  let isDragging = false;

  track.addEventListener('pointerdown', (e) => {
    // Não interceptar cliques em links
    if (e.target.closest('a')) return;
    isDragging = true;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.clientX;
    const diff = startX - x;
    track.scrollLeft = startScrollLeft + diff;
  });

  track.addEventListener('pointerup', () => {
    isDragging = false;
    updateArrowVisibility();
  });

  track.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  // Scroll listener para atualizar setas
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateArrowVisibility, 50);
  }, { passive: true });

  // Event listeners das setas
  btnPrev && btnPrev.addEventListener('click', () => scrollTo(-1));
  btnNext && btnNext.addEventListener('click', () => scrollTo(1));

  // Inicialização
  function init() {
    measure();
    updateArrowVisibility();
  }

  window.addEventListener('load', init);
  window.addEventListener('resize', () => {
    measure();
    updateArrowVisibility();
  });
})();


})();

// ========= Dynamic Journal Cards =========
(function loadJournalCards() {
  // Only load on main index page (not journal pages)
  if (!document.getElementById('journal-cards')) return;

  async function loadLatestArticles() {
    try {
      console.log('Loading journal articles...');
      const response = await fetch('journal/articles.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const articles = await response.json();
      console.log(`Loaded ${articles.length} articles successfully`);
      
      // Sort by date (most recent first) and take top 3
      const latestArticles = articles
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      
      renderJournalCards(latestArticles);
      console.log('Journal cards rendered successfully');
    } catch (error) {
      console.warn('Failed to load journal articles:', error);
      // Fallback: show static content (no longer uses noscript)
      const container = document.getElementById('journal-cards');
      if (container && container.children.length === 0) {
        console.log('No content found, this should not happen with static fallback');
      }
    }
  }

  function renderJournalCards(articles) {
    const container = document.getElementById('journal-cards');
    
    container.innerHTML = articles.map(article => `
      <article class="card post ph-tall journal-card">
        <div class="ph">
          <img src="${article.hero}" alt="${article.title}" loading="lazy">
        </div>
        <div class="body">
          <h3>${article.title}</h3>
          <p class="muted">${article.excerpt}</p>
          <a href="journal/${article.slug}/" class="journal-card-link" aria-label="Read full article: ${article.title}">
            <span class="journal-card-plus">+</span>
          </a>
        </div>
      </article>
    `).join('');
  }

  // Load articles when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLatestArticles);
  } else {
    loadLatestArticles();
  }
})();
