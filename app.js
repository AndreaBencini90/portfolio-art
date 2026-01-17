// ==========================================================
// app.js
// ==========================================================
// Questo file gestisce:
// - i18n (bilingue)
// - gallery orizzontale
// - lightbox
// - dropdown "About" tap-to-open
//
// Architettura:
// - IIFE per non sporcare lo scope globale
// - UN SOLO DOMContentLoaded
// - Tutte le init passano da init()
// ==========================================================

(() => {

  /* ========================================================
     COSTANTI & SELETTORI CENTRALIZZATI
     ======================================================== */

  const I18N_CACHE = new Map();
  const LANG_KEY = 'site_lang';

  // Se cambi il markup, tocchi SOLO qui
  const SELECTORS = {
    // i18n
    langButtons: '.lang-btn',

    // dropdown
    navDropdown: '.nav-dropdown',
    navDropdownTrigger: '.nav-dropdown-trigger',
    navDropdownMenu: '.nav-dropdown-menu',

    // gallery
    galleryScroller: '#galleryScroller',
    scrollLeftBtn: '#scrollLeftBtn',
    scrollRightBtn: '#scrollRightBtn',
    artworkButtons: '.artwork-button',

    // lightbox
    lightbox: '#lightbox',
    lightboxImg: '#lightboxImg',
    closeLightboxBtn: '#closeLightbox',
    lightboxPrevBtn: '#lbPrev',
    lightboxNextBtn: '#lbNext',

    // footer
    yearSpan: '#yearSpan'
  };

  /* ========================================================
     STATO INTERNO (non globale)
     ======================================================== */

  const state = {
    currentIndex: -1,
    items: []
  };

  /* ========================================================
     INIT PRINCIPALE
     ========================================================
     Qui passa TUTTO.
     Se qualcosa non va, lo vedi subito.
  ======================================================== */

  function init() {
    initI18n();
    initDropdownTapToOpen();
    initGallery();
    initLightbox();
    updateCurrentYear();
  }

  /* ========================================================
     HELPER
     ======================================================== */

  function getElement(selector) {
    const el = document.querySelector(selector);
    if (!el) console.warn(`Elemento non trovato: ${selector}`);
    return el;
  }

  /* ========================================================
     I18N (BILINGUE)
     ======================================================== */

  async function loadTranslations(lang) {
    if (I18N_CACHE.has(lang)) return I18N_CACHE.get(lang);

    const BASE = document.documentElement.dataset.base || './';
    const basePath = `${BASE}/i18n/${lang}`;

    const files = [
      'common.json',
      'bio.json',
      'concept.json',
      'contact.json',
      'works.json',
      'loop-space-time.json'
    ];

    const responses = await Promise.all(
      files.map(f =>
        fetch(`${basePath}/${f}`, { cache: 'no-store' })
          .then(r => r.ok ? r.json() : {})
      )
    );

    const dict = Object.assign({}, ...responses);
    I18N_CACHE.set(lang, dict);
    return dict;
  }

  function applyTranslations(dict) {
    if (!dict) return;

    // Testi
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] != null) el.textContent = dict[key];
    });

    // Attributi (aria-label, alt, ecc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const [attr, key] = el.dataset.i18nAttr.split(':');
      if (dict[key] != null) el.setAttribute(attr, dict[key]);
    });
  }

  function setActiveLangButton(lang) {
    document.querySelectorAll(SELECTORS.langButtons).forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });
  }

  function guessDefaultLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) return saved;
    return navigator.language?.startsWith('it') ? 'it' : 'en';
  }

  async function setLanguage(lang) {
    const dict = await loadTranslations(lang);
    applyTranslations(dict);
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    setActiveLangButton(lang);
  }

  function initI18n() {
    document.querySelectorAll(SELECTORS.langButtons).forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });

    setLanguage(guessDefaultLang());
  }

  /* ========================================================
     DROPDOWN "ABOUT" – TAP TO OPEN
     ========================================================
     PROBLEMA DI PRIMA:
     - CSS reagiva solo a :hover / :focus-within
     - JS aggiungeva .is-open ma CSS non lo usava

     SOLUZIONE:
     - JS aggiunge/toglie .is-open
     - CSS contiene:
       .nav-dropdown.is-open .nav-dropdown-menu { visibile }
  ======================================================== */

  function initDropdownTapToOpen() {
    const dropdown = document.querySelector(SELECTORS.navDropdown);
    const trigger = document.querySelector(SELECTORS.navDropdownTrigger);
    const menu = document.querySelector(SELECTORS.navDropdownMenu);

    // Se la pagina non ha il dropdown, esco
    if (!dropdown || !trigger || !menu) return;

    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');

    const open = () => {
      dropdown.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    const toggle = () => {
      dropdown.classList.contains('is-open') ? close() : open();
    };

    // TAP sul bottone
    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation(); // ← QUESTO ERA FONDAMENTALE
      toggle();
    });

    // Click su link interni → chiudi
    menu.addEventListener('click', e => {
      if (e.target.closest('a')) close();
    });

    // Click fuori → chiudi
    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) close();
    });

    // ESC → chiudi
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });

    // Resize → reset stato
    window.addEventListener('resize', close);
  }

  /* ========================================================
     GALLERIA ORIZZONTALE
     ======================================================== */

  function initGallery() {
    const scroller = getElement(SELECTORS.galleryScroller);
    const left = getElement(SELECTORS.scrollLeftBtn);
    const right = getElement(SELECTORS.scrollRightBtn);

    if (!scroller || !left || !right) return;

    const SCROLL_FACTOR = 0.8;
    const MIN_SCROLL = 280;

    const scroll = dir => {
      const amount = Math.max(
        MIN_SCROLL,
        Math.floor(scroller.clientWidth * SCROLL_FACTOR)
      );
      scroller.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    left.addEventListener('click', () => scroll(-1));
    right.addEventListener('click', () => scroll(1));
  }

  /* ========================================================
     LIGHTBOX
     ======================================================== */

  function initLightbox() {
    const lightbox = getElement(SELECTORS.lightbox);
    const img = getElement(SELECTORS.lightboxImg);

    if (!lightbox || !img) return;

    state.items = Array.from(document.querySelectorAll(SELECTORS.artworkButtons));

    state.items.forEach((btn, i) => {
      btn.addEventListener('click', () => openLightbox(i));
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    getElement(SELECTORS.closeLightboxBtn)?.addEventListener('click', closeLightbox);
    getElement(SELECTORS.lightboxPrevBtn)?.addEventListener('click', () => navigate(-1));
    getElement(SELECTORS.lightboxNextBtn)?.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (state.currentIndex < 0) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    });
  }

  function openLightbox(index) {
    const lightbox = getElement(SELECTORS.lightbox);
    const img = getElement(SELECTORS.lightboxImg);

    state.currentIndex = index;
    img.src = state.items[index].dataset.full;

    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = getElement(SELECTORS.lightbox);
    const img = getElement(SELECTORS.lightboxImg);

    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    img.src = '';
    document.body.style.overflow = '';
    state.currentIndex = -1;
  }

  function navigate(step) {
    const total = state.items.length;
    state.currentIndex = (state.currentIndex + step + total) % total;
    getElement(SELECTORS.lightboxImg).src =
      state.items[state.currentIndex].dataset.full;
  }

  /* ========================================================
     FOOTER
     ======================================================== */

  function updateCurrentYear() {
    const el = getElement(SELECTORS.yearSpan);
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ========================================================
     BOOT
     ======================================================== */

  document.addEventListener('DOMContentLoaded', init);

})();
