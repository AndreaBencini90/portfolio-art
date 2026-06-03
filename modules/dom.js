// ==========================================================
// dom.js
// ==========================================================
// Piccoli helper DOM per ridurre rumore:
// - getElement: query singola con warning se manca
// - getElements: query multipla in array
// ==========================================================

export function getElement(selector, root = document) {
  const el = root.querySelector(selector);
  if (!el) console.warn(`Elemento non trovato: ${selector}`);
  return el;
}

export function getElements(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}
