/* ═══════════════════════════════════════════════════
   REFLECTIONS PRODUCTIONS — SCRIPT
   ═══════════════════════════════════════════════════ */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── Mobile hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    // Animate bars to X
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.cssText = 'transform: rotate(45deg) translate(5px,5px)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });
}

/* ── Scroll reveal (Intersection Observer) ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside same parent
          const siblings = entry.target.parentElement.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right'
          );
          let delay = 0;
          siblings.forEach((el, idx) => {
            if (el === entry.target) delay = idx * 100;
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ── Animated number counters ── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = Math.ceil(target / (duration / 16));
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, 16);
}

const counters = document.querySelectorAll('.stat-num');
if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(c => counterObserver.observe(c));
}

/* ── Gallery filter ── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.transition = 'opacity 0.4s, transform 0.4s';
        if (show) {
          item.style.display   = 'block';
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            item.style.opacity   = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    });
  });
}

/* ── Lightbox ── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

let lightboxImages = [];
let currentIndex   = 0;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = lightboxImages[index];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showNext() {
  currentIndex = (currentIndex + 1) % lightboxImages.length;
  lightboxImg.src = lightboxImages[currentIndex];
}

function showPrev() {
  currentIndex = (currentIndex - 1 + lightboxImages.length) % lightboxImages.length;
  lightboxImg.src = lightboxImages[currentIndex];
}

if (lightbox) {
  // Collect all gallery images
  lightboxImages = Array.from(
    document.querySelectorAll('.gallery-item img')
  ).map(img => img.src);

  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev  && lightboxPrev.addEventListener('click', showPrev);
  lightboxNext  && lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
  });
}

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.querySelector('[name="name"]').value.trim();
    const email   = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();
    const msgEl   = document.getElementById('formMsg');

    // Basic validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      msgEl.textContent = 'Please fill in all required fields.';
      msgEl.className   = 'form-msg error';
      return;
    }

    if (!emailRe.test(email)) {
      msgEl.textContent = 'Please enter a valid email address.';
      msgEl.className   = 'form-msg error';
      return;
    }

    // Simulate successful submission (no backend)
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent  = 'Sending…';
    btn.disabled     = true;

    setTimeout(() => {
      msgEl.textContent = '✓ Thank you! We\'ll be in touch within 24 hours.';
      msgEl.className   = 'form-msg success';
      contactForm.reset();
      btn.textContent = 'Send Message';
      btn.disabled    = false;
    }, 1200);
  });
}

/* ── Smooth active link highlight ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
