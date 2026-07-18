module.exports = function (eleventyConfig) {
  // ==========================================================
  // Passthrough: file statici copiati as-is in _site.
  // Al momento vivono nella radice del repo (eredità export GrapesJS).
  // key = percorso sorgente (dalla radice progetto), value = percorso in _site.
  // ==========================================================
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "img": "img" });
  eleventyConfig.addPassthroughCopy({ "modules": "modules" });
  eleventyConfig.addPassthroughCopy({ "i18n": "i18n" });
  eleventyConfig.addPassthroughCopy({ "style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "contact-style.css": "contact-style.css" });
  eleventyConfig.addPassthroughCopy({ "collection/collectionStyle.css": "collection/collectionStyle.css" });
  eleventyConfig.addPassthroughCopy({ "app.js": "app.js" });
  eleventyConfig.addPassthroughCopy({ "analytics.js": "analytics.js" });
  eleventyConfig.addPassthroughCopy({ "gallery.js": "gallery.js" });
  eleventyConfig.addPassthroughCopy({ "modules": "modules" });

  // File speciali per pubblicazione su GitHub Pages
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "sitemap.xml": "sitemap.xml" });

  // ==========================================================
  // Shortcode: placeholder "grafo" generativo per le opere non ancora esportate.
  // Uso: {% graphPlaceholder "#E8350A", "In arrivo", "GnRH" %}
  //  - bg    = colore o gradiente CSS di sfondo
  //  - label = etichetta in basso a sinistra
  //  - seed  = stringa per rendere il grafo unico (es. nome molecola)
  // ==========================================================
  eleventyConfig.addShortcode("graphPlaceholder", (bg, label = "", seed = "") => {
    const W = 400, H = 240, N = 12;
    let s = 0;
    const seedStr = String(seed || label || bg || "x");
    for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };

    const nodes = Array.from({ length: N }, () => ({
      x: 28 + rnd() * (W - 56),
      y: 26 + rnd() * (H - 52),
      r: 2.6 + rnd() * 3.4
    }));

    const edges = [];
    for (let i = 0; i < N; i++) {
      const near = nodes
        .map((n, j) => ({ j, d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 }))
        .filter(o => o.j !== i)
        .sort((a, b) => a.d - b.d);
      edges.push([i, near[0].j]);
      if (rnd() > 0.5) edges.push([i, near[1].j]);
    }

    const lines = edges
      .map(([a, b]) => `<line x1="${nodes[a].x.toFixed(1)}" y1="${nodes[a].y.toFixed(1)}" x2="${nodes[b].x.toFixed(1)}" y2="${nodes[b].y.toFixed(1)}"/>`)
      .join("");
    const circles = nodes
      .map(n => `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}"/>`)
      .join("");
    const lbl = label
      ? `<text x="14" y="${H - 14}" fill="#ffffff" fill-opacity="0.9" font-family="Inter, sans-serif" font-size="11" font-weight="600" letter-spacing="1.4">${String(label).toUpperCase()}</text>`
      : "";

    return `<svg class="graph-ph" viewBox="0 0 ${W} ${H}" width="100%" height="220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="display:block; background:${bg};" role="img" aria-label="Grafo (anteprima)">`
      + `<g stroke="#ffffff" stroke-opacity="0.42" stroke-width="1.4">${lines}</g>`
      + `<g fill="#ffffff" fill-opacity="0.92">${circles}</g>`
      + lbl
      + `</svg>`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    // I template .html vengono processati da Nunjucks (per il layout condiviso)
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
