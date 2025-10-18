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
  }
}

// Fechar com ESC
document.addEventListener('keydown', (e) => {
  const d = document.getElementById('drawer');
  if (!d) return;
  const isOpen = d.style.display === 'block';
  if (isOpen && e.key === 'Escape') {
    toggleDrawer(false);
  }
});

// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Timeline progress on scroll
(function(){
  const timeline = document.querySelector('[data-animate-line]');
  const progress = document.getElementById('timelineProgress');
  if(!timeline || !progress) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        updateProgress();
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
      }
    });
  }, {threshold: 0.1});
  observer.observe(timeline);

  function updateProgress(){
    const rect = timeline.getBoundingClientRect();
    const visible = Math.min(rect.height, Math.max(0, window.innerHeight - Math.max(0, rect.top)));
    const pct = Math.max(0, Math.min(1, visible / rect.height));
    progress.style.height = (pct * 100) + '%';
  }
})();

// Sensory radar
(function(){
  const svg = document.getElementById('radarChart');
  if(!svg) return;

  const size = 220, cx = 110, cy = 110, levels = 4, max = 10;
  const labels = ['Silk', 'Butter', 'Mineral', 'Aroma', 'Finish'];
  const values = [9, 8, 7, 7, 8];

  for(let l=1; l<=levels; l++){
    const r = (l/levels) * 90;
    const poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    let points = '';
    for(let i=0;i<labels.length;i++){
      const angle = (Math.PI*2/labels.length)*i - Math.PI/2;
      const x = cx + Math.cos(angle)*r;
      const y = cy + Math.sin(angle)*r;
      points += `${x},${y} `;
    }
    poly.setAttribute('points', points.trim());
    poly.setAttribute('fill','none');
    poly.setAttribute('stroke','rgba(200,169,106,0.25)');
    poly.setAttribute('stroke-width','1');
    svg.appendChild(poly);
  }

  for(let i=0;i<labels.length;i++){
    const angle = (Math.PI*2/labels.length)*i - Math.PI/2;
    const x = cx + Math.cos(angle)*100;
    const y = cy + Math.sin(angle)*100;
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('dominant-baseline','middle');
    text.setAttribute('text-anchor', x < cx ? 'end' : 'start');
    text.setAttribute('font-size','10');
    text.setAttribute('fill','rgba(236,233,224,0.8)');
    text.textContent = labels[i];
    svg.appendChild(text);
  }

  const dataPoly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
  let dpoints = '';
  for(let i=0;i<labels.length;i++){
    const angle = (Math.PI*2/labels.length)*i - Math.PI/2;
    const r = (values[i]/max) * 90;
    const x = cx + Math.cos(angle)*r;
    const y = cy + Math.sin(angle)*r;
    dpoints += `${x},${y} `;
  }
  dataPoly.setAttribute('points', dpoints.trim());
  dataPoly.setAttribute('fill','rgba(200,169,106,0.25)');
  dataPoly.setAttribute('stroke','rgba(185,122,60,0.9)');
  dataPoly.setAttribute('stroke-width','2');
  svg.appendChild(dataPoly);
})();
