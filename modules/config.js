// ==========================================================
// config.js
// ==========================================================
// Contiene configurazioni condivise:
// - selettori centralizzati
// - chiavi e lista file per i18n
// ==========================================================

export const LANG_KEY = 'site_lang';

// Solo le pagine ancora "a chiavi" (Tipo B): il menu/footer (common.json, sempre),
// Concept e le 4 pagine del ciclo Loop SpaceTime. Le altre pagine (home, works, bio,
// press, contact, Method, Emotion in Matter) sono prosa libera: niente chiavi da caricare.
export const I18N_FILES = [
  'common.json',
  'concept.json',
  'loop-space-time.json'
];

// Se cambi il markup, tocchi SOLO qui
export const SELECTORS = {
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
