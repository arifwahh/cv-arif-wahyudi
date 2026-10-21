/* ============================================================
   Arif Wahyudi — Portfolio landing page
   Vanilla JS: theme, nav, reveal, project filter/search, copy
   ============================================================ */
(function () {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  /* ---------- Theme ---------- */
  const THEME_KEY = 'aw-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f8fc' : '#080b16');
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage blocked */ }
    var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(stored || (prefersLight ? 'light' : 'dark'));

    var toggle = $('#themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var nav = $('#nav');
    var toggle = $('#navToggle');
    if (!nav || !toggle) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) close();
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(index, 6) * 55 + 'ms';
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Sticky header + back to top ---------- */
  function initScrollChrome() {
    var header = $('.site-header');
    var toTop = $('#toTop');

    function onScroll() {
      var y = window.scrollY || 0;
      if (header) header.classList.toggle('is-stuck', y > 12);
      if (toTop) toTop.classList.toggle('is-visible', y > 600);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------- Active nav link ---------- */
  function initScrollSpy() {
    var links = $$('.nav > a[href^="#"]');
    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.length > 1 ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Project filtering + search ---------- */
  function initProjects() {
    var grid = $('#projectsGrid');
    var filterButtons = $$('#filters .filter');
    var search = $('#projectSearch');
    var status = $('#projectStatus');
    var empty = $('#projectsEmpty');
    if (!grid) return;

    var cards = $$('.project', grid);
    var total = cards.length;
    var activeFilter = 'all';
    var query = '';

    function normalise(value) {
      return (value || '').toLowerCase().trim();
    }

    function cardText(card) {
      return normalise(
        (card.getAttribute('data-name') || '') + ' ' +
        (card.getAttribute('data-lang') || '') + ' ' +
        (card.getAttribute('data-category') || '') + ' ' +
        card.textContent
      );
    }

    function apply() {
      var shown = 0;

      cards.forEach(function (card) {
        var matchesFilter = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
        var matchesQuery = !query || cardText(card).indexOf(query) !== -1;
        var visible = matchesFilter && matchesQuery;

        card.classList.toggle('is-hidden', !visible);
        card.setAttribute('aria-hidden', visible ? 'false' : 'true');
        if (visible) shown += 1;
      });

      var label = activeFilter === 'all'
        ? 'all'
        : (filterButtons.filter(function (b) { return b.getAttribute('data-filter') === activeFilter; })[0] || {}).textContent;

      if (status) {
        status.textContent = 'Showing ' + shown + ' of ' + total + ' project' + (total === 1 ? '' : 's') +
          (activeFilter === 'all' ? '' : ' in ' + label.trim().toLowerCase() + '') +
          (query ? ' matching “' + query + '”' : '') + '.';
      }

      if (empty) empty.hidden = shown !== 0;

      var allChip = filterButtons.filter(function (b) { return b.getAttribute('data-filter') === 'all'; })[0];
      if (allChip) {
        var countEl = $('.filter__count', allChip);
        if (countEl) countEl.textContent = String(total);
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.getAttribute('data-filter');
        filterButtons.forEach(function (b) {
          var isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        apply();
      });
    });

    if (search) {
      search.addEventListener('input', function () {
        query = normalise(search.value);
        apply();
      });
      search.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          search.value = '';
          query = '';
          apply();
        }
      });
    }

    apply();
  }

  /* ---------- Copy to clipboard ---------- */
  function initCopy() {
    var buttons = $$('.copy-btn');
    if (!buttons.length) return;

    var toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.style.cssText =
      'position:fixed;left:50%;bottom:26px;transform:translate(-50%,16px);z-index:200;' +
      'padding:.65rem 1.1rem;border-radius:999px;font-size:.86rem;font-weight:600;' +
      'background:var(--surface-solid);border:1px solid var(--border-strong);color:var(--text);' +
      'box-shadow:var(--shadow-lg);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s';
    document.body.appendChild(toast);

    function showToast(message) {
      toast.textContent = message;
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%,0)';
      window.clearTimeout(showToast.timer);
      showToast.timer = window.setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%,16px)';
      }, 1800);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-copy') || '';
        var done = function () {
          btn.classList.add('is-copied');
          showToast('Copied: ' + value);
          window.setTimeout(function () { btn.classList.remove('is-copied'); }, 1600);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done).catch(function () { fallback(value, done); });
        } else {
          fallback(value, done);
        }
      });
    });

    function fallback(value, done) {
      var ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { showToast(value); }
      document.body.removeChild(ta);
    }
  }

  /* ---------- Misc ---------- */
  function initMisc() {
    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function boot() {
    initTheme();
    initNav();
    initReveal();
    initScrollChrome();
    initScrollSpy();
    initProjects();
    initCopy();
    initMisc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
