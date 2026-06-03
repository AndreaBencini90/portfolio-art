// ==========================================================
// lightbox.js
// ==========================================================
// Gestisce:
// - apertura/chiusura lightbox
// - navigazione tra immagini
// - keyboard shortcuts (ESC, frecce)
// ==========================================================

import { getElement, getElements } from './dom.js';

export function initLightbox({ selectors, root = document }) {
  const lightbox = getElement(selectors.lightbox, root);
  const img = getElement(selectors.lightboxImg, root);

  if (!lightbox || !img) return;

  const state = {
    currentIndex: -1,
    items: getElements(selectors.artworkButtons, root)
  };

  const openLightbox = index => {
    state.currentIndex = index;
    img.src = state.items[index].dataset.full;

    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    root.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    img.src = '';
    root.body.style.overflow = '';
    state.currentIndex = -1;
  };

  const navigate = step => {
    const total = state.items.length;
    state.currentIndex = (state.currentIndex + step + total) % total;
    img.src = state.items[state.currentIndex].dataset.full;
  };

  state.items.forEach((btn, i) => {
    btn.addEventListener('click', () => openLightbox(i));
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  getElement(selectors.closeLightboxBtn, root)?.addEventListener('click', closeLightbox);
  getElement(selectors.lightboxPrevBtn, root)?.addEventListener('click', () => navigate(-1));
  getElement(selectors.lightboxNextBtn, root)?.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  root.addEventListener('keydown', e => {
    if (state.currentIndex < 0) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
  });
}
