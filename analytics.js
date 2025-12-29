// analytics.js
(function () {
  const GA_ID = 'G-NXDWCDVM1V'; // <-- il tuo ID GA4

  // carica lo script gtag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // inizializza dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip: true   // 👈 buona pratica GDPR
  });
})();
