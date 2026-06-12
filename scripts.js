'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initNavbar();
  initMobileNav();
  initTypingAnimation();
  initRevealOnScroll();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
});

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon   = document.getElementById('themeIcon');
  const html   = document.documentElement;
  const saved  = localStorage.getItem('ds-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved, icon);
  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ds-theme', next);
    updateIcon(next, icon);
  });
}

function updateIcon(theme, iconEl) {
  iconEl.textContent = theme === 'dark' ? '☀' : '☾';
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('section[id]')];
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }, { passive: true });
}

function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

function initTypingAnimation() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = ['Data Analyst',
    'Business Analyst', 
    'BI Developer',
    'Machine Learning Engineer',
    'AI Engineer'];
  let phraseIdx = 0, charIdx = 0, deleting = false, paused = false;

  function type() {
    if (paused) return;
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) { paused = true; setTimeout(() => { paused = false; deleting = true; tick(); }, 2200); return; }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    tick();
  }

  function tick() { setTimeout(type, deleting ? 55 : 90); }
  tick();
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll(
    '.section-header, .about-text, .about-cards, .domain-card, .skill-category, .project-card, .edu-card, .resume-cta, .contact-info, .contact-form-wrap, .hero-text, .hero-visual'
  );
  elements.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  elements.forEach(el => observer.observe(el));
}

function initSkillBars() {
  const fills = document.querySelectorAll('.prof-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.style.width = `${entry.target.dataset.width}%`; }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(fill => observer.observe(fill));
}

function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.project-card');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || (card.dataset.category || '').includes(filter);
        card.classList.toggle('hidden', !show);
        if (show) card.style.animation = 'fadeInUp 0.4s ease both';
      });
    });
  });
}

function initContactForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;
  const nameInput  = document.getElementById('fname');
  const emailInput = document.getElementById('femail');
  const msgInput   = document.getElementById('fmessage');
  const nameErr    = document.getElementById('nameError');
  const emailErr   = document.getElementById('emailError');
  const msgErr     = document.getElementById('msgError');
  const submitBtn  = document.getElementById('submitBtn');
  const submitTxt  = document.getElementById('submitText');
  const successEl  = document.getElementById('formSuccess');

  function validate(input, errEl, msg) {
    if (!input.value.trim()) { errEl.textContent = msg; input.classList.add('error'); return false; }
    errEl.textContent = ''; input.classList.remove('error'); return true;
  }
  function validateEmail(input, errEl) {
    if (!input.value.trim()) { errEl.textContent = 'Email is required.'; input.classList.add('error'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { errEl.textContent = 'Enter a valid email.'; input.classList.add('error'); return false; }
    errEl.textContent = ''; input.classList.remove('error'); return true;
  }

  nameInput.addEventListener('blur',  () => validate(nameInput, nameErr, 'Name is required.'));
  emailInput.addEventListener('blur', () => validateEmail(emailInput, emailErr));
  msgInput.addEventListener('blur',   () => validate(msgInput, msgErr, 'Message is required.'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(nameInput, nameErr, 'Name is required.') | !validateEmail(emailInput, emailErr) | !validate(msgInput, msgErr, 'Message is required.')) return;
    submitBtn.disabled = true; submitTxt.textContent = 'Sending…';
    await new Promise(r => setTimeout(r, 1600));
    submitBtn.disabled = false; submitTxt.textContent = 'Send Message';
    successEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
    form.reset();
    setTimeout(() => { successEl.textContent = ''; }, 6000);
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });
}