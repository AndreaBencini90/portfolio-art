// ==========================================================
// app.js
// ==========================================================
// Questo file fa solo bootstrapping delle funzionalita:
// - i18n (bilingue)
// - dropdown "About" tap-to-open
// - galleria orizzontale
// - lightbox
// - anno corrente nel footer
//
// Le logiche sono separate in /modules per mantenibilita.
// ==========================================================

import { SELECTORS, LANG_KEY, I18N_FILES } from './modules/config.js';
import { initI18n } from './modules/i18n.js';
import { initDropdownTapToOpen } from './modules/dropdown.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { updateCurrentYear } from './modules/footer.js';

function init() {
  initI18n({ selectors: SELECTORS, langKey: LANG_KEY, files: I18N_FILES });
  initDropdownTapToOpen({ selectors: SELECTORS });
  initGallery({ selectors: SELECTORS });
  initLightbox({ selectors: SELECTORS });
  updateCurrentYear({ selectors: SELECTORS });
}

document.addEventListener('DOMContentLoaded', init);
