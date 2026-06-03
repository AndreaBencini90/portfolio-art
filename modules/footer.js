// ==========================================================
// footer.js
// ==========================================================
// Aggiorna l'anno corrente nel footer.
// ==========================================================

import { getElement } from './dom.js';

export function updateCurrentYear({ selectors, root = document }) {
  const el = getElement(selectors.yearSpan, root);
  if (el) el.textContent = new Date().getFullYear();
}
