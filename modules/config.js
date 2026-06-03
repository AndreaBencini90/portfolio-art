// ==========================================================
// config.js
// ==========================================================
// Contiene configurazioni condivise:
// - selettori centralizzati
// - chiavi e lista file per i18n
// ==========================================================

export const LANG_KEY = 'site_lang';

export const I18N_FILES = [
  'common.json',
  'bio.json',
  'concept.json',
  'contact.json',
  'works.json',
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
