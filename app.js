// app.js

// Usiamo un IIFE per evitare di sporcare lo scope globale
(() => {
  // =========================
  //        I18N (BILINGUE)
  // =========================
  const I18N_CACHE = new Map();
  const LANG_KEY = 'site_lang';

  // Selettori centralizzati: se cambi il markup, tocchi solo qui
  const SELECTORS = {
    // i18n
    langButtons: '.lang-btn',

    // gallery/lightbox
    galleryScroller: '#galleryScroller',
    scrollLeftBtn: '#scrollLeftBtn',
    scrollRightBtn: '#scrollRightBtn',
    artworkButtons: '.artwork-button',
    lightbox: '#lightbox',
    lightboxImg: '#lightboxImg',
    closeLightboxBtn: '#closeLightbox',
    lightboxPrevBtn: '#lbPrev',
    lightboxNextBtn: '#lbNext',
    yearSpan: '#yearSpan'
  };

async function loadTranslations(lang) {
  if (I18N_CACHE.has(lang)) return I18N_CACHE.get(lang);
  
  const BASE = document.documentElement.dataset.base || "./";
  const basePath = `${BASE}/i18n/${lang}`;

  const files = [
    
    'bio.json',
    'common.json',
    "contact.json",
    "concept.json",
    'loop-space-time.json',
    
    'works.json',
    
  ];

  const responses = await Promise.all(
    files.map(file =>
      fetch(`${basePath}/${file}`, { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : {}))
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
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    // Attributi (es: aria-label:gallery.scrollLeft)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;

      const parts = raw.split(':');
      if (parts.length !== 2) return;

      const attr = parts[0].trim();
      const key = parts[1].trim();

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

    const browser = (navigator.language || 'en').toLowerCase();
    return browser.startsWith('it') ? 'it' : 'en';
  }

  async function setLanguage(lang) {
    const dict = await loadTranslations(lang);
    if (!dict) return;

    applyTranslations(dict);
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    setActiveLangButton(lang);
  }

  function initI18n() {
    const buttons = document.querySelectorAll(SELECTORS.langButtons);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang) setLanguage(lang);
      });
    });

    setLanguage(guessDefaultLang());
  }

  // =========================
  //      GALLERIA/LIGHTBOX
  // =========================

  // Costanti di configurazione: niente numeri magici in giro
  const SCROLL_MIN_AMOUNT = 280;
  const SCROLL_FACTOR = 0.8;

  // Stato interno (non globale)
  const state = {
    currentIndex: -1,
    items: []
  };

  // Funzione di inizializzazione principale
  function init() {
    // i18n prima, così anche aria-label e testi sono coerenti subito
    initI18n();

    const scroller = getElement(SELECTORS.galleryScroller);
    const leftBtn = getElement(SELECTORS.scrollLeftBtn);
    const rightBtn = getElement(SELECTORS.scrollRightBtn);

    state.items = Array.from(document.querySelectorAll(SELECTORS.artworkButtons));

    initGalleryScroll(scroller, leftBtn, rightBtn);
    initLightbox();
    updateCurrentYear();
  }

  // Helper: recupera un elemento e se non esiste lancia warning chiaro
  function getElement(selector) {
    const el = document.querySelector(selector);
    if (!el) {
      console.warn(`Elemento non trovato per il selettore: ${selector}`);
    }
    return el;
  }

  /* =========================
   *  GALLERIA ORIZZONTALE
   * ========================= */

  function initGalleryScroll(scroller, leftBtn, rightBtn) {
    if (!scroller || !leftBtn || !rightBtn) return;

    leftBtn.addEventListener('click', () => scrollGallery(scroller, -1));
    rightBtn.addEventListener('click', () => scrollGallery(scroller, 1));
  }

  function scrollGallery(scroller, direction = 1) {
    const baseAmount = Math.floor(scroller.clientWidth * SCROLL_FACTOR);
    const scrollAmount = Math.max(SCROLL_MIN_AMOUNT, baseAmount);

    scroller.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

  /* =========================
   *        LIGHTBOX
   * ========================= */

  function initLightbox() {
    const lightbox = getElement(SELECTORS.lightbox);
    const closeBtn = getElement(SELECTORS.closeLightboxBtn);
    const prevBtn = getElement(SELECTORS.lightboxPrevBtn);
    const nextBtn = getElement(SELECTORS.lightboxNextBtn);

    if (!lightbox) return;

    // Colleghiamo gli eventi ai pulsanti opera
    state.items.forEach((button, index) => {
      button.addEventListener('click', () => openLightbox(index));

      button.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index);
        }
      });
    });

    // Pulsanti del lightbox
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => showNextItem(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => showNextItem(1));

    // Chiudi cliccando fuori dal contenitore
    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) closeLightbox();
    });

    // Gestione tastiera
    document.addEventListener('keydown', handleKeyDown);
  }

  function openLightbox(index) {
    const lightbox = getElement(SELECTORS.lightbox);
    const lightboxImg = getElement(SELECTORS.lightboxImg);

    if (!lightbox || !lightboxImg || !state.items.length) return;

    state.currentIndex = index;
    const fullSrc = state.items[index].getAttribute('data-full');

    lightboxImg.src = fullSrc;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = getElement(SELECTORS.lightbox);
    const lightboxImg = getElement(SELECTORS.lightboxImg);

    if (!lightbox || !lightboxImg) return;

    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    state.currentIndex = -1;
  }

  function showNextItem(step) {
    const lightboxImg = getElement(SELECTORS.lightboxImg);

    if (!lightboxImg || state.currentIndex < 0 || !state.items.length) return;

    const totalItems = state.items.length;
    const nextIndex = (state.currentIndex + step + totalItems) % totalItems;

    state.currentIndex = nextIndex;
    const nextSrc = state.items[nextIndex].getAttribute('data-full');
    lightboxImg.src = nextSrc;
  }

  function handleKeyDown(event) {
    const lightbox = getElement(SELECTORS.lightbox);
    if (!lightbox || lightbox.classList.contains('hidden')) return;

    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        showNextItem(1);
        break;
      case 'ArrowLeft':
        showNextItem(-1);
        break;
      default:
        break;
    }
  }

  /* =========================
   *       UTILITÀ VARIE
   * ========================= */

  function updateCurrentYear() {
    const yearSpan = getElement(SELECTORS.yearSpan);
    if (!yearSpan) return;
    yearSpan.textContent = new Date().getFullYear();
  }

  // Facciamo partire tutto quando il DOM è pronto
  document.addEventListener('DOMContentLoaded', init);
})();
