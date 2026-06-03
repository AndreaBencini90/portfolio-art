// ==========================================================
// dropdown.js
// ==========================================================
// Gestisce il dropdown "About" tap-to-open:
// - toggle con click
// - chiusura su click esterno, ESC, resize
// ==========================================================

import { getElement } from './dom.js';

export function initDropdownTapToOpen({ selectors, root = document, win = window }) {
  const dropdown = getElement(selectors.navDropdown, root);
  const trigger = getElement(selectors.navDropdownTrigger, root);
  const menu = getElement(selectors.navDropdownMenu, root);

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
    e.stopPropagation();
    toggle();
  });

  // Click su link interni -> chiudi
  menu.addEventListener('click', e => {
    if (e.target.closest('a')) close();
  });

  // Click fuori -> chiudi
  root.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) close();
  });

  // ESC -> chiudi
  root.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Resize -> reset stato
  win.addEventListener('resize', close);
}
