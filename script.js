(function () {
  'use strict';

  // Theme toggle with localStorage persistence
  var STORAGE_KEY = 'trendvault-theme';
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    syncTogglePressed();
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      syncTogglePressed();
    });
  }
  function syncTogglePressed() {
    if (!themeToggle) return;
    var isDark = root.getAttribute('data-theme') !== 'light';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  // Mobile menu
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('primary-nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!open));
      hamburger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      if (open) {
        mobileNav.setAttribute('hidden', '');
      } else {
        mobileNav.removeAttribute('hidden');
      }
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        mobileNav.setAttribute('hidden', '');
      }
    });
  }

  // Tab filtering
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('#trendGrid .trend-card');
  if (filters.length && cards.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-filter');
        filters.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });
        cards.forEach(function (card) {
          var platform = card.getAttribute('data-platform');
          var show = key === 'all' || key === platform;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Newsletter validation + mock submission
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var forms = document.querySelectorAll('form[data-newsletter]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // clear previous feedback
      var prev = form.querySelector('.field-error, .field-success');
      if (prev) prev.remove();

      var input = form.querySelector('input[type="email"]');
      var value = input ? input.value.trim() : '';
      var feedback = document.createElement('p');
      if (!emailRegex.test(value)) {
        feedback.className = 'field-error';
        feedback.textContent = 'Please enter a valid email address.';
        form.appendChild(feedback);
        if (input) input.focus();
        return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Subscribing…'; }
      // Mock submission
      setTimeout(function () {
        form.reset();
        feedback.className = 'field-success';
        feedback.textContent = 'You’re in! Check your inbox to confirm.';
        form.appendChild(feedback);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Subscribe Free'; }
      }, 700);
    });
  });

  // Intersection Observer for reveal + lazy images
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    var lazyImgs = document.querySelectorAll('img[data-src]');
    if (lazyImgs.length) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            var src = img.getAttribute('data-src');
            if (src) { img.src = src; img.removeAttribute('data-src'); }
            imgObserver.unobserve(img);
          }
        });
      });
      lazyImgs.forEach(function (img) { imgObserver.observe(img); });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Smooth scroll for in-page anchors (respects native scroll-behavior; this ensures focus management)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // Back to top
  var btt = document.getElementById('backToTop');
  if (btt) {
    var onScroll = function () {
      var show = window.scrollY > 600;
      btt.classList.toggle('is-visible', show);
      if (show) btt.removeAttribute('hidden'); else btt.setAttribute('hidden', '');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    onScroll();
  }

  // Current year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

})();
