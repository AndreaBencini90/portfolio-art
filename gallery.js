document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImg");

  if (!lightbox || !imgEl) {
    console.warn("gallery.js: manca #lightbox o #lightboxImg");
    return;
  }

  let items = [];
  let index = 0;

  function srcOf(el) {
    return el.getAttribute("href");
  }

  function openAt(i) {
    index = i;
    imgEl.src = srcOf(items[index]);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    imgEl.src = "";
  }

  function next() {
    index = (index + 1) % items.length;
    imgEl.src = srcOf(items[index]);
  }

  function prev() {
    index = (index - 1 + items.length) % items.length;
    imgEl.src = srcOf(items[index]);
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest('a.collection-card[data-gallery]');
    if (!card) return;

    e.preventDefault();

    const g = card.getAttribute("data-gallery");
    items = Array.from(document.querySelectorAll(`a.collection-card[data-gallery="${g}"]`));

    const i = items.indexOf(card);
    if (i < 0) return;

    openAt(i);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) close();
    if (e.target.matches("[data-next]")) next();
    if (e.target.matches("[data-prev]")) prev();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
});
