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
  eleventyConfig.addPassthroughCopy({ "modules": "modules" });

  // File speciali per pubblicazione su GitHub Pages
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "sitemap.xml": "sitemap.xml" });

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
