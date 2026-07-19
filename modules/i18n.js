// ==========================================================
// i18n.js
// ==========================================================
// Scopo:
// - carica i dizionari i18n da /i18n/<lang>/*.json
// - applica testi e attributi ai nodi con data-i18n / data-i18n-attr
// - collega i pulsanti lingua e aggiorna la lingua del documento
//
// Effetto complessivo:
// - all'avvio imposta una lingua di default
// - aggiorna il DOM senza ricaricare la pagina
// ==========================================================

import { getElements } from './dom.js';

const cache = new Map();

// Carica e unisce i JSON di una lingua; usa cache in memoria.
async function loadTranslations(lang, files, basePath) {
  const cacheKey = `${lang}:${basePath}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const responses = await Promise.all(
    files.map(file =>
      fetch(`${basePath}/${file}`, { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : {}))
    )
  );

  const dict = Object.assign({}, ...responses);
  cache.set(cacheKey, dict);
  return dict;
}

// Applica al DOM testi e attributi secondo il dizionario.
function applyTranslations(dict, root) {
  if (!dict) return;

  // Testi
  getElements('[data-i18n]', root).forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] != null) el.textContent = dict[key];
  });

  // Attributi (aria-label, alt, ecc.)
  getElements('[data-i18n-attr]', root).forEach(el => {
    const [attr, key] = el.dataset.i18nAttr.split(':');
    if (dict[key] != null) el.setAttribute(attr, dict[key]);
  });
}

// Evidenzia il bottone lingua attivo.
function setActiveLangButton(lang, selectors, root) {
  getElements(selectors.langButtons, root).forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });
}

// Sceglie la lingua iniziale: preferenza salvata o fallback in base al browser.
// Se la pagina dichiara una lingua "fissa" (data-lang-fixed, pagine di prosa libera
// tipo Method/Emotion in Matter), usa SEMPRE quella, ignorando localStorage/browser:
// il testo di quella pagina esiste solo in quella lingua.
function guessDefaultLang(langKey, doc) {
  if (doc?.documentElement?.dataset.langFixed) {
    return doc.documentElement.lang || 'it';
  }
  const saved = localStorage.getItem(langKey);
  if (saved) return saved;
  return navigator.language?.startsWith('it') ? 'it' : 'en';
}

// Flusso completo di cambio lingua: carica, applica, aggiorna <html lang>.
async function setLanguage(lang, options) {
  const { selectors, langKey, files, root, doc } = options;

  // Se <html> non ha data-base, usa percorsi assoluti dalla radice (/i18n/...),
  // così funziona da qualsiasi profondità di URL (clean-URL).
  const rawBase = doc.documentElement.dataset.base;
  const base = (rawBase === undefined || rawBase === null) ? '' : rawBase;
  const basePath = `${base}/i18n/${lang}`;

  const dict = await loadTranslations(lang, files, basePath);
  applyTranslations(dict, root);
  doc.documentElement.lang = lang;
  localStorage.setItem(langKey, lang);
  setActiveLangButton(lang, selectors, root);
}

// Inizializza i18n: registra i click e imposta la lingua di partenza.
export function initI18n({ selectors, langKey, files, root = document }) {
  const doc = root;

  getElements(selectors.langButtons, root).forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.dataset.lang;
      // Pagine di prosa libera (Method, Emotion in Matter...) dichiarano l'URL
      // della loro gemella nell'altra lingua: in quel caso il bottone NAVIGA,
      // invece di tradurre il testo sul posto (che qui non esiste come chiavi).
      const translationUrl = doc.documentElement.dataset.translationUrl;
      const currentLang = doc.documentElement.lang || 'it';
      if (translationUrl && targetLang !== currentLang) {
        localStorage.setItem(langKey, targetLang);
        window.location.href = translationUrl;
        return;
      }
      setLanguage(targetLang, { selectors, langKey, files, root, doc });
    });
  });

  setLanguage(guessDefaultLang(langKey, doc), { selectors, langKey, files, root, doc });
}
