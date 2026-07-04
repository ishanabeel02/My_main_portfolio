// ============ YEAR ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ STAR FIELD ============
const starfield = document.getElementById('starfield');
if (starfield) {
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.top = Math.random() * 70 + '%';
    s.style.left = Math.random() * 100 + '%';
    s.style.setProperty('--tw', (0.4 + Math.random() * 0.6).toFixed(2));
    s.style.animationDelay = (Math.random() * 4) + 's';
    const size = (Math.random() * 2 + 1).toFixed(1);
    s.style.width = size + 'px'; s.style.height = size + 'px';
    starfield.appendChild(s);
  }
}

// ============ FIREFLIES ============
const fireflies = document.getElementById('fireflies');
if (fireflies) {
  for (let i = 0; i < 16; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.top = (30 + Math.random() * 60) + '%';
    f.style.left = Math.random() * 100 + '%';
    f.style.animationDelay = (Math.random() * 6) + 's';
    f.style.animationDuration = (5 + Math.random() * 4) + 's';
    fireflies.appendChild(f);
  }
}

// ============ SKYLINE (bracket motif) ============
const skyline = document.getElementById('skyline');
if (skyline) {
  const glyphs = ['{', '}', '<', '/>', '[', ']', '(', ')'];
  for (let i = 0; i < 24; i++) {
    const g = document.createElement('span');
    g.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    g.style.fontSize = (18 + Math.random() * 46) + 'px';
    skyline.appendChild(g);
  }
}

// ============ MODE SWITCHING ============
const html = document.documentElement;
const buttons = document.querySelectorAll('.mode-toggle button');
function setMode(mode, manual) {
  html.setAttribute('data-mode', mode);
  buttons.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  const imgs = document.querySelectorAll('.portrait-frame img');
  if (imgs.length) {
    imgs.forEach(img => img.classList.remove('active'));
    const match = document.querySelector('.portrait-frame img.p-' + mode);
    if (match) match.classList.add('active');
  }
  if (manual) localStorage.setItem('in-portfolio-mode', mode);
}
buttons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode, true)));

(function initMode() {
  const saved = localStorage.getItem('in-portfolio-mode');
  if (saved) { setMode(saved, false); return; }
  const h = new Date().getHours();
  let mode = 'day';
  if (h >= 18 || h < 5) mode = 'night';
  else if (h >= 17) mode = 'evening';
  setMode(mode, false);
})();

// ============ TYPEWRITER (home page only) ============
const typedEl = document.getElementById('typedText');
if (typedEl) {
  const phrases = [
    "AI student turning lab manuals and ideas into working models.",
    "Building RAG systems, classifiers, and full-stack apps.",
    "Currently obsessed with retrieval, embeddings, and clean notebooks."
  ];
  let pIdx = 0, cIdx = 0, deleting = false;
  function typeLoop() {
    const current = phrases[pIdx];
    if (!deleting) {
      cIdx++;
      typedEl.textContent = current.slice(0, cIdx);
      if (cIdx === current.length) { deleting = true; setTimeout(typeLoop, 1600); return; }
    } else {
      cIdx--;
      typedEl.textContent = current.slice(0, cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 28 : 42);
  }
  typeLoop();
}

// ============ SCROLL REVEAL ============
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .skill-group').forEach(el => io.observe(el));

// ============ COUNT UP (home page stats) ============
const counters = document.querySelectorAll('.stat-num');
if (counters.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const isFloat = String(target).includes('.');
        const dur = 1200; const t0 = performance.now();
        function step(t) {
          const p = Math.min((t - t0) / dur, 1);
          const val = target * p;
          el.textContent = isFloat ? val.toFixed(2) : Math.round(val);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => cio.observe(c));
}

// ============ FLIP CARDS (certificates + achievements) ============
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
  });
});

// ============ NAV ACTIVE LINK ============
const navLinks = document.querySelectorAll('.nav-link');
const currentPage = document.body.dataset.page || 'index';

if (currentPage === 'index') {
  // highlight based on scroll position among in-page sections
  const sectionLinks = [...navLinks].filter(l => l.getAttribute('href').startsWith('#'));
  const sections = sectionLinks.map(l => document.querySelector(l.getAttribute('href')));
  window.addEventListener('scroll', () => {
    let idx = sections.findIndex(s => s && s.getBoundingClientRect().top > 120);
    if (idx === -1) idx = sections.length - 1; else idx = Math.max(0, idx - 1);
    navLinks.forEach(l => l.classList.remove('active'));
    sectionLinks[idx] && sectionLinks[idx].classList.add('active');
  });
} else {
  // subpages: highlight the nav link matching this page
  navLinks.forEach(l => {
    if (l.getAttribute('href').includes(currentPage + '.html')) l.classList.add('active');
  });
}
