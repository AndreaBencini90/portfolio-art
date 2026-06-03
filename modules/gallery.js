// ==========================================================
// gallery.js
// ==========================================================
// Gestisce la galleria orizzontale con pulsanti left/right.
// ==========================================================

import { getElement } from './dom.js';

export function initGallery({ selectors, root = document }) {
  const scroller = getElement(selectors.galleryScroller, root);
  const left = getElement(selectors.scrollLeftBtn, root);
  const right = getElement(selectors.scrollRightBtn, root);

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
