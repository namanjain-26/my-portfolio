/* ============================
   CUSTOM CURSOR
   ============================ */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .interest-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ============================
   NAVBAR SCROLL
   ============================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ============================
   HAMBURGER MENU
   ============================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

/* ============================
   PARTICLE BACKGROUND CANVAS
   ============================ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '0, 212, 255' : '0, 255, 136';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

// Connect nearby particles
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================
   DNA HELIX CANVAS
   ============================ */
const dnaCanvas = document.getElementById('dnaCanvas');
const dctx = dnaCanvas.getContext('2d');

function setupDNA() {
  const dpr = window.devicePixelRatio || 1;
  const rect = dnaCanvas.getBoundingClientRect();
  dnaCanvas.width = rect.width * dpr;
  dnaCanvas.height = rect.height * dpr;
  dctx.scale(dpr, dpr);
}

let dnaT = 0;
function drawDNA() {
  const w = dnaCanvas.getBoundingClientRect().width;
  const h = dnaCanvas.getBoundingClientRect().height;
  dctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const amplitude = 70;
  const frequency = 0.03;
  const segments = 60;
  const segH = h / segments;

  for (let i = 0; i < segments; i++) {
    const y = i * segH;
    const phase1 = i * frequency * 10 + dnaT;
    const phase2 = phase1 + Math.PI;

    const x1 = cx + Math.sin(phase1) * amplitude;
    const x2 = cx + Math.sin(phase2) * amplitude;

    const progress = Math.abs(Math.sin(phase1));
    const alpha = 0.3 + progress * 0.7;

    // Strand 1
    if (i < segments - 1) {
      const ny1 = (i + 1) * segH;
      const np1 = (i + 1) * frequency * 10 + dnaT;
      const nx1 = cx + Math.sin(np1) * amplitude;

      dctx.beginPath();
      dctx.moveTo(x1, y);
      dctx.lineTo(nx1, ny1);
      dctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.8})`;
      dctx.lineWidth = 2;
      dctx.stroke();

      // Strand 2
      const nx2 = cx + Math.sin(np1 + Math.PI) * amplitude;
      dctx.beginPath();
      dctx.moveTo(x2, y);
      dctx.lineTo(nx2, ny1);
      dctx.strokeStyle = `rgba(0, 255, 136, ${alpha * 0.8})`;
      dctx.lineWidth = 2;
      dctx.stroke();
    }

    // Cross-bridges every 4th segment
    if (i % 4 === 0) {
      const gradient = dctx.createLinearGradient(x1, y, x2, y);
      gradient.addColorStop(0, `rgba(0, 212, 255, ${alpha * 0.6})`);
      gradient.addColorStop(1, `rgba(0, 255, 136, ${alpha * 0.6})`);

      dctx.beginPath();
      dctx.moveTo(x1, y);
      dctx.lineTo(x2, y);
      dctx.strokeStyle = gradient;
      dctx.lineWidth = 1.5;
      dctx.stroke();

      // Dots on strands
      dctx.beginPath();
      dctx.arc(x1, y, 3, 0, Math.PI * 2);
      dctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
      dctx.fill();

      dctx.beginPath();
      dctx.arc(x2, y, 3, 0, Math.PI * 2);
      dctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
      dctx.fill();
    }
  }

  dnaT += 0.025;
  requestAnimationFrame(drawDNA);
}

// Init DNA after layout
window.addEventListener('load', () => {
  setupDNA();
  drawDNA();
});
window.addEventListener('resize', setupDNA);

/* ============================
   SCROLL REVEAL
   ============================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ============================
   SKILL BAR ANIMATION
   ============================ */
const skillBars = document.querySelectorAll('.skill-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.getAttribute('data-w');
      setTimeout(() => {
        bar.style.width = targetWidth + '%';
      }, 300);
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ============================
   CONTACT FORM
   ============================ */
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    note.style.color = '#ef4444';
    note.textContent = 'Please fill all fields.';
    return;
  }

  // Simulate submission
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    note.style.color = 'var(--neon-green)';
    note.textContent = `✓ Thanks, ${name}! I'll get back to you soon.`;
    form.reset();
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
  }, 1500);
});

/* ============================
   SMOOTH SECTION HIGHLIGHTING
   ============================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--neon-blue)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================
   HOVER GLOW ON CARDS
   ============================ */
document.querySelectorAll('.project-card, .cert-card, .skill-group').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--glow-x', x + '%');
    card.style.setProperty('--glow-y', y + '%');
  });
});

/* ============================
   HERO TEXT TYPE EFFECT (subtle)
   ============================ */
const tagline = document.querySelector('.hero-tagline');
if (tagline) {
  const text = tagline.textContent;
  tagline.textContent = '';
  tagline.style.opacity = '1';
  let i = 0;
  setTimeout(() => {
    const type = setInterval(() => {
      tagline.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(type);
    }, 35);
  }, 1200);
}

/* ============================
   SCROLL TO TOP ON LOGO CLICK
   ============================ */
document.querySelector('.nav-logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================
   COUNT-UP ANIMATION FOR STATS
   ============================ */
function countUp(el, target, duration = 1500, isFloat = false) {
  const start = 0;
  const step = target / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const val = num.textContent;
        if (val === '7.0') countUp(num, 7.0, 1200, true);
        else if (val === '8+') { /* keep as is */ }
        else if (val === '2025') countUp(num, 2025, 1500, false);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ============================
   MOBILE: DISABLE CURSOR EFFECTS
   ============================ */
if (window.innerWidth <= 768) {
  if (dot) dot.style.display = 'none';
  if (ring) ring.style.display = 'none';
}
